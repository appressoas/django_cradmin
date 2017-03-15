from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.album_app import album_create_view
from django_cradmin.demo.cradmin_listbuilder_guide.models import Album


class TestAlbumCreateView(TestCase, cradmin_testhelpers.TestCaseMixin):
    viewclass = album_create_view.AlbumCreateView

    def setUp(self):
        self.artist = mommy.make('cradmin_listbuilder_guide.Artist', name='Iron Maiden')

    def test_get_form_sanity(self):
        """Is the primary h1 value as expected"""
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=self.artist
        )
        self.assertTrue(mockresponse.selector.one('.test-primary-h1'))
        self.assertEqual('Create album', mockresponse.selector.one('.test-primary-h1').text_normalized)

    def test_required_field_title_without_value(self):
        """Should get warning message when no value passed in form for field"""
        mockresponse = self.mock_http200_postrequest_htmls(
            cradmin_role=self.artist,
            requestkwargs={
                'data': {
                    'title': ''
                }
            }
        )
        self.assertTrue(mockresponse.selector.one('#id_title_wrapper .test-warning-message'))
        expected_warnign_message = 'This field is required.'
        actual_warning_message = mockresponse.selector.one('#id_title_wrapper .test-warning-message').text_normalized
        self.assertEqual(expected_warnign_message, actual_warning_message)

    def test_post_form_sanity(self):
        """Should get a 302 redirect after success"""
        self.mock_http302_postrequest(
            cradmin_role=self.artist,
            requestkwargs={
                'data': {
                    'title': 'Powerslave'
                }
            }
        )

    def test_new_ablum_saved_in_db(self):
        """A new album should be in db with correct title"""
        albums_in_db = Album.objects.all().count()
        self.assertEqual(0, albums_in_db)
        self.mock_http302_postrequest(
            cradmin_role=self.artist,
            requestkwargs={
                'data': {
                    'title': 'Powerslave'
                }
            }
        )
        albums_in_db = Album.objects.all().count()
        self.assertEqual(1, albums_in_db)
        self.assertTrue(Album.objects.filter(title='Powerslave').get())

    def test_artist_created_album(self):
        """The cradmin role should be the artist of the new album"""
        self.mock_http302_postrequest(
            cradmin_role=self.artist,
            requestkwargs={
                'data': {
                    'title': 'Powerslave'
                }
            }
        )
        album = Album.objects.filter(title='Powerslave').get()
        self.assertEqual(album.artist.id, self.artist.id)
