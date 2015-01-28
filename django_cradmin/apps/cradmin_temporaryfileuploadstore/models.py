import fnmatch
import mimetypes
import os
import time
import uuid
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _


class TemporaryFileCollectionQuerySet(models.query.QuerySet):
    def filter_for_user(self, user):
        return self.filter(user=user)


class TemporaryFileCollectionManager(models.Manager):
    def get_queryset(self):
        return TemporaryFileCollectionQuerySet(self.model, using=self._db)

    def filter_for_user(self, user):
        return self.get_queryset().filter_for_user(user)


def html_input_accept_match(accept, mimetype, filename):
    filename = filename.lower()
    for pattern in accept.split(','):
        if '/' in pattern:
            if mimetype and fnmatch.fnmatch(mimetype, pattern):
                return True
        elif pattern.startswith('.'):
            if os.path.splitext(filename)[1] == pattern:
                return True
        else:
            if fnmatch.fnmatch(filename, pattern):
                return True
    return False


class TemporaryFileCollection(models.Model):
    """
    A collection of temporary files uploaded by a user.

    This model is used by apps to store temporary files
    uploaded through the temporary file upload API. The typical
    workflow is:

    1. Upload some files (a collection of files) file via the API.
    2. Use the IDs returned by the API to POST a form that uses
       file uploads.
    3. In the code handling the form POST request, retrieve the temporary
       file(s), move them into some form of persistent storage (perhaps
       after manipulating the file in some way).
    4. Delete the collection.

    The ``accept``, ``max_filename_length`` and ``prevent_filename_duplicates``
    attributes are set by the client. This means that you can not trust them
    and have to perform error checking when you process temporary files. This
    is not really a problem since:

    1. You should have error checking in the views that
       use TemporaryFileCollection.
    2. If you have error checking in your views, the only thing
       the user can do by manipulating the API call is to cause
       themselves a less user-friendly experience - they will typically
       get an error when they post the form containing the
       hidden field with the collection-id instead of when they upload
       a file.
    """
    objects = TemporaryFileCollectionManager()
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        help_text='The user that owns this temporary file. Users should not'
                  'be allowed access to other users temporary files.')
    created_datetime = models.DateTimeField(auto_now_add=True)
    minutes_to_live = models.PositiveIntegerField(
        default=60,
        help_text='The number of minutes the app requests that this '
                  'file collection should be kept before automatic removal. '
                  'This is used by automatic cleanup jobs to determine '
                  'what to delete. You should not rely on the file beeing '
                  'automatically deleted after this number of minutes, and '
                  'you should always delete files explicitly as part of the '
                  'file upload process.'
    )
    accept = models.TextField(
        null=False, blank=True, default='',
        help_text='An html input field accept attribute formatted string. '
                  'This is validated by the API on upload.')
    max_filename_length = models.IntegerField(
        null=True, blank=True, default=None,
        help_text='If specified, we shorten filenames to maximum the specified length. '
                  'This is validated by the API on upload.')
    prevent_filename_duplicates = models.BooleanField(
        null=False, default=False,
        help_text='If this is True, we add random data when we '
                  'detect duplicate filenames. The duplicate prevention '
                  'algorithm handles max_filename.'
                  'This is validated by the API on upload.')

    def clear_files(self):
        for temporaryfile in self.files.all():
            temporaryfile.delete_object_and_file()

    def is_supported_filetype(self, mimetype, filename):
        if self.accept:
            return html_input_accept_match(self.accept, mimetype, filename)
        else:
            return True


def temporary_file_upload_to(instance, filename):
    filename, extension = os.path.splitext(filename)
    if instance.collection_id is None:
        raise AttributeError('temporary_file_upload_to() requires a TemporaryFile with '
                             'a collection that has been saved to the database.')
    return u'{directory}/{collectionid}/{uuid}_{timestamp}{extension}'.format(
        directory=getattr(settings, 'CRADMIN_TEMPORARYFILEUPLOADSTORE_UPLOAD_DIRECTORY',
                          'cradmin_temporaryfileuploadstore'),
        collectionid=instance.collection_id,
        uuid=uuid.uuid4(),
        timestamp=time.time(),
        extension=extension)


class TemporaryFile(models.Model):
    """
    A temporary file uploaded by a user.
    """
    collection = models.ForeignKey(
        TemporaryFileCollection, on_delete=models.CASCADE,
        related_name='files')
    filename = models.TextField(db_index=True)
    file = models.FileField(
        upload_to=temporary_file_upload_to)
    mimetype = models.TextField(null=False, blank=True, default='')

    def delete_object_and_file(self):
        self.file.delete()
        self.delete()

    def set_mimetype_from_filename(self):
        self.mimetype = mimetypes.guess_type(self.filename)[0]

    def clean(self):
        if not self.mimetype and self.filename:
            self.set_mimetype_from_filename()
        if self.collection_id is not None:
            if not self.collection.is_supported_filetype(self.mimetype, self.filename):
                raise ValidationError(_('Unsupported filetype.'), code='unsupported_mimetype')
