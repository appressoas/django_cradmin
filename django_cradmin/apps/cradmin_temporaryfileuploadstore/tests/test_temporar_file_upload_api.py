from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import RequestFactory, TestCase
import mock
from django_cradmin.apps.cradmin_temporaryfileuploadstore.views.temporary_file_upload_api import \
    UploadTemporaryFilesView


class TestArchiveImageBulkAddView(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_post_single_image(self):
        request = self.factory.post('/test', {
            'file': SimpleUploadedFile('testfile1.txt', 'Test1')
        })
        response = UploadTemporaryFilesView.as_view()(request)
        self.assertEquals(response.status_code, 200)
