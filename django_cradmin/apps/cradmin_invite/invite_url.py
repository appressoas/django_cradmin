from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string

from django_cradmin.apps.cradmin_generic_token_with_metadata.models import GenericTokenWithMetadata, \
    get_expiration_datetime_for_app


class InviteUrl(object):
    """
    Sends an email with a link that the user clicks to accept an invite.

    Example:
        ::

            from django_cradmin.apps.cradmin_invite.utils import InviteUrl

            class InviteUrl(InviteUrl):
                def get_appname(self):
                    return 'myapp'

                def get_confirm_invite_url(self, generictoken):
                    return reverse('myapp-confirm-invite', kwargs={
                        'token': generictoken.token
                    })

            def myview(request):
                InviteUrl(request=request, private=True, content_object=someobject).send_email(
                    'test@example.com', 'test2@example.com')
                # ... or ...
                share_url = InviteUrl(request=request, private=False, content_object=someobject).get_share_url()
                # ... or ...
                InviteUrl(request=request, private=False, content_object=someobject).send_email(
                    'test@example.com', 'test2@example.com', 'test3@example.com')
    """

    #: The email subject template.
    email_subject_template = 'cradmin_invite/email/subject.django.txt'

    #: The email message template.
    email_message_template = 'cradmin_invite/email/message.django.txt'

    def __init__(self, request, private, content_object, metadata=None, **kwargs):
        """

        Parameters:
            request: A Django HttpRequest object.
            private: If this is ``True`` we send unique single-use invite URLs.
            metadata: Metadata to accociate with the invite.

        """
        self.request = request
        self.private = private
        self.content_object = content_object
        self.metadata = metadata
        if 'expiration_datetime' in kwargs:
            self.expiration_datetime = kwargs['expiration_datetime']

    def get_email_subject_template(self):
        return self.email_subject_template

    def get_email_message_template(self):
        return self.email_message_template

    def get_appname(self):
        """
        Get the appname for
        :obj:`django_cradmin.apps.cradmin_generic_token_with_metadata.models.GenericTokenWithMetadata.app`.

        You must override this in subclasses.
        """
        raise NotImplementedError()

    def get_confirm_invite_url(self, generictoken):
        """
        Get the confirm invite view URL.

        Must be implemented in subclasses.

        Parameters:
            generictoken: A
                :class:`~django_cradmin.apps.cradmin_generic_token_with_metadata.models.GenericTokenWithMetadata`
                object.
        """
        raise NotImplementedError()

    def __get_absolute_confirm_invite_url(self, generictoken):
        return self.request.build_absolute_uri(self.get_confirm_invite_url(generictoken))

    def render_email_subject(self, generictoken):
        return render_to_string(
            self.get_email_subject_template(),
            self.get_email_template_context_data(generictoken)
        ).strip()

    def render_email_message(self, generictoken):
        return render_to_string(
            self.get_email_message_template(),
            self.get_email_template_context_data(generictoken)
        ).strip()

    def get_email_template_context_data(self, generictoken):
        """
        Get the context data of the email templates.
        """
        return {
            'DJANGO_CRADMIN_SITENAME': settings.DJANGO_CRADMIN_SITENAME,
            'confirm_invite_url': self.__get_absolute_confirm_invite_url(generictoken)
        }

    def get_from_email(self):
        """
        Get the email sender address.

        Defaults to the ``DJANGO_CRADMIN_INVITE_FROM_EMAIL`` setting
        falling back on the ``DEFAULT_FROM_EMAIL`` setting.
        """
        return getattr(settings, 'DJANGO_CRADMIN_INVITE_FROM_EMAIL', settings.DEFAULT_FROM_EMAIL)

    def get_expiration_datetime(self):
        """
        Get the value to use for the ``expiration_datetime`` attribute of
        :class:`~django_cradmin.apps.cradmin_generic_token_with_metadata.models.GenericTokenWithMetadata`.

        Defaults to the expiration_datetime provided via the constructor,
        and falls back to getting the configured expiration datetime for
        the app.
        """
        if hasattr(self, 'expiration_datetime'):
            return self.expiration_datetime
        else:
            return get_expiration_datetime_for_app(self.get_appname())

    def _generate_generictoken(self, email=None):
        metadata = self.metadata
        if email:
            if self.metadata is None:
                metadata = {'email': email}
            elif isinstance(self.metadata, dict):
                if 'email' not in self.metadata:
                    metadata = self.metadata.copy()
                    metadata['email'] = email

        return GenericTokenWithMetadata.objects.generate(
            app=self.get_appname(),
            expiration_datetime=self.get_expiration_datetime(),
            content_object=self.content_object,
            metadata=metadata
        )

    def generate_generictoken(self, email=None):
        if self.private:
            # If private generate unique tokens
            return self._generate_generictoken(email=email)
        else:
            # If public, re-use the same token and ignore email argument
            if hasattr(self, '_generictoken'):
                return self._generictoken
            else:
                self._generictoken = self._generate_generictoken()
                return self._generictoken

    def send_email(self, *emails):
        """
        Generate a token and send an email containing an absolute invite
        URL for that token.

        If this InviteUrl is private, we generate a new token each
        email recipient, and if it is public, we re-use the same
        token.

        Private tokens are generated as single use tokens, and public tokens
        are unlimited use tokens.

        Private tokens gets the email automatically added to the metadata
        if metadata is a dict or None.
        """
        # TODO: Re-use email connection
        for email in emails:
            generictoken = self.generate_generictoken(email)
            send_mail(
                subject=self.render_email_subject(generictoken),
                message=self.render_email_message(generictoken),
                from_email=self.get_from_email(),
                recipient_list=[email]
            )

    def get_share_url(self):
        """
        Generate a token and return an absolute invite URL for that token.

        If this InviteUrl is private, we generate a new token each
        time this is called, and if it is public, we re-use the same
        token.

        Private tokens are generated as single use tokens, and public tokens
        are unlimited use tokens.
        """
        generictoken = self.generate_generictoken()
        return self.__get_absolute_confirm_invite_url(generictoken)

    # def get_tokens_stored_for_app(self):
    #     return GenericTokenWithMetadata.objects.filter_not_expired().filter(app=self.get_appname())
