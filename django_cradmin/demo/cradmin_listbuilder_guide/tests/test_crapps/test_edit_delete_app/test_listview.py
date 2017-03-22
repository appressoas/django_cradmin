from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.edit_delete_app import listview


class TestSongEditDelteListview(TestCase, cradmin_testhelpers.TestCaseMixin):
    """"""
    viewclass = listview.EditDeleteSongListbuilderView

    def test_render_no_songs_message(self):
        """If no songs on album, a message should appear"""
        album = mommy.make('cradmin_listbuilder_guide.Album')
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=album
        )
        self.assertTrue(mockresponse.selector.one('.test-cradmin-no-items-message'))
        self.assertEqual('No songs',
                         mockresponse.selector.one('.test-cradmin-no-items-message').alltext_normalized)

    def test_get_sanity_create_button(self):
        """Should have a create button"""
        album = mommy.make('cradmin_listbuilder_guide.Album')
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=album
        )
        self.assertTrue(mockresponse.selector.one('.test-listbuilder-create-button'))

    def test_get_list_of_songs_sanity(self):
        """Should show multiple list itemvalues which each have a p-tag with button test class"""
        album = mommy.make('cradmin_listbuilder_guide.Album')
        mommy.make('cradmin_listbuilder_guide.Song', album=album, _quantity=10)
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=album
        )
        buttons_on_page = mockresponse.selector.list('.test-cradmin-listbuilder-edit-delete__buttons')
        self.assertEqual(10, len(buttons_on_page))
