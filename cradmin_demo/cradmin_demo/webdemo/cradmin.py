from __future__ import unicode_literals
from django.template.defaultfilters import truncatechars
from django.utils.translation import ugettext_lazy as _
from django_cradmin import crinstance, crmenu
from django_cradmin.apps.cradmin_imagearchive import cradminviews as imagearchive

from .models import Site
from .crapps import dashboard
from .crapps import pages
from .crapps import inviteadmins
from .crapps import sharable_link


class Menu(crmenu.Menu):
    def build_menu(self):
        self.add(
            label=_('Dashboard'), url=self.appindex_url('dashboard'), icon="home",
            active=self.request.cradmin_app.appname == 'dashboard')
        self.add(
            label=_('Pages'), url=self.appindex_url('pages'), icon="database",
            active=self.request.cradmin_app.appname == 'pages')
        self.add(
            label=_('Images'), url=self.appindex_url('imagearchive'), icon="image",
            active=self.request.cradmin_app.appname == 'imagearchive')

        self.add_footeritem(
            label=_('Invite admins'), url=self.appindex_url('inviteadmins'), icon="users",
            active=self.request.cradmin_app.appname == 'inviteadmins')
        self.add_footeritem(
            label=_('Share'), url=self.appindex_url('sharable_link'), icon="link",
            active=self.request.cradmin_app.appname == 'sharable_link')


class WebdemoCrAdminInstance(crinstance.BaseCrAdminInstance):
    id = 'webdemo'
    menuclass = Menu
    roleclass = Site
    rolefrontpage_appname = 'dashboard'

    apps = [
        ('dashboard', dashboard.App),
        ('pages', pages.App),
        ('imagearchive', imagearchive.App),
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