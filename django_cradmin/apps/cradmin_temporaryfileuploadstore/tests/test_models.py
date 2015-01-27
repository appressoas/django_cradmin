import os
from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from django.test import TestCase
from django_cradmin.apps.cradmin_temporaryfileuploadstore.models import TemporaryFileCollection, TemporaryFile, \
    html_input_accept_match
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

    def test_set_mimetype_from_filename(self):
        temporaryfile = TemporaryFile(filename='test.png')
        temporaryfile.set_mimetype_from_filename()
        self.assertEquals(temporaryfile.mimetype, 'image/png')

    def test_set_mimetype_from_filename_no_extension(self):
        temporaryfile = TemporaryFile(filename='test')
        temporaryfile.set_mimetype_from_filename()
        self.assertEquals(temporaryfile.mimetype, None)

    def test_set_mimetype_from_filename_unknown_extension(self):
        temporaryfile = TemporaryFile(filename='test.thisdoesnotexist')
        temporaryfile.set_mimetype_from_filename()
        self.assertEquals(temporaryfile.mimetype, None)

    def clean_sets_mimetype(self):
        temporaryfile = TemporaryFile(filename='test.png')
        temporaryfile.clean()
        self.assertEquals(temporaryfile.mimetype, 'image/png')

    def clean_validates_accept(self):
        collection = TemporaryFileCollection.objects.create(
            user=create_user('testuser'),
            accept='image/png,image/jpeg')
        TemporaryFile(filename='test.png', collection=collection).clean()
        TemporaryFile(filename='test.jpg', collection=collection).clean()
        with self.assertRaises(ValidationError):
            TemporaryFile(filename='test.txt', collection=collection).clean()

    def test_html_input_accept_match_filename_star(self):
        self.assertTrue(html_input_accept_match(accept='*.jpg', mimetype='unused', filename='test.jpg'))
        self.assertFalse(html_input_accept_match(accept='*.jpg', mimetype='unused', filename='test.jpeg'))
        self.assertTrue(html_input_accept_match(accept='.unused,*.jpg,.unused',
                                                mimetype='unused', filename='test.jpg'))

    def test_html_input_accept_match_filename_dot(self):
        self.assertTrue(html_input_accept_match(accept='.jpg', mimetype='unused', filename='test.jpg'))
        self.assertFalse(html_input_accept_match(accept='.jpg', mimetype='unused', filename='test.jpeg'))
        self.assertTrue(html_input_accept_match(accept='.unused,.jpg,.unused',
                                                mimetype='unused', filename='test.jpg'))

    def test_html_input_accept_match_mimetype_exact(self):
        self.assertTrue(html_input_accept_match(accept='image/jpeg', mimetype='image/jpeg', filename='unused'))
        self.assertFalse(html_input_accept_match(accept='image/png', mimetype='image/jpeg', filename='unused'))
        self.assertTrue(html_input_accept_match(accept='.unused,image/jpeg,unused2',
                                                mimetype='image/jpeg', filename='unused'))

    def test_html_input_accept_match_mimetype_star(self):
        self.assertTrue(html_input_accept_match(accept='image/*', mimetype='image/jpeg', filename='unused'))
        self.assertFalse(html_input_accept_match(accept='application/*', mimetype='image/jpeg', filename='unused'))
        self.assertTrue(html_input_accept_match(accept='.unused,image/*,.unused2',
                                                mimetype='image/jpeg', filename='unused'))

    def test_html_input_accept_match_mimetype_none(self):
        self.assertFalse(html_input_accept_match(accept='image/jpeg', mimetype=None, filename='test.jpeg'))
