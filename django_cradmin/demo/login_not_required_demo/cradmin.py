from __future__ import unicode_literals

from django.template.defaultfilters import truncatechars
from django.utils.translation import ugettext_lazy as _

from django_cradmin import crinstance, crmenu
from django_cradmin.demo.login_not_required_demo.views import dashboard
from django_cradmin.demo.webdemo.models import Site


class LoginNotRequiredCrAdminInstance(crinstance.NoLoginMixin, crinstance.BaseCrAdminInstance):
    id = 'login_not_required_demo'
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

    def get_menu_item_renderables(self):
        return [
            crmenu.NavLinkItemRenderable(
                label=_('Dashboard'), url=self.appindex_url('dashboard'),
                is_active=self.request.cradmin_app.appname == 'dashboard'),
        ]
