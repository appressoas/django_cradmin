from django_cradmin.demo.cradmin_gettingstarted.models import Account, AccountAdministrator
from django_cradmin.viewhelpers import formview

from django_cradmin.demo.cradmin_gettingstarted.crapps.account_adminui import edit_account_view


class AccountCreateView(edit_account_view.AccountCreateUpdateMixin, formview.WithinRoleCreateView):
    model = Account
    roleid_field = 'account_create'

    def save_object(self, form, commit=True):
        new_account = super(AccountCreateView, self).save_object(form, commit)
        account_admin = AccountAdministrator(
            account=new_account,
            user=self.request.user
        )
        account_admin.full_clean()
        account_admin.save()
        return new_account
