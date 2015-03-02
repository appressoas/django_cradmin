import json
import uuid
from datetime import timedelta
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models, IntegrityError
from django.db.models import QuerySet
from django.utils import timezone


def _get_current_datetime():
    return timezone.now()


def get_time_to_live_minutes(app):
    """
    Get the configured time to live in minutes for tokens for the given ``app``.
    """
    time_to_live_minutes = getattr(
        settings,
        'DJANGO_CRADMIN_SECURE_USER_TOKEN_TIME_TO_LIVE_MINUTES', {
            'default': 60*24*4  # Default to 4 days
        })
    return time_to_live_minutes.get(app, time_to_live_minutes['default'])


def get_current_expiration_datetime(app):
    """
    Get the expiration datetime of tokens for the given ``app``
    relative to ``now``.

    If the given app is configured to with 60 minutes time to live,
    this will return a datetime object representing 60 minutes in the future.
    """
    time_to_live_minutes = get_time_to_live_minutes(app)
    return _get_current_datetime() + timedelta(minutes=time_to_live_minutes)


def generate_token():
    """
    Generate a token for the :obj:`.GenericTokenWithMetadata.token` field.

    Joins an UUID1 (unique uuid) with an UUID4 (random uuid), so the chance
    of this not beeing unique is very low, and guessing this is
    very hard.

    Returns:
        A token that is very unlikely to not be unique.
    """
    return u'{}-{}'.format(uuid.uuid1(), uuid.uuid4())


class GenericTokenWithMetadataQuerySet(QuerySet):
    """
    QuerySet for :class:`.GenericTokenWithMetadata`.
    """
    def unsafe_pop(self, app, token):
        """
        Get the :class:`.GenericTokenWithMetadata` matching the given
        `token` and `app`. Removes the GenericTokenWithMetadata from the database, and
        returns the `GenericTokenWithMetadata` object.

        You should normally use :meth:`.GenericTokenWithMetadataBaseManager.pop`
        instead of this.

        Raises:
            GenericTokenWithMetadata.DoesNotExist if no matching token is stored for
            the given app.
        """
        token = self.get(token=token, app=app)
        token.delete()
        return token

    def filter_has_expired(self):
        """
        Return a queryset containing only the expired GenericTokenWithMetadata objects in
        the current queryset.
        """
        return self.filter(expiration_datetime__lt=_get_current_datetime())

    def filter_not_expired(self):
        """
        Return a queryset containing only the un-expired GenericTokenWithMetadata objects in
        the current queryset.
        """
        return self.filter(expiration_datetime__gte=_get_current_datetime())


class GenericTokenWithMetadataBaseManager(models.Manager):
    """
    Manager for :class:`.GenericTokenWithMetadata`.

    Inherits all methods from :class:`.GenericTokenWithMetadataQuerySet`.
    """
    def generate(self, app, user, metadata=None):
        """
        Generate and save a token for the given user and app.

        Returns:
            A :class:`.GenericTokenWithMetadata` object with a token
            that is guaranteed to be unique.
        """
        token = generate_token()
        user_single_use_token = GenericTokenWithMetadata(
            user=user, app=app, token=token,
            created_datetime=_get_current_datetime(),
            expiration_datetime=get_current_expiration_datetime(app))
        if metadata:
            user_single_use_token.set_metadata(metadata)

        try:
            user_single_use_token.full_clean()
        except ValidationError as e:
            if 'token' in e.error_dict and e.error_dict['token'][0].code == 'unique':
                return self.generate(app, user, metadata)
            else:
                raise

        try:
            user_single_use_token.save()
        except IntegrityError:
            return self.generate(app, user)
        else:
            return user_single_use_token

    def pop(self, app, token):
        """
        Get the :class:`.GenericTokenWithMetadata` matching the given
        `token` and `app`. Removes the GenericTokenWithMetadata from the database, and
        returns the `GenericTokenWithMetadata` object.

        Does not return expired tokens.

        Raises:
            GenericTokenWithMetadata.DoesNotExist: If no matching token is stored for the
                given app, or if the token is expired.
        """
        return self.filter_not_expired().unsafe_pop(app=app, token=token)

    def delete_expired(self):
        """
        Delete all expired tokens.
        """
        self.filter_has_expired().delete()


class GenericTokenWithMetadata(models.Model):
    """
    Provides a secure token with attached metadata suitable for
    email and sharing workflows like password reset, public share urls, etc.
    """
    objects = GenericTokenWithMetadataBaseManager.from_queryset(GenericTokenWithMetadataQuerySet)()

    #: The app that generated the token.
    #: You should set this to the name of the app the
    #: generated the token.
    app = models.CharField(db_index=True, max_length=255)

    #: A unique and random token, set it using :func:`.generate_token`.
    token = models.CharField(max_length=100, unique=True)

    #: Datetime when the token was created.
    created_datetime = models.DateTimeField()

    #: Datetime when the token expires.
    #: This can be `None`, which means that the token does not expire.
    expiration_datetime = models.DateTimeField(null=True)

    #: Single use?
    #: If this is `False`, the token can be used an unlimited number of
    #: times.
    single_use = models.BooleanField(default=True)

    #: The user that the token is for.
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, default=None)

    #: JSON encoded metadata
    metadata_json = models.TextField(null=False, blank=True, default='')

    def is_expired(self):
        """
        Returns `True` if :obj:`.GenericTokenWithMetadata.expiration_datetime` is in the past,
        and `False` if it is in the future or now.
        """
        return self.expiration_datetime is not None and self.expiration_datetime < _get_current_datetime()

    def get_metadata(self):
        """
        Decode :obj:`.GenericTokenWithMetadata.metadata_json` and return the result.

        Return `None` if metadata_json is empty.
        """
        if self.metadata_json:
            return json.loads(self.metadata_json)
        else:
            return None

    def set_metadata(self, metadata):
        """
        Set :obj:`.GenericTokenWithMetadata.metadata_json`. Encodes the given
        metadata using `json.dumps`.
        """
        self.metadata_json = json.dumps(metadata)
