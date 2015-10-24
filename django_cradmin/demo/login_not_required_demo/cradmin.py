from __future__ import unicode_literals

from django.template.defaultfilters import truncatechars
from django.utils.translation import ugettext_lazy as _

from django_cradmin import crinstance, crmenu
from django_cradmin.demo.login_not_required_demo.views import dashboard
from django_cradmin.demo.webdemo.models import Site


class Menu(crmenu.Menu):
    def build_menu(self):
        self.add_menuitem(
            label=_('Dashboard'), url=self.appindex_url('dashboard'),
            active=self.request.cradmin_app.appname == 'dashboard')


class LoginNotRequiredCrAdminInstance(crinstance.BaseCrAdminInstance):
    id = 'login_not_required_demo'
    menuclass = Menu
    roleclass = Site
    rolefrontpage_appname = 'dashboard'

    apps = [
        ('dashboard', dashboard.App),
    ]

    def get_rolequeryset(self):
        """
        We do give access to all sites - further access management should
        be handled in each app/view.
        """
        queryset = Site.objects.all()
        return queryset

    def has_access(self):
        """
        We give any user access to this instance.
        """
        return True

    def get_titletext_for_role(self, role):
        """
        Get a short title briefly describing the given ``role``.
        Remember that the role is a Site.
        """
        return role.name

    def get_descriptiontext_for_role(self, role):
        """
        Get a short description of the given ``role``.
        Remember that the role is a Site.
        """
        return truncatechars(role.description, 100)

    @classmethod
    def matches_urlpath(cls, urlpath):
        """
        We only need this because we have multiple cradmin UIs
        in the same project.
        """
        return urlpath.startswith('/login_not_required_demo')
