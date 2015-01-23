import os
from django.core.files.base import ContentFile
from django.test import TestCase
from django_cradmin.apps.cradmin_temporaryfileuploadstore.models import TemporaryFileCollection, TemporaryFile
from django_cradmin.tests.helpers import create_user


class TestModels(TestCase):

    def test_delete_removes_physical_file(self):
        collection = TemporaryFileCollection.objects.create(
            user=create_user('testuser'))
        temporaryfile = TemporaryFile(filename='test.txt', collection=collection)
        temporaryfile.file.save('test.txt', ContentFile('Testdata'))
        physical_file_path = temporaryfile.file.path
        self.assertTrue(os.path.exists(physical_file_path))
        temporaryfile.file.delete()
        temporaryfile.delete()
        self.assertFalse(os.path.exists(physical_file_path))

    def test_clear_collection(self):
        collection = TemporaryFileCollection.objects.create(
            user=create_user('testuser'))
        temporaryfile = TemporaryFile(filename='test.txt', collection=collection)
        temporaryfile.file.save('test.txt', ContentFile('Testdata'))
        physical_file_path = temporaryfile.file.path
        self.assertTrue(os.path.exists(physical_file_path))
        collection.clear_files()
        self.assertFalse(os.path.exists(physical_file_path))
        self.assertEquals(collection.files.count(), 0)
