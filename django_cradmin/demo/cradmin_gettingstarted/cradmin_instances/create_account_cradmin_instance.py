from __future__ import unicode_literals

from django.http import Http404

from django_cradmin import crinstance
from django_cradmin.demo.cradmin_gettingstarted.crapps import create_account


class NoRoleCrAdminInstance(crinstance.NoRoleMixin, crinstance.BaseCrAdminInstance):
    id = 'no_role'
    rolefrontpage_appname = 'dashboard'

    apps = [
        ('dashboard', create_account.App),
    ]

    def has_access(self):
        if self.request.user.is_authenticated:
            return True
        else:
            raise Http404(Exception)

    def get_rolequeryset(self):
        pass
