from __future__ import unicode_literals

from django.core.files.base import ContentFile
from django.test import TestCase, RequestFactory
import htmls
import mock
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.apps.cradmin_imagearchive import cradminviews
from django_cradmin.apps.cradmin_imagearchive.models import ArchiveImage
from django_cradmin.apps.cradmin_temporaryfileuploadstore.models import TemporaryFileCollection, TemporaryFile
from django_cradmin.django_cradmin_testapp.models import TstRole
from django_cradmin.tests.helpers import create_user
from .helpers import create_image


def _create_single_file_temporaryfilecollection(user, filename='testfile.png', image=None):
    if image:
        testimage = image
    else:
        testimage = create_image(200, 100)
    collection = TemporaryFileCollection.objects.create(user=user)
    temporaryfile = TemporaryFile(
        collection=collection,
        filename=filename)
    temporaryfile.file.save(filename, ContentFile(testimage))
    return collection


class TestCreateView(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.testuser = create_user('testuser')

    def test_get_render(self):
        request = self.factory.get('/test')
        request.cradmin_instance = mock.MagicMock()
        request.cradmin_instance.__getitem__.return_value = None  # This avoids rendering the menu
        request.cradmin_role = None

        response = cradminviews.ArchiveImageCreateView.as_view()(request)
        self.assertEquals(response.status_code, 200)
        response.render()
        selector = htmls.S(response.content)
        self.assertTrue(selector.exists('input[type=hidden][name=filecollectionid]'))
        self.assertTrue(selector.exists('textarea#id_description'))

    def test_post_ok(self):
        testimage = create_image(200, 100)
        collection = _create_single_file_temporaryfilecollection(user=self.testuser,
                                                                 image=testimage,
                                                                 filename='testname.png')
        request = self.factory.post('/test', {
            'filecollectionid': collection.id,
        })
        request.cradmin_instance = mock.MagicMock()
        request.cradmin_app = mock.MagicMock()
        request.cradmin_app.reverse_appurl.return_value = '/success'
        request.cradmin_role = TstRole.objects.create()
        request.user = self.testuser
        request._messages = mock.MagicMock()

        self.assertEqual(ArchiveImage.objects.count(), 0)
        response = cradminviews.ArchiveImageCreateView.as_view()(request)
        self.assertEquals(response.status_code, 302)
        self.assertEquals(response['Location'], '/success')
        self.assertEqual(ArchiveImage.objects.count(), 1)
        created_image = ArchiveImage.objects.first()
        self.assertEqual(created_image.image.read(), testimage)
        self.assertEqual(created_image.name, 'testname')
        self.assertEqual(created_image.description, '')

    def test_post_deletes_collection(self):
        collection = _create_single_file_temporaryfilecollection(user=self.testuser)
        request = self.factory.post('/test', {
            'filecollectionid': collection.id,
        })
        request.cradmin_instance = mock.MagicMock()
        request.cradmin_app = mock.MagicMock()
        request.cradmin_app.reverse_appurl.return_value = '/success'
        request.cradmin_role = TstRole.objects.create()
        request.user = self.testuser
        request._messages = mock.MagicMock()
        self.assertTrue(TemporaryFileCollection.objects.filter(id=collection.id).exists())
        cradminviews.ArchiveImageCreateView.as_view()(request)
        self.assertFalse(TemporaryFileCollection.objects.filter(id=collection.id).exists())

    def test_post_sets_file_size(self):
        testimage = create_image(200, 100)
        collection = _create_single_file_temporaryfilecollection(user=self.testuser,
                                                                 image=testimage)
        request = self.factory.post('/test', {
            'filecollectionid': collection.id,
        })
        request.cradmin_instance = mock.MagicMock()
        request.cradmin_app = mock.MagicMock()
        request.cradmin_app.reverse_appurl.return_value = '/success'
        request.cradmin_role = TstRole.objects.create()
        request.user = self.testuser
        request._messages = mock.MagicMock()

        response = cradminviews.ArchiveImageCreateView.as_view()(request)
        self.assertEquals(response.status_code, 302)
        created_image = ArchiveImage.objects.first()
        self.assertEqual(len(testimage), created_image.file_size)

    def test_post_allfields(self):
        testimage = create_image(200, 100)
        collection = _create_single_file_temporaryfilecollection(user=self.testuser,
                                                                 image=testimage)
        request = self.factory.post('/test', {
            'filecollectionid': collection.id,
            'description': 'My description',
        })
        request.cradmin_instance = mock.MagicMock()
        request.cradmin_app = mock.MagicMock()
        request.cradmin_app.reverse_appurl.return_value = '/success'
        request.cradmin_role = TstRole.objects.create()
        request.user = self.testuser
        request._messages = mock.MagicMock()

        self.assertEqual(ArchiveImage.objects.count(), 0)
        response = cradminviews.ArchiveImageCreateView.as_view()(request)
        self.assertEquals(response.status_code, 302)
        self.assertEquals(response['Location'], '/success')
        self.assertEqual(ArchiveImage.objects.count(), 1)
        created_image = ArchiveImage.objects.first()
        self.assertEqual(created_image.image.read(), testimage)
        self.assertEqual(created_image.description, 'My description')

    def test_post_no_file(self):
        request = self.factory.post('/test', {})
        request.cradmin_instance = mock.MagicMock()
        request.cradmin_app = mock.MagicMock()
        request.cradmin_role = TstRole.objects.create()
        request.user = self.testuser
        request._messages = mock.MagicMock()

        self.assertEqual(ArchiveImage.objects.count(), 0)
        response = cradminviews.ArchiveImageCreateView.as_view()(request)
        self.assertEquals(response.status_code, 200)
        self.assertEqual(ArchiveImage.objects.count(), 0)
        response.render()
        selector = htmls.S(response.content)
        self.assertIn(
            'You must upload an image',
            selector.one('#django_cradmin_contentwrapper #div_id_filecollectionid').alltext_normalized)

    def test_post_empty_collection(self):
        collection = TemporaryFileCollection.objects.create(user=self.testuser)
        request = self.factory.post('/test', {
            'filecollectionid': collection.id,
        })
        request.cradmin_instance = mock.MagicMock()
        request.cradmin_app = mock.MagicMock()
        request.cradmin_role = TstRole.objects.create()
        request.user = self.testuser
        request._messages = mock.MagicMock()

        self.assertEqual(ArchiveImage.objects.count(), 0)
        response = cradminviews.ArchiveImageCreateView.as_view()(request)
        self.assertEquals(response.status_code, 200)
        self.assertEqual(ArchiveImage.objects.count(), 0)
        response.render()
        selector = htmls.S(response.content)
        self.assertIn(
            'You must upload an image',
            selector.one('#django_cradmin_contentwrapper #div_id_filecollectionid').alltext_normalized)


class TestUpdateView(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.role = TstRole.objects.create()
        self.archiveimage = ArchiveImage.objects.create(role=self.role,
                                                        name='Original name',
                                                        description='Original description')
        self.testimage = create_image(200, 100)
        self.archiveimage.image.save('testimage.png', ContentFile(self.testimage))
        self.testuser = create_user('testuser')

    def test_get_render(self):
        request = self.factory.get('/test')
        request.cradmin_instance = mock.MagicMock()
        request.cradmin_role = self.role

        response = cradminviews.ArchiveImageUpdateView.as_view()(request, pk=self.archiveimage.pk)
        self.assertEquals(response.status_code, 200)
        response.render()
        selector = htmls.S(response.content)
        self.assertTrue(selector.exists('textarea#id_description'))

    def test_post_ok(self):
        request = self.factory.post('/test', {
            # 'name': 'Updated name',
            'description': 'Updated description'
        })
        request.cradmin_instance = mock.MagicMock()
        request.cradmin_app = mock.MagicMock()
        request.cradmin_app.reverse_appurl.return_value = '/success'
        request.cradmin_role = self.role
        request._messages = mock.MagicMock()

        self.assertEqual(ArchiveImage.objects.count(), 1)
        response = cradminviews.ArchiveImageUpdateView.as_view()(request, pk=self.archiveimage.pk)
        self.assertEquals(response.status_code, 302)
        self.assertEquals(response['Location'], '/success')
        self.assertEqual(ArchiveImage.objects.count(), 1)
        updated_image = ArchiveImage.objects.first()
        self.assertEqual(updated_image.image.read(), self.testimage)
        # self.assertEqual(updated_image.name, 'Updated name')
        self.assertEqual(updated_image.description, 'Updated description')


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
        request._messages = mock.MagicMock()

        self.assertEqual(ArchiveImage.objects.count(), 0)
        response = cradminviews.ArchiveImageBulkAddView.as_view()(request)
        self.assertEquals(response.status_code, 302)
        self.assertEquals(response['Location'], '/success')
        self.assertEqual(ArchiveImage.objects.count(), 1)
        created_image = ArchiveImage.objects.first()
        self.assertEqual(created_image.image.read(), testimage)
        self.assertEqual(created_image.name, 'testfile.png')
        self.assertEqual(created_image.description, '')

    def test_post_deletes_collection(self):
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
        request._messages = mock.MagicMock()

        response = cradminviews.ArchiveImageBulkAddView.as_view()(request)
        self.assertEquals(response.status_code, 302)
        self.assertFalse(TemporaryFileCollection.objects.filter(id=collection.id).exists())

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
        request._messages = mock.MagicMock()

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

    def test_post_sets_file_size(self):
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
        request._messages = mock.MagicMock()

        response = cradminviews.ArchiveImageBulkAddView.as_view()(request)
        self.assertEquals(response.status_code, 302)
        created_image = ArchiveImage.objects.first()
        self.assertEqual(len(testimage), created_image.file_size)


class TestArchiveImagesListView(TestCase, cradmin_testhelpers.TestCaseMixin):
    viewclass = cradminviews.ArchiveImagesListView

    def test_no_archive_images(self):
        mockresponse = self.mock_http200_getrequest_htmls(
            requestuser=create_user('testuser'),
            cradmin_role=mommy.make('django_cradmin_testapp.TstRole'))
        self.assertEqual(
            mockresponse.selector.one('#objecttableview-no-items-message').alltext_normalized,
            'No archive images')

    def test_single_archive_image_sanity(self):
        testrole = mommy.make('django_cradmin_testapp.TstRole')
        mommy.make('cradmin_imagearchive.ArchiveImage',
                   name='Test image', description='',
                   role=testrole)
        mockresponse = self.mock_http200_getrequest_htmls(
            requestuser=create_user('testuser'),
            cradmin_role=testrole)
        self.assertFalse(mockresponse.selector.exists('#objecttableview-no-items-message'))
        self.assertEqual(mockresponse.selector.count('#objecttableview-table tbody tr'), 1)

    def test_only_owned_by_role(self):
        testrole = mommy.make('django_cradmin_testapp.TstRole')
        other_role = mommy.make('django_cradmin_testapp.TstRole')
        mommy.make('cradmin_imagearchive.ArchiveImage',
                   name='Test image', description='',
                   role=other_role)
        mockresponse = self.mock_http200_getrequest_htmls(
            requestuser=create_user('testuser'),
            cradmin_role=testrole)
        self.assertTrue(mockresponse.selector.exists('#objecttableview-no-items-message'))

    def test_render_single_archive_image_no_description(self):
        testrole = mommy.make('django_cradmin_testapp.TstRole')
        mommy.make('cradmin_imagearchive.ArchiveImage',
                   name='Test image', description='',
                   role=testrole)
        mockresponse = self.mock_http200_getrequest_htmls(
            requestuser=create_user('testuser'),
            cradmin_role=testrole)
        self.assertEqual(
            mockresponse.selector.one(
                '#objecttableview-table tbody tr td:last-child .objecttable-cellvalue').alltext_normalized,
            'Test image')
        self.assertEqual(
            mockresponse.selector.one(
                '#objecttableview-table tbody tr td:last-child .btn-default').alltext_normalized,
            'Set a description')

    def test_render_single_archive_image_has_description(self):
        testrole = mommy.make('django_cradmin_testapp.TstRole')
        mommy.make('cradmin_imagearchive.ArchiveImage',
                   name='Test image', description='Test description',
                   role=testrole)
        mockresponse = self.mock_http200_getrequest_htmls(
            requestuser=create_user('testuser'),
            cradmin_role=testrole)
        self.assertEqual(
            mockresponse.selector.one(
                '#objecttableview-table tbody tr td:last-child .objecttable-cellvalue').alltext_normalized,
            'Test description')
        self.assertEqual(
            mockresponse.selector.one(
                '#objecttableview-table tbody tr td:last-child .btn-default').alltext_normalized,
            'Edit description')
