from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_gettingstarted.crapps.publicui import message_list_view


class TestMessageListView(TestCase, cradmin_testhelpers.TestCaseMixin):
    """
    This test class uses two templates, which together gives the public UI for a list of messages in the system.
    We have created both a template for the listbuilder item values and one for the listbuilder view.
    """
    viewclass = message_list_view.MessageListBuilderView

    def get_message_title_when_one_message(self):
        """Test for template ``message_listbuilder_view.django.html"""
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
        """Test for template ``message_listbuilder_view.django.html"""
        mommy.make('cradmin_gettingstarted.Message', _quantity=5)
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertTrue(mockresponse.selector.list('.test-cradmin-listbuilder-title-description__description'))
        messages_in_template = mockresponse.selector.list('.test-cradmin-listbuilder-title-description__description')
        self.assertEqual(5, len(messages_in_template))

    def test_no_message_in_system_information(self):
        """Test for template ``message_listbuilder_view.django.html"""
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertTrue(mockresponse.selector.one('.test-no-messages'))
        template_message = mockresponse.selector.one('.test-no-messages').text_normalized
        self.assertEqual('No messages in system', template_message)

    def test_account_name_displayed_in_message_description(self):
        """
        This test checks the ``block below-description`` in the template ``message_listbuilder.django.html``.
        """
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

    def test_message_content_truncatechars(self):
        """
        In this test we checks the ``block description-content`` which is written in the template
        ``message_listbuilder.django.html``.
        """
        message_content = 'IM' * 255
        mommy.make(
            'cradmin_gettingstarted.Message',
            body=message_content
        )
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertTrue(mockresponse.selector.one('.test-cradmin-listbuilder-title-description__description'))
        template_message_body = mockresponse.selector.one(
            '.test-cradmin-listbuilder-title-description__description').text_normalized
        self.assertEqual(100, len(template_message_body))

    def test_listbuilder_link_href_sanity(self):
        """Test for template ``message_listbuilder_view.django.html"""
        message = mommy.make('cradmin_gettingstarted.Message')
        mockresponse = self.mock_http200_getrequest_htmls(
            viewkwargs={'pk': message.id}
        )
        listbuilder_link = mockresponse.selector.one('.test-cradmin-listbuilder-link')
        self.assertTrue(listbuilder_link)
        href_in_template = mockresponse.selector.one('.test-cradmin-listbuilder-item-frame-renderer')['href']
        expected_href = '/gettingstarted/messages/detail/{}'.format(message.id)
        self.assertEqual(expected_href, href_in_template)
