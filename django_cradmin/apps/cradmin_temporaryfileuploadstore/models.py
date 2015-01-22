from django.conf import settings
from django.db import models


class TemporaryFile(models.Model):
    """
    A temporary file uploaded by a user.

    This model is used by apps to store temporary files
    uploaded through the temporary file upload API. The typical
    workflow is:

    1. Upload a file via the API.
    2. Use the IDs returned by the API to POST a form that uses
       file uploads.
    3. In the code handling the form POST request, retrieve the temporary
       file(s), move them into some form of persistent storage (perhaps
       after manipulating the file in some way).
    4. Delete the temporary file.
    """
    filename = models.TextField()
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        help_text='The user that owns this temporary file. Users should not'
                  'be allowed access to other users temporary files.')
    uploaded_by_app = models.TextField(
        help_text='The app that uploaded this file.')
    created_datetime = models.DateTimeField(auto_now_add=True)
    minutes_to_live = models.PositiveIntegerField(
        help_text='The number of minutes the app requests that this '
                  'file should be kept before automatic removal. '
                  'This is used by automatic cleanup jobs to determine '
                  'what to delete. You should not rely on the file beeing '
                  'automatically deleted after this number of minutes, and '
                  'you should always delete files explicitly as part of the '
                  'file upload process.'
    )
