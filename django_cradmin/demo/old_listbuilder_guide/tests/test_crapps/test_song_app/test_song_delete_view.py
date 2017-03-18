from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.song_app import song_delete_view
from django_cradmin.demo.cradmin_listbuilder_guide.models import Song


class TestSongDeleteView(TestCase, cradmin_testhelpers.TestCaseMixin):
    """"""
    viewclass = song_delete_view.SongDeleteView

    def test_render_form_sanity(self):
        """Is the delete question as expected"""
        artist = mommy.make('cradmin_listbuilder_guide.Artist')
        album = mommy.make('cradmin_listbuilder_guide.Album', artist=artist)
        song = mommy.make('cradmin_listbuilder_guide.Song', album=album, title='Donald')
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=artist,
            viewkwargs={'pk': song.id}
        )
        self.assertTrue(mockresponse.selector.one('#id_deleteview_question'))
        expected_question = 'Are you sure you want to delete "{}"?'.format(song.title)
        actual_question = mockresponse.selector.one('#id_deleteview_question').alltext_normalized
        self.assertEqual(expected_question, actual_question)

    def test_post_sanity(self):
        """Should get 302 redirect when successfull deletion"""
        artist = mommy.make('cradmin_listbuilder_guide.Artist')
        album = mommy.make('cradmin_listbuilder_guide.Album', artist=artist)
        song = mommy.make('cradmin_listbuilder_guide.Song', album=album, title='Donald')
        self.mock_http302_postrequest(
            cradmin_role=artist,
            viewkwargs={'pk': song.id},
        )

    def test_correct_song_deletion(self):
        """Only chosen song should be delete from an album"""
        artist = mommy.make('cradmin_listbuilder_guide.Artist')
        album = mommy.make('cradmin_listbuilder_guide.Album', artist=artist)
        song = mommy.make('cradmin_listbuilder_guide.Song', album=album, title='Donald')
        mommy.make('cradmin_listbuilder_guide.Song', album=album, _quantity=9)
        songs_in_db = Song.objects.all()
        self.assertEqual(10, songs_in_db.count())
        self.mock_http302_postrequest(
            cradmin_role=artist,
            viewkwargs={'pk': song.id}
        )
        songs_in_db = Song.objects.all()
        self.assertEqual(9, songs_in_db.count())
        self.assertFalse(Song.objects.filter(title='Donald'))
