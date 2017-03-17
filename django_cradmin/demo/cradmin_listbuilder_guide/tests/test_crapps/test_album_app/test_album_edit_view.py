from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.album_app import album_edit_view
from django_cradmin.demo.cradmin_listbuilder_guide.models import Album


class TestAlbumEditView(TestCase, cradmin_testhelpers.TestCaseMixin):
    """"""
    viewclass = album_edit_view.AlbumEditView

    def setUp(self):
        self.artist = mommy.make('cradmin_listbuilder_guide.Artist', name='Iron Maiden')

    def test_render_primary_h1_sanity(self):
        """Is the primary h1 as expected"""
        album = mommy.make('cradmin_listbuilder_guide.Album', artist=self.artist, title='Killers')
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=self.artist,
            viewkwargs={'pk': album.id}
        )
        self.assertTrue(mockresponse.selector.one('.test-primary-h1'))
        self.assertEqual('Edit album', mockresponse.selector.one('.test-primary-h1').text_normalized)

    def test_form_render_album_title(self):
        """Is the value for title wrapper the same as album title"""
        album = mommy.make('cradmin_listbuilder_guide.Album', artist=self.artist, title='Killers')
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=self.artist,
            viewkwargs={'pk': album.id}
        )
        self.assertTrue(mockresponse.selector.one('#id_title_wrapper .test-djangowidget-textinput'))
        expected_title = album.title
        actual_title = mockresponse.selector.one('#id_title_wrapper .test-djangowidget-textinput').get('value')
        self.assertEqual(expected_title, actual_title)

    def test_post_form_saniyt(self):
        """Should get a 302 redirect response"""
        album = mommy.make('cradmin_listbuilder_guide.Album', artist=self.artist, title='Killers')
        self.mock_http302_postrequest(
            cradmin_role=self.artist,
            viewkwargs={'pk': album.id},
            requestkwargs={
                'data': {
                    'title': 'Thou Shall not Kill',
                    'artist': self.artist.id
                }
            }
        )

    def test_album_in_db_is_updated(self):
        """Should have a new title on album after post"""
        album = mommy.make('cradmin_listbuilder_guide.Album', artist=self.artist, title='Killers')
        self.mock_http302_postrequest(
            cradmin_role=self.artist,
            viewkwargs={'pk': album.id},
            requestkwargs={
                'data': {
                    'title': 'Dolly Duck'
                }
            }
        )
        albums_in_db = Album.objects.all().count()
        self.assertEqual(1, albums_in_db)
        self.assertTrue(Album.objects.filter(title='Dolly Duck').get())
        self.assertFalse(Album.objects.filter(title='Killers'))
