from django.core.files.base import ContentFile
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, RequestFactory
import htmls
import mock

from django_cradmin.apps.cradmin_imagearchive import cradminviews
from django_cradmin.apps.cradmin_imagearchive.models import ArchiveImage
from django_cradmin.apps.cradmin_temporaryfileuploadstore.models import TemporaryFileCollection, TemporaryFile
from django_cradmin.django_cradmin_testapp.models import TstRole
from django_cradmin.tests.helpers import create_user
from .helpers import create_image


class TestCreateView(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_get_render(self):
        request = self.factory.get('/test')
        request.cradmin_instance = mock.MagicMock()
        request.cradmin_instance.__getitem__.return_value = None  # This avoids rendering the menu
        request.cradmin_role = None

        response = cradminviews.ArchiveImageCreateView.as_view()(request)
        self.assertEquals(response.status_code, 200)
        response.render()
        selector = htmls.S(response.content)
        self.assertTrue(selector.exists('input[type=file][name=image]'))
        self.assertTrue(selector.exists('textarea#id_description'))

    def test_post_ok(self):
        testimage = create_image(200, 100)
        request = self.factory.post('/test', {
            'image': SimpleUploadedFile('testname.png', testimage),
        })
        request.cradmin_instance = mock.MagicMock()
        request.cradmin_app = mock.MagicMock()
        request.cradmin_app.reverse_appurl.return_value = '/success'
        request.cradmin_role = TstRole.objects.create()

        self.assertEqual(ArchiveImage.objects.count(), 0)
        response = cradminviews.ArchiveImageCreateView.as_view()(request)
        self.assertEquals(response.status_code, 302)
        self.assertEquals(response['Location'], '/success')
        self.assertEqual(ArchiveImage.objects.count(), 1)
        created_image = ArchiveImage.objects.first()
        self.assertEqual(created_image.image.read(), testimage)
        self.assertEqual(created_image.name, 'testname')
        self.assertEqual(created_image.description, '')

    def test_post_allfields(self):
        testimage = create_image(200, 100)
        request = self.factory.post('/test', {
            'image': SimpleUploadedFile('testname.png', testimage),
            'name': 'My name',
            'description': 'My description',
        })
        request.cradmin_instance = mock.MagicMock()
        request.cradmin_app = mock.MagicMock()
        request.cradmin_app.reverse_appurl.return_value = '/success'
        request.cradmin_role = TstRole.objects.create()

        self.assertEqual(ArchiveImage.objects.count(), 0)
        response = cradminviews.ArchiveImageCreateView.as_view()(request)
        self.assertEquals(response.status_code, 302)
        self.assertEquals(response['Location'], '/success')
        self.assertEqual(ArchiveImage.objects.count(), 1)
        created_image = ArchiveImage.objects.first()
        self.assertEqual(created_image.image.read(), testimage)
        self.assertEqual(created_image.description, 'My description')

    def test_post_nofile(self):
        request = self.factory.post('/test', {})
        request.cradmin_instance = mock.MagicMock()
        request.cradmin_app = mock.MagicMock()
        request.cradmin_role = TstRole.objects.create()

        self.assertEqual(ArchiveImage.objects.count(), 0)
        response = cradminviews.ArchiveImageCreateView.as_view()(request)
        self.assertEquals(response.status_code, 200)
        self.assertEqual(ArchiveImage.objects.count(), 0)
        response.render()
        selector = htmls.S(response.content)
        self.assertIn(
            'This field is required',
            selector.one('#django_cradmin_contentwrapper #div_id_image').alltext_normalized)


class TestUpdateView(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.role = TstRole.objects.create()
        self.archiveimage = ArchiveImage.objects.create(role=self.role)
        self.testimage = create_image(200, 100)
        self.archiveimage.image.save('testimage.png', ContentFile(self.testimage))

    def test_get_render(self):
        request = self.factory.get('/test')
        request.cradmin_instance = mock.MagicMock()
        request.cradmin_role = self.role

        response = cradminviews.ArchiveImageUpdateView.as_view()(request, pk=self.archiveimage.pk)
        self.assertEquals(response.status_code, 200)
        response.render()
        selector = htmls.S(response.content)
        self.assertTrue(selector.exists('input[type=text][name=name]'))
        self.assertTrue(selector.exists('input[type=file][name=image]'))
        self.assertTrue(selector.exists('textarea#id_description'))

    def test_post_ok(self):
        request = self.factory.post('/test', {
            'name': 'Updated name'
        })
        request.cradmin_instance = mock.MagicMock()
        request.cradmin_app = mock.MagicMock()
        request.cradmin_app.reverse_appurl.return_value = '/success'
        request.cradmin_role = self.role

        self.assertEqual(ArchiveImage.objects.count(), 1)
        response = cradminviews.ArchiveImageUpdateView.as_view()(request, pk=self.archiveimage.pk)
        self.assertEquals(response.status_code, 302)
        self.assertEquals(response['Location'], '/success')
        self.assertEqual(ArchiveImage.objects.count(), 1)
        update_image = ArchiveImage.objects.first()
        self.assertEqual(update_image.image.read(), self.testimage)
        self.assertEqual(update_image.name, 'Updated name')
        self.assertEqual(update_image.description, '')

    def test_post_allfields(self):
        testimage = create_image(200, 100)
        request = self.factory.post('/test', {
            'image': SimpleUploadedFile('testname.png', testimage),
            'name': 'My name',
            'description': 'My description',
        })
        request.cradmin_instance = mock.MagicMock()
        request.cradmin_app = mock.MagicMock()
        request.cradmin_app.reverse_appurl.return_value = '/success'
        request.cradmin_role = self.role

        response = cradminviews.ArchiveImageUpdateView.as_view()(request, pk=self.archiveimage.pk)
        self.assertEquals(response.status_code, 302)
        self.assertEquals(response['Location'], '/success')
        update_image = ArchiveImage.objects.first()
        self.assertEqual(update_image.image.read(), testimage)
        self.assertEqual(update_image.name, 'My name')
        self.assertEqual(update_image.description, 'My description')

    def test_post_noname(self):
        testimage = create_image(200, 100)
        request = self.factory.post('/test', {
            'image': SimpleUploadedFile('testname.png', testimage),
        })
        request.cradmin_instance = mock.MagicMock()
        request.cradmin_app = mock.MagicMock()
        request.cradmin_role = self.role

        response = cradminviews.ArchiveImageUpdateView.as_view()(request, pk=self.archiveimage.pk)
        self.assertEquals(response.status_code, 302)
        update_image = ArchiveImage.objects.first()
        self.assertEqual(update_image.name, 'testname')


class TestArchiveImageBulkAddView(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.testuser = create_user('testuser')

    def test_get_render(self):
        request = self.factory.get('/test')
        request.cradmin_instance = mock.MagicMock()
        request.cradmin_instance.__getitem__.return_value = None  # This avoids rendering the menu
        request.cradmin_role = None

        response = cradminviews.ArchiveImageBulkAddView.as_view()(request)
        self.assertEquals(response.status_code, 200)
        response.render()
        selector = htmls.S(response.content)
        self.assertTrue(selector.exists('#django_cradmin_imagearchive_bulkadd_form'))
        self.assertTrue(selector.exists('input[type=hidden][name=filecollectionid]'))
        self.assertTrue(selector.exists('#div_id_filecollectionid'))

    def test_post_no_filecollectionid(self):
        request = self.factory.post('/test', {})
        request.cradmin_instance = mock.MagicMock()
        request.cradmin_app = mock.MagicMock()
        request.cradmin_role = TstRole.objects.create()

        self.assertEqual(ArchiveImage.objects.count(), 0)
        response = cradminviews.ArchiveImageBulkAddView.as_view()(request)
        response.render()
        selector = htmls.S(response.content)
        self.assertTrue(selector.exists('#div_id_filecollectionid.has-error'))
        self.assertIn(
            'You must upload at least one file.',
            selector.one('#div_id_filecollectionid').alltext_normalized)

    def test_post_single_image(self):
        testimage = create_image(200, 100)
        collection = TemporaryFileCollection.objects.create(user=self.testuser)
        temporaryfile = TemporaryFile(
            collection=collection,
            filename='testfile.png')
        temporaryfile.file.save('testfile.png', ContentFile(testimage))

        request = self.factory.post('/test', {
            'filecollectionid': collection.id
        })
        request.cradmin_instance = mock.MagicMock()
        request.cradmin_app = mock.MagicMock()
        request.user = self.testuser
        request.cradmin_app.reverse_appurl.return_value = '/success'
        request.cradmin_role = TstRole.objects.create()

        self.assertEqual(ArchiveImage.objects.count(), 0)
        response = cradminviews.ArchiveImageBulkAddView.as_view()(request)
        self.assertEquals(response.status_code, 302)
        self.assertEquals(response['Location'], '/success')
        self.assertEqual(ArchiveImage.objects.count(), 1)
        created_image = ArchiveImage.objects.first()
        self.assertEqual(created_image.image.read(), testimage)
        self.assertEqual(created_image.name, 'testfile.png')
        self.assertEqual(created_image.description, '')

    def test_post_multiple_images(self):
        testimage1 = create_image(200, 100)
        testimage2 = create_image(100, 100)
        collection = TemporaryFileCollection.objects.create(user=self.testuser)
        temporaryfile = TemporaryFile(
            collection=collection,
            filename='testfile1.png')
        temporaryfile.file.save('testfile1.png', ContentFile(testimage1))
        temporaryfile = TemporaryFile(
            collection=collection,
            filename='testfile2.png')
        temporaryfile.file.save('testfile2.png', ContentFile(testimage2))

        request = self.factory.post('/test', {
            'filecollectionid': collection.id
        })
        request.cradmin_instance = mock.MagicMock()
        request.cradmin_app = mock.MagicMock()
        request.cradmin_app.reverse_appurl.return_value = '/success'
        request.cradmin_role = TstRole.objects.create()
        request.user = self.testuser

        self.assertEqual(ArchiveImage.objects.count(), 0)
        response = cradminviews.ArchiveImageBulkAddView.as_view()(request)
        self.assertEquals(response.status_code, 302)
        self.assertEquals(response['Location'], '/success')
        self.assertEqual(ArchiveImage.objects.count(), 2)
        created_images = ArchiveImage.objects.order_by('name')

        self.assertEqual(created_images[0].image.read(), testimage1)
        self.assertEqual(created_images[0].name, 'testfile1.png')
        self.assertEqual(created_images[0].description, '')

        self.assertEqual(created_images[1].image.read(), testimage2)
        self.assertEqual(created_images[1].name, 'testfile2.png')
        self.assertEqual(created_images[1].description, '')
