from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_gettingstarted.crapps.messages import message_edit_views


class TestMessageEditView(TestCase, cradmin_testhelpers.TestCaseMixin):
    """
    Simple Edit Message View tests for the CRadmin application 'messages'
    """
    viewclass = message_edit_views.MessageEditView

    def setUp(self):
        self.account = mommy.make('cradmin_gettingstarted.Account', name='My Account')
        self.message = mommy.make(
            'cradmin_gettingstarted.Message',
            account=self.account,
            title='Hello World',
            body='Life is Beatiful'
        )

    def test_get_view_title_sanity(self):
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=self.account,
            viewkwargs={'pk': self.message.id}
        )
        self.assertTrue(mockresponse.selector.one('.test-primary-h1'))
        view_title = mockresponse.selector.one('.test-primary-h1').text_normalized
        self.assertTrue('Edit message', view_title)

    def test_post_without_required_field_title(self):
        mockresponse = self.mock_http200_postrequest_htmls(
            cradmin_role=self.account,
            viewkwargs={'pk': self.message.id},
            requestkwargs={
                'data': {
                    'title': '',
                    'body': 'A body'
                }
            }
        )
        self.assertTrue(mockresponse.selector.one('#id_title_wrapper'))
        self.assertEqual('This field is required.',
                         mockresponse.selector.one('#id_title_wrapper .test-warning-message').alltext_normalized)

    def test_post_without_required_field_body(self):
        mockresponse = self.mock_http200_postrequest_htmls(
            cradmin_role=self.account,
            viewkwargs={'pk': self.message.id},
            requestkwargs={
                'data': {
                    'title': 'A title',
                    'body': ''
                }
            }
        )
        self.assertTrue(mockresponse.selector.one('#id_body_wrapper'))
        self.assertEqual('This field is required.',
                         mockresponse.selector.one('#id_body_wrapper .test-warning-message').alltext_normalized)

    def test_post_message_sanity(self):
        mockresponse = self.mock_http302_postrequest(
            cradmin_role=self.account,
            viewkwargs={'pk': self.message.id},
            requestkwargs={
                'data': {
                    'title': 'Hello Space',
                    'body': 'But you cannot hear me, can you?'
                }
            }
        )
        self.assertEqual(302, mockresponse.response.status_code)
