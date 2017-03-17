from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.song_app import song_edit_view
from django_cradmin.demo.cradmin_listbuilder_guide.models import Song


class TestSongEditView(TestCase, cradmin_testhelpers.TestCaseMixin):
    """"""
    viewclass = song_edit_view.SongEditView

    def setUp(self):
        self.artist = mommy.make('cradmin_listbuilder_guide.Artist')
        self.album = mommy.make('cradmin_listbuilder_guide.Album', artist=self.artist, title='Powerslave')

    def test_render_sanity(self):
        """Is the primary h1 as expected"""
        song = mommy.make('cradmin_listbuilder_guide.Song', album=self.album, title='Aces High')
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=self.artist,
            viewkwargs={'pk': song.id}
        )
        self.assertTrue(mockresponse.selector.one('.test-primary-h1'))
        expected_h1 = 'Edit song'
        actual_h1 = mockresponse.selector.one('.test-primary-h1').text_normalized
        self.assertEqual(expected_h1, actual_h1)

    def test_missing_required_field_title(self):
        """Should get warning message for title field"""
        song = mommy.make('cradmin_listbuilder_guide.Song', album=self.album, title='Aces High')
        mockresponse = self.mock_http200_postrequest_htmls(
            cradmin_role=self.artist,
            viewkwargs={'pk': song.id},
            requestkwargs={
                'data': {
                    'title': '',
                    'album': self.album.id
                }
            }
        )
        self.assertTrue(mockresponse.selector.one('#id_title_wrapper .test-warning-message'))
        expected_message = 'This field is required.'
        actual_message = mockresponse.selector.one('#id_title_wrapper .test-warning-message').text_normalized
        self.assertEqual(expected_message, actual_message)

    def test_post_sanity(self):
        """Should be redirected 302 when edit success"""
        song = mommy.make('cradmin_listbuilder_guide.Song', album=self.album, title='Aces High')
        self.mock_http302_postrequest(
            cradmin_role=self.artist,
            viewkwargs={'pk': song.id},
            requestkwargs={
                'data': {
                    'title': 'Aces Low',
                    'album': self.album.id
                }
            }
        )

    def test_correct_song_is_updated(self):
        """With several songs, is the correct song updated"""
        song = mommy.make('cradmin_listbuilder_guide.Song', album=self.album, title='Aces High')
        mommy.make('cradmin_listbuilder_guide.Song', album=self.album, _quantity=9)
        songs_in_db = Song.objects.all()
        self.assertEqual(10, songs_in_db.count())
        self.mock_http302_postrequest(
            cradmin_role=self.artist,
            viewkwargs={'pk': song.id},
            requestkwargs={
                'data': {
                    'title': 'Ace of Spades',
                    'album': self.album.id
                }
            }
        )
        songs_in_db = Song.objects.all()
        self.assertEqual(10, songs_in_db.count())
        self.assertTrue(Song.objects.filter(title='Ace of Spades').get())
        self.assertFalse(Song.objects.filter(title='Aces High'))





























