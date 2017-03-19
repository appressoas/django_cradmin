from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.edit_delete_app import song_edit_view


class TestSongEditView(TestCase, cradmin_testhelpers.TestCaseMixin):
    """"""
    viewclass = song_edit_view.SongEditView

    def __cradmin_role(self):
        return mommy.make('cradmin_listbuilder_guide.Album')

    def __post_song_data(self, **data):
        if 'title' not in data:
            data['title'] = 'Donald'
        if 'written_by' not in data:
            data['written_by'] = 'Dolly'
        if 'time' not in data:
            data['time'] = 3
        return data

    def __warning_message(self):
        return 'This field is required.'

    def test_render_form_sanity(self):
        album = self.__cradmin_role()
        song = mommy.make('cradmin_listbuilder_guide.Song', album=album)
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=album,
            viewkwargs={'pk': song.id}
        )
        expected_value = 'Edit Song'
        actual_value = mockresponse.selector.one('.test-primary-h1').text_normalized
        self.assertEqual(expected_value, actual_value)

    def test_warning_message_required_title_field(self):
        album = self.__cradmin_role()
        song = mommy.make('cradmin_listbuilder_guide.Song', album=album)
        mockresponse = self.mock_http200_postrequest_htmls(
            cradmin_role=album,
            viewkwargs={'pk': song.id},
            requestkwargs={
                'data': self.__post_song_data(title='')
            }
        )
        self.assertEqual(self.__warning_message(),
                         mockresponse.selector.one('.test-warning-message').text_normalized)

    def test_warning_message_required_field_written_by(self):
        album = self.__cradmin_role()
        song = mommy.make('cradmin_listbuilder_guide.Song', album=album)
        mockresponse = self.mock_http200_postrequest_htmls(
            cradmin_role=album,
            viewkwargs={'pk': song.id},
            requestkwargs={
                'data': self.__post_song_data(written_by='')
            }
        )
        self.assertEqual(self.__warning_message(),
                         mockresponse.selector.one('.test-warning-message').text_normalized)

    def test_warning_message_required_field_time(self):
        album = self.__cradmin_role()
        song = mommy.make('cradmin_listbuilder_guide.Song', album=album)
        mockresponse = self.mock_http200_postrequest_htmls(
            cradmin_role=album,
            viewkwargs={'pk': song.id},
            requestkwargs={
                'data': self.__post_song_data(time='')
            }
        )
        self.assertEqual(self.__warning_message(),
                         mockresponse.selector.one('.test-warning-message').text_normalized)

    def test_post_sanity(self):
        album = self.__cradmin_role()
        song = mommy.make('cradmin_listbuilder_guide.Song', album=album)
        self.mock_http302_postrequest(
            cradmin_role=album,
            viewkwargs={'pk': song.id},
            requestkwargs={
                'data': self.__post_song_data()
            }
        )
