from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_gettingstarted.crapps.messages.message_list_view import MessageListBuilderView


class TestMessageListView(TestCase, cradmin_testhelpers.TestCaseMixin):
    """
    Simple Message Listbuilder View tests for the CRadmin application 'messages'
    """
    viewclass = MessageListBuilderView

    def setUp(self):
        self.account = mommy.make('cradmin_gettingstarted.Account', name='My Account')

    def test_get_render_form_sanity(self):
        mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=self.account)
        self.assertEqual('Messages',mockresponse.selector.one('title').text_normalized)
        self.assertEqual('Messages', mockresponse.selector.one('.test-primary-h1').text_normalized)

    def test_render_list_sanity(self):
        mommy.make(
            'cradmin_gettingstarted.Message',
            account=self.account,
            _quantity=5
        )
        mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=self.account)
        message_list = mockresponse.selector.list('.test-cradmin-listbuilder-item-value-renderer')
        self.assertEqual(5, len(message_list))

    def test_render_item_value_sanity(self):
        my_message = mommy.make(
            'cradmin_gettingstarted.Message',
            account=self.account,
            title='Hello World',
            body='Life is beatiful'
        )
        mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=self.account)
        self.assertTrue(mockresponse.selector.one('.test-cradmin-listbuilder-title-description__title'))
        self.assertTrue(mockresponse.selector.one('.test-cradmin-listbuilder-title-description__description'))
        message_title = mockresponse.selector.one('.test-cradmin-listbuilder-title-description__title').text_normalized
        message_body = mockresponse.selector.one(
            '.test-cradmin-listbuilder-title-description__description').text_normalized
        self.assertEqual(my_message.title, message_title)
        self.assertEqual(my_message.body, message_body)
