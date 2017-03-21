from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.template_app import template_listview


class TestItemValueTemplate(TestCase, cradmin_testhelpers.TestCaseMixin):
    """Tests for our new template used by the item value class"""
    viewclass = template_listview.TemplateListbuilderView

    def __set_cradmin_role(self):
        return mommy.make('cradmin_listbuilder_guide.Album', title='Andeby')

    def test_primary_h1_sanity(self):
        """Is the h1 preserved through template extensions"""
        mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=self.__set_cradmin_role())
        self.assertTrue(mockresponse.selector.one('.test-primary-h1'))
        self.assertEqual('Songs', mockresponse.selector.one('.test-primary-h1').text_normalized)

    def test_render_list_sanity(self):
        """Is the blocks we created inside the template"""
        album = self.__set_cradmin_role()
        mommy.make('cradmin_listbuilder_guide.Song', title='Donald Duck', album=album, written_by='Anton')
        mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=album)
        self.assertTrue(mockresponse.selector.one('.test-song-heading'))
        self.assertTrue(mockresponse.selector.list('.test-extra-info-content'))
        mockresponse.selector.prettyprint()

    def test_message_when_no_songs_in_db(self):
        """Should get a message if no songs is in db"""
        mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=self.__set_cradmin_role())
        mockresponse.selector.prettyprint()
        self.assertTrue(mockresponse.selector.one('.test-cradmin-no-items-message'))
        actual_message = mockresponse.selector.one('.test-cradmin-no-items-message').alltext_normalized
        self.assertEqual('No songs', actual_message)
