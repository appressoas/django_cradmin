from django_cradmin import crinstance
from django_cradmin.demo.cradmin_gettingstarted.crapps import account_adminui
from django_cradmin.demo.cradmin_gettingstarted.models import Account


class GettingStartedCradminInstance(crinstance.BaseCrAdminInstance):
    id = 'gettingstarted'
    roleclass = Account
    rolefrontpage_appname = 'index'

    apps = [
        ('index', account_adminui.App)
    ]

    def get_rolequeryset(self):
        queryset = Account.objects.all()
        if not self.request.user.is_superuser:
            queryset = queryset.filter(accountadministrator__user=self.request.user)
        return queryset

    def get_titletext_for_role(self, role):
        return role.account_name
