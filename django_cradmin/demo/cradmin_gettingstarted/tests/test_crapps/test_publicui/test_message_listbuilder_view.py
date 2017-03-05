from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_gettingstarted.crapps.publicui import message_list_view


class TestMessageListView(TestCase, cradmin_testhelpers.TestCaseMixin):
    viewclass = message_list_view.MessageListBuilderView

    def get_message_title_when_one_message(self):
        message = mommy.make(
            'cradmin_gettingstarted.Message',
            title='A message',
            body='Here is the body',
        )
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertTrue(mockresponse.selector.one('.test-cradmin-listbuilder-title-description__title'))
        title = mockresponse.selector.one('.test-cradmin-listbuilder-title-description__title').text_normalized
        self.assertEqual(message.title, title)

    def test_number_of_messages_in_html(self):
        mommy.make('cradmin_gettingstarted.Message', _quantity=5)
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertTrue(mockresponse.selector.list('.test-cradmin-listbuilder-title-description__description'))
        messages_in_template = mockresponse.selector.list('.test-cradmin-listbuilder-title-description__description')
        self.assertEqual(5, len(messages_in_template))

    def test_no_message_in_system_information(self):
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertTrue(mockresponse.selector.one('.test-no-messages'))
        template_message = mockresponse.selector.one('.test-no-messages').text_normalized
        self.assertEqual('No messages in system', template_message)

    def test_account_name_displayed_in_message_description(self):
        account = mommy.make(
            'cradmin_gettingstarted.Account',
            name='My Account'
        )
        mommy.make(
            'cradmin_gettingstarted.Message',
            account=account
        )
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertTrue(mockresponse.selector.one('.test-listbuilder-posted-by-account'))
        name_in_template = mockresponse.selector.one('.test-listbuilder-posted-by-account').text_normalized
        self.assertEqual(account.name, name_in_template)

    def test_item_frame_and_link_from_listbuilder(self):
        mommy.make('cradmin_gettingstarted.Message')
        mockresponse = self.mock_http200_getrequest_htmls()
        render_item_frame = mockresponse.selector.one('.test-cradmin-listbuilder-item-frame-renderer')
        listbuilder_link = mockresponse.selector.one('.test-cradmin-listbuilder-link')
        self.assertTrue(render_item_frame)
        self.assertTrue(listbuilder_link)
