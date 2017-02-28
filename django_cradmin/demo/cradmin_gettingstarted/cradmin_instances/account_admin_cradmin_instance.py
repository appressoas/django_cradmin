from django_cradmin import crinstance
from django_cradmin.demo.cradmin_gettingstarted.crapps import account_adminui
from django_cradmin.demo.cradmin_gettingstarted.models import Account


class AccountAdminCradminInstance(crinstance.BaseCrAdminInstance):
    """
    Cradmin instance for the account administrator ui.
    The rolequeryset returns all the accounts conncted to a user which is an AccountAdministrator.
    """

    id = 'account_admin'
    roleclass = Account
    rolefrontpage_appname = 'account_admin'

    apps = [
        ('account_admin', account_adminui.App)
    ]

    def get_rolequeryset(self):
        queryset = Account.objects.all()
        if not self.request.user.is_superuser:
            queryset = queryset.filter(accountadministrator__user=self.request.user)
        return queryset

    def get_titletext_for_role(self, role):
        return role.name
