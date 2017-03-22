from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.title_description_app import title_description_listview


class TestTitleDescriptionListview(TestCase, cradmin_testhelpers.TestCaseMixin):
    """"""
    viewclass = title_description_listview.TitleDescriptionListbuilderView

    def __set_cradmin_role(self):
        return mommy.make('cradmin_listbuilder_guide.Album')

    def test_get_render_sanity(self):
        """Should have a list with length equal to objects in db"""
        album = self.__set_cradmin_role()
        mommy.make('cradmin_listbuilder_guide.Song', album=album, _quantity=8)
        mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=album)
        self.assertTrue(mockresponse.selector.one('.test-cradmin-listbuilder-list'))
        song_list = mockresponse.selector.list('.test-cradmin-listbuilder-item-value-renderer')
        self.assertEqual(8, len(song_list))

    def test_empty_list(self):
        """If the object list is empty, a message should be displayed"""
        mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=self.__set_cradmin_role())
        self.assertTrue(mockresponse.selector.one('.test-cradmin-no-items-message'))
        actual_message = mockresponse.selector.one('.test-cradmin-no-items-message').alltext_normalized
        self.assertEqual('No songs', actual_message)

    def test_render_title_description(self):
        """Should render the title description for each item in list"""
        album = self.__set_cradmin_role()
        mommy.make('cradmin_listbuilder_guide.Song', album=album, written_by='Donald Duck')
        mommy.make('cradmin_listbuilder_guide.Song', album=album, written_by='Dolly Duck')
        mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=album)
        self.assertTrue(mockresponse.selector.list('.test-cradmin-listbuilder-title-description__description'))
        song_list = mockresponse.selector.list('.test-cradmin-listbuilder-title-description__description')
        self.assertTrue(2, len(song_list))

