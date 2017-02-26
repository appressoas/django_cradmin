from django_cradmin import crinstance
from django_cradmin import crmenu
from django_cradmin.demo.cradmin_gettingstarted.crapps import create_account
from django.utils.translation import ugettext_lazy

class CreateAccountCrAdminInstance(crinstance.NoRoleMixin, crinstance.BaseCrAdminInstance):
    """
    Cradmin instance for creating new accounts.
    Does not require a role, but gives access to a authenticated user.
    """

    id = 'create_account'
    rolefrontpage_appname = 'dashboard'

    apps = [
        ('dashboard', create_account.App)
    ]

    def has_access(self):
        if self.request.user.is_authenticated:
            return True
