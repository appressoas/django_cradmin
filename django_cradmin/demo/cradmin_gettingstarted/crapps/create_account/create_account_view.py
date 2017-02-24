from django_cradmin import crapp
from django_cradmin.crinstance import reverse_cradmin_url
from django_cradmin.demo.cradmin_gettingstarted.crapps.account_adminui import mixins
from django_cradmin.demo.cradmin_gettingstarted.models import AccountAdministrator
from django_cradmin.viewhelpers import formview


class CreateAccountView(mixins.AccountCreateUpdateMixin, formview.WithinRoleCreateView):
    roleid_field = 'create_account'

    def save_object(self, form, commit=True):
        self.new_account = super(CreateAccountView, self).save_object(form, commit)
        account_administrator = AccountAdministrator(
            user=self.request.user,
            account=self.new_account
        )
        account_administrator.full_clean()
        account_administrator.save()
        print('*'*88)
        print('Saved account admin')
        print('*'*88)

        return self.new_account

    def get_success_url(self):
        # return self.request.cradmin_app.reverse_appindexurl()
        print('*'*88)
        print('Start get success url')
        print('*'*88)
        print(self.new_account)
        print('*'*88)
        print(self.new_account.id)
        print('*'*88)
        print(dir(self.new_account))
        print('*'*88)
        print(self.new_account.accountadministrator_set)
        print('*'*88)
        account_admin = AccountAdministrator.objects.get(account=self.new_account.id, user=self.request.user)
        print(dir(account_admin.user))
        print('*'*88)
        print('Account admin user: {}'.format(account_admin.user.email))
        print('*'*88)
        print('Cradmin role: {}'.format(self.request.cradmin_role))
        print('*'*88)
        print('Cradmin app: {}'.format(self.request.cradmin_app))
        print('*'*88)
        print('Cradmin instance: {}'.format(self.request.cradmin_instance))
        print('*'*88)
        print('User: {}'.format(self.request.user.email))




        return reverse_cradmin_url(
            instanceid='gettingstarted',
            appname='account_admin',
            roleid=self.new_account.id
        )
