from __future__ import unicode_literals
from django.template.defaultfilters import truncatechars
from django.utils.translation import ugettext_lazy as _
from django_cradmin import crinstance, crmenu

from django_cradmin.demo.webdemo.models import Site
from django_cradmin.demo.webdemo.cradmin_apps import pages
from django_cradmin.demo.webdemo.cradmin_apps import dashboard
from django_cradmin.demo.webdemo.cradmin_apps import inviteadmins
from django_cradmin.demo.webdemo.cradmin_apps import sharable_link


class WebdemoCrAdminInstance(crinstance.BaseCrAdminInstance):
    id = 'webdemo'
    roleclass = Site
    rolefrontpage_appname = 'dashboard'

    apps = [
        ('dashboard', dashboard.App),
        ('pages', pages.App),
        ('inviteadmins', inviteadmins.App),
        ('sharable_link', sharable_link.App),
    ]

    def get_rolequeryset(self):
        queryset = Site.objects.all()
        if not self.request.user.is_superuser:
            queryset = queryset.filter(admins=self.request.user)
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

    @classmethod
    def matches_urlpath(cls, urlpath):
        """
        We only need this because we have multiple cradmin UIs
        in the same project.
        """
        return urlpath.startswith('/webdemo')

    def get_menu_item_renderables(self):
        return [
            crmenu.LinkItemRenderable(
                label=_('Dashboard'), url=self.appindex_url('dashboard'),
                is_active=self.request.cradmin_app.appname == 'dashboard'),
            crmenu.LinkItemRenderable(
                label=_('Pages'), url=self.appindex_url('pages'),
                is_active=self.request.cradmin_app.appname == 'pages'),
            crmenu.LinkItemRenderable(
                label=_('Invite admins'), url=self.appindex_url('inviteadmins'),
                is_active=self.request.cradmin_app.appname == 'inviteadmins'),
            crmenu.LinkItemRenderable(
                label=_('Share'), url=self.appindex_url('sharable_link'),
                is_active=self.request.cradmin_app.appname == 'sharable_link'),
        ]
