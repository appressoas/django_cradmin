from __future__ import unicode_literals

from django.conf.urls import url
from django.contrib.auth.decorators import login_required

from django_cradmin.apps.cradmin_temporaryfileuploadstore.views.temporary_file_upload_api import \
    UploadTemporaryFilesView

urlpatterns = [
    url(r'^temporary_file_upload_api$',
        login_required(UploadTemporaryFilesView.as_view()),
        name='cradmin_temporary_file_upload_api'),
]
