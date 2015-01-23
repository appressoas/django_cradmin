import os
import time
import uuid
from django.conf import settings
from django.db import models


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
    """
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

    def clear_files(self):
        for temporaryfile in self.files.all():
            temporaryfile.file.delete()
            temporaryfile.delete()


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
    filename = models.TextField()
    file = models.FileField(
        upload_to=temporary_file_upload_to)
