from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.song_app import song_create_view
from django_cradmin.demo.cradmin_listbuilder_guide.models import Song, Album


class TestSongCreateView(TestCase, cradmin_testhelpers.TestCaseMixin):
    viewclass = song_create_view.SongCreateView

    def setUp(self):
        self.artist = mommy.make('cradmin_listbuilder_guide.Artist', name='Ozzy')

    def test_get_form_sanity(self):
        """Is the form rendered with correct primary h1"""
        album = mommy.make('cradmin_listbuilder_guide.Album', title='Black Rain', artist=self.artist)
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=self.artist,
            viewkwargs={'pk': album.id}
        )
        self.assertTrue(mockresponse.selector.one('.test-primary-h1'))
        self.assertEqual('Create song', mockresponse.selector.one('.test-primary-h1').text_normalized)

    def test_post_withouth_required_field_title(self):
        """Shold get a warning message when no song title passed"""
        album = mommy.make('cradmin_listbuilder_guide.Album', title='Black Rain', artist=self.artist)
        mockresponse = self.mock_http200_postrequest_htmls(
            cradmin_role=self.artist,
            viewkwargs={'pk': album.id},
            requestkwargs={
                'data': {
                    'title': '',
                    'album': album.id
                }
            }
        )
        self.assertTrue(mockresponse.selector.one('#id_title_wrapper .test-warning-message'))
        excpected_warning_message = 'This field is required.'
        actual_warning_message = mockresponse.selector.one('#id_title_wrapper .test-warning-message').text_normalized
        self.assertEqual(excpected_warning_message, actual_warning_message )

    def test_post_withouth_required_field_album(self):
        """Should get a warning message when no album is passed"""
        album = mommy.make('cradmin_listbuilder_guide.Album', title='Black Rain', artist=self.artist)
        mockresponse = self.mock_http200_postrequest_htmls(
            cradmin_role=self.artist,
            viewkwargs={'pk': album.id},
            requestkwargs={
                'data': {
                    'title': 'Crazy Train',
                    'album': ''
                }
            }
        )
        self.assertTrue(mockresponse.selector.one('#id_album_wrapper .test-warning-message'))
        expected_warning_message = 'This field is required.'
        actual_warning_message =  mockresponse.selector.one('#id_album_wrapper .test-warning-message').text_normalized
        self.assertEqual(expected_warning_message, actual_warning_message)

    def test_post_success_sanity(self):
        """Should get a 302 redirect after posting new song to an album"""
        album = mommy.make('cradmin_listbuilder_guide.Album', title='Black Rain', artist=self.artist)
        self.mock_http302_postrequest(
            cradmin_role=self.artist,
            viewkwargs={'pk': album.id},
            requestkwargs={
                'data': {
                    'title': 'Crazy Train',
                    'album': album.id
                }
            }
        )

    def test_new_song_is_on_album_in_db(self):
        """Should get album by song from db after sucessfull post"""
        album = mommy.make('cradmin_listbuilder_guide.Album', title='Black Rain', artist=self.artist)
        songs_in_db = Song.objects.all().count()
        self.assertEqual(0, songs_in_db)
        self.mock_http302_postrequest(
            cradmin_role=self.artist,
            viewkwargs={'pk': album.id},
            requestkwargs={
                'data': {
                    'title': 'Crazy Train',
                    'album': album.id
                }
            }
        )
        songs_in_db = Song.objects.all().count()
        self.assertEqual(1, songs_in_db)
        album_song = Song.objects.select_related('album').get(id=album.id)
        self.assertEqual(album_song.album, album)

    def test_add_song_to_correct_album_when_multiple_albums_from_same_artist(self):
        album = mommy.make('cradmin_listbuilder_guide.Album', title='Black Rain', artist=self.artist)
        mommy.make('cradmin_listbuilder_guide.Album', artist=self.artist, _quantity=10)
        self.mock_http302_postrequest(
            cradmin_role=self.artist,
            viewkwargs={'pk': album.id},
            requestkwargs={
                'data': {
                    'title': 'On album',
                    'album': album.id
                }
            }
        )
        self.assertTrue(Song.objects.filter(album=album, title='On album').get())
