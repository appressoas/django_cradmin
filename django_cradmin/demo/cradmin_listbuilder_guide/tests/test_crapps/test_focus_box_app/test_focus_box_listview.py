from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.focus_box_app import focus_box_listview


class TestFocusBoxListView(TestCase, cradmin_testhelpers.TestCaseMixin):
    """"""
    viewclass = focus_box_listview.FocusBoxSongListbuilderView

    def __set_cradmin_role(self):
        return mommy.make('cradmin_listbuilder_guide.Album')

    def test_render_list_sanity(self):
        """Should return a list of objects equal to objects in database"""
        album = self.__set_cradmin_role()
        mommy.make('cradmin_listbuilder_guide.Song', album=album, _quantity=20)
        mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=album)
        self.assertTrue(mockresponse.selector.one('.test-cradmin-listbuilder-list'))
        song_list = mockresponse.selector.list('.test-cradmin-listbuilder-item-value-renderer')
        self.assertEqual(20, len(song_list))

    def test_empty_list(self):
        """Should be an empty list when an album have no songs"""
        mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=self.__set_cradmin_role())
        self.assertTrue(mockresponse.selector.one('.test-cradmin-no-items-message'))
        self.assertEqual('No songs', mockresponse.selector.one('.test-cradmin-no-items-message').alltext_normalized)
