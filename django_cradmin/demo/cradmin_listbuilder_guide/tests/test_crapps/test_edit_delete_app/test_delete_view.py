from django.core.exceptions import ObjectDoesNotExist
from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.edit_delete_app import edit_views
from django_cradmin.demo.cradmin_listbuilder_guide.models import Song


class TestEditDeleteSongDeleteView(TestCase, cradmin_testhelpers.TestCaseMixin):
    """"""
    viewclass = edit_views.EditDeleteSongDeleteView

    def __cradmin_role(self):
        """Cradmin role used to get access for deletion"""
        return mommy.make('cradmin_listbuilder_guide.Album')

    def test_render_page_sanity(self):
        """Is delete question as expected"""
        album = self.__cradmin_role()
        song = mommy.make('cradmin_listbuilder_guide.Song', album=album, title='Killers')
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=album,
            viewkwargs={'pk': song.id}
        )
        self.assertTrue(mockresponse.selector.one('#id_deleteview_question'))
        expected_question = 'Are you sure you want to delete "{}"?'.format(song.title)
        actual_question = mockresponse.selector.one('#id_deleteview_question').alltext_normalized
        self.assertEqual(expected_question, actual_question)

    def test_delete_sanity(self):
        """Should get a 302 redirect after deletion"""
        album = self.__cradmin_role()
        song = mommy.make('cradmin_listbuilder_guide.Song', album=album)
        self.mock_http302_postrequest(
            cradmin_role=album,
            viewkwargs={'pk': song.id}
        )

    def test_correct_song_deleted(self):
        """Only one Song should be deleted from an album with several songs"""
        album = self.__cradmin_role()
        mommy.make('cradmin_listbuilder_guide.Song', album=album, _quantity=9)
        song = mommy.make('cradmin_listbuilder_guide.Song', album=album, title='Killers')
        self.mock_http302_postrequest(
            cradmin_role=album,
            viewkwargs={'pk': song.id}
        )
        with self.assertRaises(ObjectDoesNotExist):
            self.assertTrue(Song.objects.filter(title='Killers').get())
        self.assertEqual(9, Song.objects.all().count())













