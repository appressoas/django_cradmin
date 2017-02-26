from django_cradmin.crinstance import reverse_cradmin_url
from django_cradmin.demo.cradmin_gettingstarted.crapps.account_adminui import mixins
from django_cradmin.demo.cradmin_gettingstarted.models import AccountAdministrator
from django_cradmin.viewhelpers import formview


class CreateAccountView(mixins.AccountCreateUpdateMixin, formview.WithinRoleCreateView):
    """
    View where an Account is created and saved.
    When saving an Account, it also creates and AccountAdministrator for that account.
    Reverse to the CRadmin instance `account_admin`.
    """
    roleid_field = 'create_account'
    template_name = 'cradmin_gettingstarted/crapps/create_account/create_account.django.html'

    def save_object(self, form, commit=True):
        self.new_account = super(CreateAccountView, self).save_object(form, commit)
        account_administrator = AccountAdministrator(
            user=self.request.user,
            account=self.new_account
        )
        account_administrator.full_clean()
        account_administrator.save()
        return self.new_account

    def get_success_url(self):
        return reverse_cradmin_url(
            instanceid='account_admin',
            appname='account_admin',
            roleid=self.new_account.id
        )
