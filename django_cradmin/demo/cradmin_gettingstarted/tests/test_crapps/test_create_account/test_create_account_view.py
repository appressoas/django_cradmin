import mock
from django.conf import settings
from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_gettingstarted.crapps.create_account import create_account_view
from django_cradmin.demo.cradmin_gettingstarted.models import Account


class TestCreateAccountView(TestCase, cradmin_testhelpers.TestCaseMixin):
    viewclass = create_account_view.CreateAccountView

    def test_get_render_form(self):
        mockrespone = self.mock_http200_getrequest_htmls()
        self.assertEqual(mockrespone.selector.one('#id_account_name_label').text_normalized, 'Account name')

    def test_post_form(self):
        self.mock_http302_postrequest(
            requestkwargs={
                'data': {
                    'account_name': 'Flaming Youth'
                }
            }
        )
        account_in_db = Account.objects.all()
        new_account = Account.objects.filter(account_name='Flaming Youth').get()
        self.assertEqual(1, account_in_db.count())
        self.assertEqual('Flaming Youth', new_account.account_name)
