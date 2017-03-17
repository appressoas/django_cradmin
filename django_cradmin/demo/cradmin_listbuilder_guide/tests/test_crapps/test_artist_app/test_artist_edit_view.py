from django.conf import settings
from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.artist_app import artist_edit_view
from django_cradmin.demo.cradmin_listbuilder_guide.models import Artist


class TestArtistEditView(TestCase, cradmin_testhelpers.TestCaseMixin):
    """"""
    viewclass = artist_edit_view.ArtistEditView

    def setUp(self):
        self.user = mommy.make(settings.AUTH_USER_MODEL)
        self.user_two = mommy.make(settings.AUTH_USER_MODEL)

    def test_render_form_sanity(self):
        """Is the primary h1 as expected"""
        artist = mommy.make('cradmin_listbuilder_guide.Artist', admins=[self.user, self.user_two])
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=self.user,
            viewkwargs={'pk': artist.id}
        )
        self.assertTrue(mockresponse.selector.one('.test-primary-h1'))
        expected_h1 = 'Edit artist'
        actual_h1 = mockresponse.selector.one('.test-primary-h1').text_normalized
        self.assertEqual(expected_h1, actual_h1)

    def test_empty_required_field(self):
        """Should get warning message if artist name is empty"""
        artist = mommy.make('cradmin_listbuilder_guide.Artist', admins=[self.user, self.user_two])
        mockresponse = self.mock_http200_postrequest_htmls(
            cradmin_role=self.user,
            viewkwargs={'pk': artist.id},
            requestkwargs={
                'data': {
                    'name': ''
                }
            }
        )
        self.assertTrue(mockresponse.selector.one('#id_name_wrapper .test-warning-message'))
        expected_message = 'This field is required.'
        actual_message = mockresponse.selector.one('#id_name_wrapper .test-warning-message').text_normalized
        self.assertEqual(expected_message, actual_message)

    def test_post_sanity(self):
        artist = mommy.make('cradmin_listbuilder_guide.Artist', admins=[self.user, self.user_two], name='Dolly')
        self.mock_http302_postrequest(
            cradmin_role=self.user,
            viewkwargs={'pk': artist.id},
            requestkwargs={
                'data': {
                    'name': 'Anton'
                }
            }
        )
        artists_in_db = Artist.objects.all()
        self.assertEqual(1, artists_in_db.count())
        self.assertTrue(Artist.objects.filter(name='Anton').get())























