from __future__ import unicode_literals

from django.utils.translation import ugettext_lazy as _

from django_cradmin import crinstance, crmenu
from django_cradmin.demo.no_role_demo.views import dashboard


class NoRoleCrAdminInstance(crinstance.NoRoleMixin, crinstance.BaseCrAdminInstance):
    id = 'no_role_demo'
    rolefrontpage_appname = 'dashboard'

    apps = [
        ('dashboard', dashboard.App),
    ]

    def has_access(self):
        return True

    @classmethod
    def matches_urlpath(cls, urlpath):
        """
        We only need this because we have multiple cradmin UIs
        in the same project.
        """
        return urlpath.startswith('/no_role_demo')

    def get_menu_item_renderables(self):
        return [
            crmenu.LinkItemRenderable(
                label=_('Dashboard'), url=self.appindex_url('dashboard'),
                is_active=self.request.cradmin_app.appname == 'dashboard'),
        ]
