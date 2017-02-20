from django.conf import settings
from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_gettingstarted.crapps.account import edit_account
from django_cradmin.demo.cradmin_gettingstarted.models import Account


class TestUpdateAccountView(TestCase, cradmin_testhelpers.TestCaseMixin):
    viewclass = edit_account.AccountUpdateView

    def test_get_form_renderable(self):
        account = mommy.make('cradmin_gettingstarted.Account', account_name='Charisma')
        mommy.make(
            'cradmin_gettingstarted.AccountAdministrator',
            account=account,
            user=mommy.make(settings.AUTH_USER_MODEL)
        )
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=account,
            viewkwargs={'pk': account.id}
        )
        self.assertTrue(mockresponse.selector.one('#id_account_name'))
        form_account_name = mockresponse.selector.one('#id_account_name').get('value')
        self.assertEqual(account.account_name, form_account_name)

    def test_post_without_required_account_name(self):
        account = mommy.make('cradmin_gettingstarted.Account', account_name='Charisma')
        mommy.make(
            'cradmin_gettingstarted.AccountAdministrator',
            account=account,
            user=mommy.make(settings.AUTH_USER_MODEL)
        )
        mockresponse = self.mock_http200_postrequest_htmls(
            cradmin_role=account,
            viewkwargs={'pk': account.id},
            requestkwargs={
                'data': {
                    'account_name': ''
                }
            }
        )
        self.assertTrue(mockresponse.selector.one('#id_account_name_wrapper'))
        warning_message = mockresponse.selector.one('#id_account_name_wrapper .test-warning-message').alltext_normalized
        self.assertEqual('This field is required.', warning_message)

    def test_post_with_required_account_name_updates_db(self):
        """Should get a 302 Found redirects and have one Account object in database with a new name"""
        account = mommy.make('cradmin_gettingstarted.Account', account_name='Charisma')
        mommy.make(
            'cradmin_gettingstarted.AccountAdministrator',
            account=account,
            user=mommy.make(settings.AUTH_USER_MODEL)
        )
        accounts_in_db = Account.objects.all()
        self.assertEqual(1, accounts_in_db.count())
        self.mock_http302_postrequest(
            cradmin_role=account,
            viewkwargs={'pk': account.id},
            requestkwargs={
                'data': {
                    'account_name': 'The idol'
                }
            }
        )
        accounts_in_db = Account.objects.all()
        self.assertEqual(1, accounts_in_db.count())
        get_account_from_db = Account.objects.filter(pk=account.id).get()
        self.assertEqual('The idol', get_account_from_db.account_name)
