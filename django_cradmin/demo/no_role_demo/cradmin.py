from __future__ import unicode_literals

from django.utils.translation import ugettext_lazy as _

from django_cradmin import crinstance, crmenu
from django_cradmin.demo.no_role_demo.views import dashboard


class Menu(crmenu.Menu):
    def build_menu(self):
        self.add_menuitem(
            label=_('Dashboard'), url=self.appindex_url('dashboard'),
            active=self.request.cradmin_app.appname == 'dashboard')


class NoRoleCrAdminInstance(crinstance.BaseCrAdminInstance):
    id = 'no_role_demo'
    menuclass = Menu
    rolefrontpage_appname = 'dashboard'
    flatten_rolefrontpage_url = True

    apps = [
        ('dashboard', dashboard.App),
    ]

    def has_access(self):
        """
        We give any user access to this instance, including unauthenticated users.
        """
        return True

    @classmethod
    def matches_urlpath(cls, urlpath):
        """
        We only need this because we have multiple cradmin UIs
        in the same project.
        """
        return urlpath.startswith('/no_role_demo')
