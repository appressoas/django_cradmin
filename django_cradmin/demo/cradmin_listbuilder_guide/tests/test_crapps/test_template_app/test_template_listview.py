from django.conf import settings
from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.template_app import template_listview


class TestItemValueTemplate(TestCase, cradmin_testhelpers.TestCaseMixin):
    """Tests for our new template used by the item value class"""
    viewclass = template_listview.TemplateListbuilderView

    def __set_cradmin_role(self):
        return mommy.make('cradmin_listbuilder_guide.Album', title='Andeby')

    def test_render_list_sanity(self):
        """Is the blocks we created inside the template"""
        album = self.__set_cradmin_role()
        mommy.make('cradmin_listbuilder_guide.Song', title='Donald Duck', album=album, written_by='Anton')
        mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=album)
        self.assertTrue(mockresponse.selector.one('.test-song-heading'))
        self.assertTrue(mockresponse.selector.list('.test-extra-info-content'))

    def test_message_when_no_songs_in_db(self):
        """Should get a message if no songs is in db"""
        mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=self.__set_cradmin_role())
        self.assertTrue(mockresponse.selector.one('.test-cradmin-no-items-message'))
        actual_message = mockresponse.selector.one('.test-cradmin-no-items-message').alltext_normalized
        self.assertEqual('No songs', actual_message)


class TestListbuilderViewTemplate(TestCase, cradmin_testhelpers.TestCaseMixin):
    """Tests of the template for the listbuilder view"""
    viewclass = template_listview.TemplateListbuilderView

    def __set_cradmin_role(self):
        return mommy.make('cradmin_listbuilder_guide.Album', title='My Album')

    def test_render_page_sanity(self):
        """Is the primary h1 rendered with new context from our template"""
        album = self.__set_cradmin_role()
        mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=album)
        self.assertTrue(mockresponse.selector.one('.test-primary-h1'))
        expected_h1 = 'Songs on album {}'.format(album.title)
        actual_h1 = mockresponse.selector.one('.test-primary-h1').text_normalized
        self.assertEqual(expected_h1, actual_h1)

    def test_render_page_when_user_is_admin_for_two_albums(self):
        """Only album which is cradmin role should show as part of primary h1"""
        album = self.__set_cradmin_role()
        user = mommy.make(settings.AUTH_USER_MODEL)
        mommy.make(
            'cradmin_listbuilder_guide.AlbumAdministrator',
            album=album,
            user=user
        )
        album_two = mommy.make('cradmin_listbuilder_guide.Album')
        mommy.make('cradmin_listbuilder_guide.AlbumAdministrator',user=user, album=album_two)
        mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=album)
        self.assertTrue(mockresponse.selector.one('.test-primary-h1'))
        expected_h1 = 'Songs on album {}'.format(album.title)
        actual_h1 = mockresponse.selector.one('.test-primary-h1').text_normalized
        self.assertEqual(expected_h1, actual_h1)

























