from django.http import Http404

from django_cradmin import crinstance
from django_cradmin.demo.cradmin_gettingstarted.crapps import create_account


class CreateAccountCrAdminInstance(crinstance.NoRoleMixin, crinstance.BaseCrAdminInstance):
    id = 'create_account'
    rolefrontpage_appname = 'dashboard'

    apps = [
        ('dashboard', create_account.App),
    ]

    def has_access(self):
        if self.request.user.is_authenticated:
            return True
        else:
            raise Http404(Exception)
