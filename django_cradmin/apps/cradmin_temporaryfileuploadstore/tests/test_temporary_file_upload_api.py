import json
import os
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import RequestFactory, TestCase
from django_cradmin.apps.cradmin_temporaryfileuploadstore.models import TemporaryFileCollection, TemporaryFile
from django_cradmin.apps.cradmin_temporaryfileuploadstore.views.temporary_file_upload_api import \
    UploadTemporaryFilesView
from django_cradmin.tests.helpers import create_user


class TestUploadTemporaryFilesView(TestCase):
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

        self.assertEquals(len(responsedata['temporaryfiles']), 1)
        self.assertEquals(responsedata['temporaryfiles'][0]['filename'], 'testfile1.txt')

    def test_post_multiple_files(self):
        request = self.factory.post('/test', {
            'file': [
                SimpleUploadedFile('testfile1.txt', 'Test1'),
                SimpleUploadedFile('testfile2.txt', 'Test2'),
            ]
        })
        request.user = self.testuser
        response = UploadTemporaryFilesView.as_view()(request)
        self.assertEquals(response.status_code, 200)
        responsedata = json.loads(response.content)
        self.assertIsNotNone(responsedata['collectionid'])

        collectionid = responsedata['collectionid']
        collection = TemporaryFileCollection.objects.get(id=collectionid)
        self.assertEquals(collection.files.count(), 2)
        self.assertEquals(len(responsedata['temporaryfiles']), 2)
        self.assertEquals(responsedata['temporaryfiles'][0]['filename'], 'testfile1.txt')
        self.assertEquals(responsedata['temporaryfiles'][1]['filename'], 'testfile2.txt')

    def test_post_multiple_requests_for_same_collection(self):
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

    def test_post_multiple_files_singlefile_mode(self):
        request1 = self.factory.post('/test', {
            'file': SimpleUploadedFile('testfile1.txt', 'Test1'),
            'mode': 'singlefile'
        })
        request1.user = self.testuser
        response1 = UploadTemporaryFilesView.as_view()(request1)
        self.assertEquals(response1.status_code, 200)
        response1data = json.loads(response1.content)
        self.assertIsNotNone(response1data['collectionid'])
        collectionid = response1data['collectionid']
        collection = TemporaryFileCollection.objects.get(id=collectionid)
        self.assertEquals(collection.files.count(), 1)
        uploadedfile1 = collection.files.first()
        uploadedfile1_physical_file_path = uploadedfile1.file.path
        self.assertTrue(os.path.exists(uploadedfile1_physical_file_path))

        request2 = self.factory.post('/test', {
            'file': SimpleUploadedFile('testfile2.txt', 'Test2'),
            'collectionid': collectionid,
            'mode': 'singlefile'
        })
        request2.user = self.testuser
        response2 = UploadTemporaryFilesView.as_view()(request2)
        self.assertEquals(response2.status_code, 200)
        response2data = json.loads(response2.content)
        self.assertEquals(collectionid, response2data['collectionid'])
        self.assertEquals(collection.files.count(), 1)
        uploadedfile2 = collection.files.first()
        self.assertEqual(uploadedfile2.filename, 'testfile2.txt')
        self.assertEqual(uploadedfile2.file.read(), 'Test2')
        self.assertFalse(os.path.exists(uploadedfile1_physical_file_path))

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
        self.assertEquals(response.status_code, 404)
        responsedata = json.loads(response.content)
        self.assertEquals(responsedata['collectionid'][0]['code'], 'doesnotexist')

    def test_post_form_collection_not_owned_by_user(self):
        collection = TemporaryFileCollection.objects.create(user=self.testuser)
        request = self.factory.post('/test', {
            'file': SimpleUploadedFile('testfile1.txt', 'Test1'),
            'collectionid': collection.id
        })
        request.user = create_user('otheruser')
        response = UploadTemporaryFilesView.as_view()(request)
        self.assertEquals(response.status_code, 404)
        responsedata = json.loads(response.content)
        self.assertEquals(responsedata['collectionid'][0]['code'], 'doesnotexist')

    def test_delete_single_file(self):
        collection = TemporaryFileCollection.objects.create(user=self.testuser)
        temporaryfile = TemporaryFile(
            collection=collection,
            filename='testfile.txt')
        temporaryfile.file.save('testfile.txt', ContentFile('testcontent'))

        request = self.factory.delete('/test', json.dumps({
            'collectionid': collection.id,
            'temporaryfileid': temporaryfile.id
        }))
        request.user = self.testuser
        response = UploadTemporaryFilesView.as_view()(request)
        self.assertEquals(response.status_code, 200)
        responsedata = json.loads(response.content)

        self.assertEquals(responsedata['collectionid'], collection.id)
        self.assertEquals(responsedata['temporaryfileid'], temporaryfile.id)

        self.assertTrue(TemporaryFileCollection.objects.filter(id=collection.id).exists())
        self.assertFalse(TemporaryFile.objects.filter(id=temporaryfile.id).exists())

    def test_delete_invalid_json_reqeust(self):
        request = self.factory.delete('/test', data='invalid')
        request.user = self.testuser
        response = UploadTemporaryFilesView.as_view()(request)
        self.assertEquals(response.status_code, 400)
        responsedata = json.loads(response.content)
        self.assertEquals(responsedata['errormessage'], 'Invalid JSON data in the request body.')

    def test_delete_form_collectionid_does_not_exist(self):
        request = self.factory.delete('/test', data=json.dumps({
            'collectionid': '10001',
            'temporaryfileid': '1'  # NOTE: This is ignored since we never get to the code looking it up
        }))
        request.user = self.testuser
        response = UploadTemporaryFilesView.as_view()(request)
        self.assertEquals(response.status_code, 404)
        responsedata = json.loads(response.content)
        self.assertEquals(responsedata['collectionid'][0]['code'], 'doesnotexist')

    def test_delete_form_collection_not_owned_by_user(self):
        collection = TemporaryFileCollection.objects.create(user=self.testuser)
        request = self.factory.delete('/test', json.dumps({
            'collectionid': collection.id,
            'temporaryfileid': '1'  # NOTE: This is ignored since we never get to the code looking it up
        }))
        request.user = create_user('otheruser')
        response = UploadTemporaryFilesView.as_view()(request)
        self.assertEquals(response.status_code, 404)
        responsedata = json.loads(response.content)
        self.assertEquals(responsedata['collectionid'][0]['code'], 'doesnotexist')

    def test_delete_form_temporaryfileid_does_not_exist(self):
        collection = TemporaryFileCollection.objects.create(user=self.testuser)
        request = self.factory.delete('/test', data=json.dumps({
            'collectionid': collection.id,
            'temporaryfileid': 10001
        }))
        request.user = self.testuser
        response = UploadTemporaryFilesView.as_view()(request)
        self.assertEquals(response.status_code, 404)
        responsedata = json.loads(response.content)
        self.assertEquals(responsedata['temporaryfileid'][0]['code'], 'doesnotexist')
