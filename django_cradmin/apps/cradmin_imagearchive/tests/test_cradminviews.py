from django.contrib.contenttypes.models import ContentType
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
        request.cradmin_role = None
        request.cradmin_instance.get_roleid.return_value = 10

        response = cradminviews.ArchiveImageCreateView.as_view()(request)
        self.assertEquals(response.status_code, 200)
        response.render()
        selector = htmls.S(response.content)
        # selector.one('#django_cradmin_contentwrapper #div_id_name').prettyprint()
        self.assertTrue(selector.exists('input[type=text][name=name]'))
        self.assertTrue(selector.exists('input[type=text][name=name]'))
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
        self.assertEqual(created_image.name, 'My name')
        self.assertEqual(created_image.description, 'My description')

    def test_post_nofile(self):
        request = self.factory.post('/test', {
        })
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
