import datetime
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
        self.assertTrue(mockresponse.selector.one('.test-listbuilder-account-name'))
        name_in_template = mockresponse.selector.one('.test-listbuilder-account-name').text_normalized
        self.assertEqual(account.name, name_in_template)

    def test_correct_account_name_when_several_accounts(self):
        account = mommy.make(
            'cradmin_gettingstarted.Account',
            name='My Account'
        )
        mommy.make('cradmin_gettingstarted.Account', _quantity=10)
        mommy.make(
            'cradmin_gettingstarted.Message',
            account=account
        )
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertTrue(mockresponse.selector.one('.test-listbuilder-account-name'))
        account_name_html = mockresponse.selector.one('.test-listbuilder-account-name').text_normalized
        self.assertEqual(account.name, account_name_html)

    def _get_account_id_as_css_class(self, account_id):
        """

        Args:
            account_id: the id of an account

        Returns: a string used by hmtls selector when selecting tags

        """
        return '.account-id-{}'.format(account_id)

    def test_list_of_messages_when_several_accounts(self):
        account = mommy.make(
            'cradmin_gettingstarted.Account',
            name='First Account',
        )
        mommy.make(
            'cradmin_gettingstarted.Message',
            account=account,
            _quantity=3
        )
        mommy.make(
            'cradmin_gettingstarted.Message',
            _quantity=10
        )
        mockresponse = self.mock_http200_getrequest_htmls()
        account_message_list = mockresponse.selector.list(self._get_account_id_as_css_class(account.id))
        self.assertEqual(3, len(account_message_list))

    def test_item_frame_and_link_from_listbuilder(self):
        mommy.make('cradmin_gettingstarted.Message')
        mockresponse = self.mock_http200_getrequest_htmls()
        render_item_frame = mockresponse.selector.one('.test-cradmin-listbuilder-item-frame-renderer')
        listbuilder_link = mockresponse.selector.one('.test-cradmin-listbuilder-link')
        self.assertTrue(render_item_frame)
        self.assertTrue(listbuilder_link)

    def test_pagination(self):
        """
        Paginate_by is sat to 10 in
        :class:`django_cradmin.demo.cradmin_gettingstarted.crapps.publicui.message_list_view.MessageListBuilderView`.
        If this value is changed you must update text in self.assertEqual for test to pass.
        """
        mommy.make('cradmin_gettingstarted.Message', _quantity=1000)
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertTrue(mockresponse.selector.one('.test-number-of-pages'))
        number_of_pages_html_text = mockresponse.selector.one('.test-number-of-pages').text_normalized
        self.assertEqual('Page 1 of 100.', number_of_pages_html_text)

    def test_if_no_messages_in_system(self):
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertTrue(mockresponse.selector.one('.test-no-messages'))
        no_messages_html_text = mockresponse.selector.one('.test-no-messages').text_normalized
        self.assertEqual('No messages in system', no_messages_html_text)
