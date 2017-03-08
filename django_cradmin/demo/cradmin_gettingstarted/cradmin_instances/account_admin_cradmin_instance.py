from django.utils.translation import ugettext_lazy

from django_cradmin import crinstance
from django_cradmin import crmenu
from django_cradmin.demo.cradmin_gettingstarted.crapps import account_adminui
from django_cradmin.demo.cradmin_gettingstarted.crapps import create_account
from django_cradmin.demo.cradmin_gettingstarted.crapps import messages
from django_cradmin.demo.cradmin_gettingstarted.crapps import publicui
from django_cradmin.demo.cradmin_gettingstarted.models import Account


class AccountAdminCradminInstance(crinstance.BaseCrAdminInstance):
    """
    Cradmin instance for the account administrator ui.
    The rolequeryset returns all the accounts conncted to a user which is an AccountAdministrator.
    """

    id = 'account_instance'
    roleclass = Account
    rolefrontpage_appname = 'account_admin'

    apps = [
        ('account_admin', account_adminui.App),
        ('new_account', create_account.App),
        ('public_messages', publicui.App),
        ('messages', messages.App)
    ]

    def get_rolequeryset(self):
        queryset = Account.objects.all()
        if not self.request.user.is_superuser:
            queryset = queryset.filter(accountadministrator__user=self.request.user)
        return queryset

    def get_titletext_for_role(self, role):
        return role.name

    def get_expandable_menu_item_renderables(self):
        return [
            crmenu.ExpandableMenuItem(
                label=ugettext_lazy('Dashboard'),
                url=self.appindex_url('account_admin'),
                is_active=self.request.cradmin_app.appname == 'account_admin'),
            crmenu.ExpandableMenuItem(
                label=ugettext_lazy('New Account'),
                url=self.request.cradmin_instance.reverse_url(appname='new_account', viewname='create_account'),
                is_active=self.request.cradmin_app.appname == 'new_account'),
            crmenu.ExpandableMenuItem(
                label=ugettext_lazy('Public Messages'),
                url=self.appindex_url('public_messages'),
                is_active=self.request.cradmin_app.appname == 'public_messages')
        ]
