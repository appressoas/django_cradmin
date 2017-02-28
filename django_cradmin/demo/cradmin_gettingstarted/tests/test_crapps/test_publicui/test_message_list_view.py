from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_gettingstarted.crapps.publicui.message_list_view import MessageListView


class TestMessageListView(TestCase, cradmin_testhelpers.TestCaseMixin):
    viewclass = MessageListView

    def get_message_title_when_one_message(self):
        message = mommy.make(
            'cradmin_gettingstarted.Message',
            title='A message',
            body='Here is the body',
        )
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertTrue(mockresponse.selector.one('.test-public-message-title'))
        title = mockresponse.selector.one('.test-public-message-title').text_normalized
        self.assertEqual(message.title, title)

    def test_number_of_messages_in_html(self):
        mommy.make('cradmin_gettingstarted.Message', _quantity=5)
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertTrue(mockresponse.selector.list('.test-public-message-body'))
        self.assertEqual(5, len(mockresponse.selector.list('.test-public-message-body')))
