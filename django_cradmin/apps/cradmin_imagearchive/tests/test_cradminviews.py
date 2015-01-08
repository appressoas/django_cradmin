from django.core.files.base import ContentFile
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, RequestFactory
import htmls
import mock

from django_cradmin.apps.cradmin_imagearchive import cradminviews
from django_cradmin.apps.cradmin_imagearchive.models import ArchiveImage
from django_cradmin.django_cradmin_testapp.models import TstRole
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
