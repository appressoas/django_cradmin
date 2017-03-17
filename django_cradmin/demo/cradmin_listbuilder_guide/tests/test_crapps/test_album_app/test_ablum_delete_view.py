from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.album_app import album_delete_view
from django_cradmin.demo.cradmin_listbuilder_guide.models import Album


class TestAlbumDeleteView(TestCase, cradmin_testhelpers.TestCaseMixin):
    """"""
    viewclass = album_delete_view.AlbumDeleteView

    def test_render_form_sanity(self):
        """Is the primary h1 as expected"""
        artist = mommy.make('cradmin_listbuilder_guide.Artist', name='Metallica')
        album = mommy.make('cradmin_listbuilder_guide.Album', artist=artist, title='St.Anger')
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=artist,
            viewkwargs={'pk': album.id}
        )
        self.assertTrue(mockresponse.selector.one('#id_deleteview_question'))
        expected_question = 'Are you sure you want to delete "{}"?'.format(album.title)
        actual_question = mockresponse.selector.one('#id_deleteview_question').alltext_normalized
        self.assertEqual(expected_question, actual_question)

    def test_is_correct_album_deleted(self):
        """Only the correct album should be removed from an artist"""
        artist = mommy.make('cradmin_listbuilder_guide.Artist', name='Metallica')
        album = mommy.make('cradmin_listbuilder_guide.Album', artist=artist, title='St.Anger')
        mommy.make('cradmin_listbuilder_guide.Album', artist=artist, _quantity=12)
        artist_album_in_db = Album.objects.all()
        self.assertEqual(13, artist_album_in_db.count())
        self.mock_http302_postrequest(
            cradmin_role=artist,
            viewkwargs={'pk': album.id}
        )
        artist_album_in_db = Album.objects.all()
        self.assertEqual(12, artist_album_in_db.count())
        self.assertFalse(Album.objects.filter(title=album.title))
