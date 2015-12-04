from __future__ import unicode_literals
from django.template.defaultfilters import truncatechars
from django.utils.translation import ugettext_lazy as _
from django_cradmin import crinstance, crmenu
from django_cradmin.apps.cradmin_imagearchive import cradminviews as imagearchive

from django_cradmin.demo.webdemo.models import Site
from django_cradmin.demo.webdemo.views import pages_listbuilder
from django_cradmin.demo.webdemo.views import dashboard
from django_cradmin.demo.webdemo.views import pages
from django_cradmin.demo.webdemo.views import inviteadmins
from django_cradmin.demo.webdemo.views import sharable_link


class Menu(crmenu.Menu):
    def build_menu(self):
        self.add_headeritem(
            label=_('Select role'), url=self.cradmin_instance.roleselectview_url())
        self.add_menuitem(
            label=_('Dashboard'), url=self.appindex_url('dashboard'),
            active=self.request.cradmin_app.appname == 'dashboard')
        self.add_menuitem(
            label=_('Pages'), url=self.appindex_url('pages'),
            active=self.request.cradmin_app.appname == 'pages')
        self.add_menuitem(
            label=_('Pages (listbuilder)'), url=self.appindex_url('pages_listbuilder'),
            active=self.request.cradmin_app.appname == 'pages_listbuilder')
        self.add_menuitem(
            label=_('Images'), url=self.appindex_url('imagearchive'),
            active=self.request.cradmin_app.appname == 'imagearchive')

        self.add_footeritem(
            label=_('Invite admins'), url=self.appindex_url('inviteadmins'),
            active=self.request.cradmin_app.appname == 'inviteadmins')
        self.add_footeritem(
            label=_('Share'), url=self.appindex_url('sharable_link'),
            active=self.request.cradmin_app.appname == 'sharable_link')


class WebdemoCrAdminInstance(crinstance.BaseCrAdminInstance):
    id = 'webdemo'
    menuclass = Menu
    roleclass = Site
    rolefrontpage_appname = 'dashboard'

    apps = [
        ('dashboard', dashboard.App),
        ('pages', pages.App),
        ('pages_listbuilder', pages_listbuilder.App),
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
