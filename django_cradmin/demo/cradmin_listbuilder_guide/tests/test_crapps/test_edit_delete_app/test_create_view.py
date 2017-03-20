from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.edit_delete_app import song_create_view


class TestSongView(TestCase, cradmin_testhelpers.TestCaseMixin):
    """"""
    viewclass = song_create_view.SongCreateView

    def test_render_form_sanity(self):
        """Is the primary h1 as axpected"""
        mockresponse = self.mock_http200_getrequest_htmls()
        expected_value = 'Create Song'
        self.assertEqual(expected_value, mockresponse.selector.one('title').text_normalized)
        self.assertTrue(mockresponse.selector.one('.test-primary-h1'))
        self.assertEqual(expected_value, mockresponse.selector.one('.test-primary-h1').text_normalized)

    def __form_data(self, **data):
        """Helper class when passing data for request"""
        if 'title' not in data:
            data['title'] = 'Dolly'
        if 'written_by' not in data:
            data['written_by'] = 'Donald'
        if 'time' not in data:
            data['time'] = 3
        return data

    def test_warning_message_no_title_field(self):
        """Does warning message css class appear when no value in field"""
        mockresponse = self.mock_http200_postrequest_htmls(
            requestkwargs={
                'data': self.__form_data(title='')
            }
        )
        self.assertTrue(mockresponse.selector.one('.test-warning-message'))

    def test_warning_message_no_written_by_field(self):
        """Does warning message css class appear when no value in field"""
        mockresponse = self.mock_http200_postrequest_htmls(
            requestkwargs={
                'data': self.__form_data(written_by='')
            }
        )
        self.assertTrue(mockresponse.selector.one('.test-warning-message'))

    def test_warning_message_no_time_field(self):
        """Does warning message css class appear when no value in field"""
        mockresponse = self.mock_http200_postrequest_htmls(
            requestkwargs={
                'data': self.__form_data(time='')
            }
        )
        self.assertTrue(mockresponse.selector.one('.test-warning-message'))

    def test_all_required_fields_has_value(self):
        """Should get a 302 redirect after posting form"""
        album = mommy.make('cradmin_listbuilder_guide.Album')
        self.mock_http302_postrequest(
            cradmin_role=album,
            requestkwargs={
                'data': self.__form_data()
            }
        )











