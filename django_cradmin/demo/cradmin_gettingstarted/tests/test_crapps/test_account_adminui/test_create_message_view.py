from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_gettingstarted.crapps.messages.create_message_view import CreateMessageView
from django_cradmin.demo.cradmin_gettingstarted.models import Message


class TestCreateMessageView(TestCase, cradmin_testhelpers.TestCaseMixin):
    viewclass = CreateMessageView

    def test_get_form_sanity(self):
        """Is the fields in the form"""
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertTrue(mockresponse.selector.one('#id_title_label'))
        self.assertTrue(mockresponse.selector.one('#id_body_label'))
        self.assertTrue(mockresponse.selector.one('.test-submit-primary'))

    def test_get_account_name_on_new_message_sanity(self):
        """Cradmin role should be saved as the model field account in a message"""
        account = mommy.make('cradmin_gettingstarted.Account', name='My Account')
        self.mock_http302_postrequest(
            cradmin_role=account,
            requestkwargs={
                'data': {
                    'title': 'New Message',
                    'body': 'Sylvester Stallone'
                }
            }
        )
        message = Message.objects.filter(title='New Message').get()
        self.assertEqual(message.account.id, account.id)


