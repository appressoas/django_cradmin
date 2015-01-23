import json
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import RequestFactory, TestCase
from django_cradmin.apps.cradmin_temporaryfileuploadstore.models import TemporaryFileCollection
from django_cradmin.apps.cradmin_temporaryfileuploadstore.views.temporary_file_upload_api import \
    UploadTemporaryFilesView
from django_cradmin.tests.helpers import create_user


class TestArchiveImageBulkAddView(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.testuser = create_user('testuser')

    def test_post_single_file(self):
        request = self.factory.post('/test', {
            'file': SimpleUploadedFile('testfile1.txt', 'Test1')
        })
        request.user = self.testuser
        response = UploadTemporaryFilesView.as_view()(request)
        self.assertEquals(response.status_code, 200)
        responsedata = json.loads(response.content)
        self.assertIsNotNone(responsedata['collectionid'])

        collectionid = responsedata['collectionid']
        collection = TemporaryFileCollection.objects.get(id=collectionid)
        self.assertEquals(collection.files.count(), 1)
        uploadedfile = collection.files.first()
        self.assertEqual(uploadedfile.filename, 'testfile1.txt')
        self.assertNotIn('testfile1.txt', uploadedfile.file.name)
        self.assertTrue(uploadedfile.file.name.startswith(
            'cradmin_temporaryfileuploadstore/{}/'.format(collection.id)))
        self.assertEqual(uploadedfile.file.read(), 'Test1')

    def test_post_multiple_files(self):
        request1 = self.factory.post('/test', {
            'file': SimpleUploadedFile('testfile1.txt', 'Test1')
        })
        request1.user = self.testuser
        response1 = UploadTemporaryFilesView.as_view()(request1)
        self.assertEquals(response1.status_code, 200)
        response1data = json.loads(response1.content)
        self.assertIsNotNone(response1data['collectionid'])
        collectionid = response1data['collectionid']
        collection = TemporaryFileCollection.objects.get(id=collectionid)
        self.assertEquals(collection.files.count(), 1)

        request2 = self.factory.post('/test', {
            'file': SimpleUploadedFile('testfile2.txt', 'Test2'),
            'collectionid': collectionid
        })
        request2.user = self.testuser
        response2 = UploadTemporaryFilesView.as_view()(request2)
        self.assertEquals(response2.status_code, 200)
        response2data = json.loads(response2.content)
        self.assertEquals(collectionid, response2data['collectionid'])
        self.assertEquals(collection.files.count(), 2)

    def test_post_form_invalid_no_file(self):
        request = self.factory.post('/test')
        request.user = self.testuser
        response = UploadTemporaryFilesView.as_view()(request)
        self.assertEquals(response.status_code, 400)
        responsedata = json.loads(response.content)
        self.assertEquals(responsedata['file'][0]['code'], 'required')

    def test_post_form_invalid_collectionid_not_number(self):
        request = self.factory.post('/test', {
            'file': SimpleUploadedFile('testfile1.txt', 'Test1'),
            'collectionid': 'invalid'
        })
        request.user = self.testuser
        response = UploadTemporaryFilesView.as_view()(request)
        self.assertEquals(response.status_code, 400)
        responsedata = json.loads(response.content)
        self.assertEquals(responsedata['collectionid'][0]['code'], 'invalid')

    def test_post_form_collectionid_does_not_exist(self):
        request = self.factory.post('/test', {
            'file': SimpleUploadedFile('testfile1.txt', 'Test1'),
            'collectionid': '10001'
        })
        request.user = self.testuser
        response = UploadTemporaryFilesView.as_view()(request)
        self.assertEquals(response.status_code, 400)
        responsedata = json.loads(response.content)
        self.assertEquals(responsedata['collectionid'][0]['code'], 'doesnotexist')
