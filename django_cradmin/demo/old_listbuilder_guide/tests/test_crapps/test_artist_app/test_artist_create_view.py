from unittest import mock

from django.conf import settings
from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.artist_app import artist_create_view
from django_cradmin.demo.cradmin_listbuilder_guide.models import Artist


class TestArtistCreateView(TestCase, cradmin_testhelpers.TestCaseMixin):
    """"""
    viewclass = artist_create_view.ArtistCreateView

    def test_render_form_sanity(self):
        """Has the primary h1 the expected value"""
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertTrue(mockresponse.selector.one('.test-primary-h1'))
        self.assertEqual('Create artist', mockresponse.selector.one('.test-primary-h1').text_normalized)

    def test_not_required_name_field(self):
        """Should get a 200 response when not filling in artist name"""
        mockresponse = self.mock_http200_postrequest_htmls(
            requestkwargs={
                'data': {
                    'name': ''
                }
            }
        )
        self.assertTrue(mockresponse.selector.one('#id_name_wrapper .test-warning-message'))
        expected_warning_message = 'This field is required.'
        actual_warning_message = mockresponse.selector.one('#id_name_wrapper .test-warning-message').text_normalized
        self.assertEqual(expected_warning_message, actual_warning_message)

    def test_post_sanity(self):
        """Should get a 302 redirect after filling in required form values"""
        user = mommy.make(settings.AUTH_USER_MODEL)
        self.mock_http302_postrequest(
            requestkwargs={
                'data': {
                    'name': 'Iron Maiden'
                }
            }
        )

    def test_new_artist_in_database_when_successfull_post(self):
        """In the db there should be one Artist with the same name as posted"""
        artists_in_db = Artist.objects.all().count()
        self.assertEqual(0, artists_in_db)
        self.mock_http302_postrequest(
            requestkwargs={
                'data': {
                    'name': 'Ozzy'
                }
            }
        )
        artists_in_db = Artist.objects.all().count()
        self.assertEqual(1, artists_in_db)
        self.assertTrue(Artist.objects.filter(name='Ozzy').get())

    def test_add_admin_sanity(self):
        """When creating a new artist instance, the logged in user should be added as admin"""
        mockuser = mock.MagicMock()
        mockuser.user = mommy.make(settings.AUTH_USER_MODEL)
        self.mock_http302_postrequest(
            requestuser=mockuser.user,
            requestkwargs={
                'data': {
                    'name': 'My Artist'
                }
            }
        )
        # get the first of the many to many field
        artist = Artist.objects.filter(name='My Artist').get()
        admins = artist.admins.all()
        admin = admins[0]
        # is the user an admin
        self.assertEqual(mockuser.user, admin)
