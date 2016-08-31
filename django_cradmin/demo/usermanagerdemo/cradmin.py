from __future__ import unicode_literals

from builtins import str

from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _

from django_cradmin import crinstance, crmenu
from .crapps import edit_user
from .crapps import overview


class UsermanagerCrAdminInstance(crinstance.BaseCrAdminInstance):
    id = 'usermanager'
    roleclass = User
    rolefrontpage_appname = 'overview'

    apps = [
        ('overview', overview.App),
        ('edit_user', edit_user.App),
    ]

    def get_rolequeryset(self):
        queryset = User.objects.all()
        if not self.request.user.is_superuser:
            queryset = queryset.filter(id=self.request.user.id)\
                .order_by('username')
        return queryset

    def get_titletext_for_role(self, role):
        """
        Get a short title briefly describing the given ``role``.
        Remember that the role is a User.
        """
        return str(role)

    @classmethod
    def matches_urlpath(cls, urlpath):
        """
        We only need this because we have multiple cradmin UIs
        in the same project.
        """
        return urlpath.startswith('/usermanagerdemo')

    def get_menu_item_renderables(self):
        menuitems = []
        if self.request.cradmin_instance.get_rolequeryset().count() > 1:
            menuitems.append(crmenu.LinkItemRenderable(
                label=_('Select user'),
                url=self.roleselectview_url()))
        menuitems.extend([
            crmenu.LinkItemRenderable(
                label=_('Account overview'), url=self.appindex_url('overview'),
                is_active=self.request.cradmin_app.appname == 'overview'),
            crmenu.LinkItemRenderable(
                label=_('Edit profile'), url=self.appindex_url('edit_user'),
                is_active=self.request.cradmin_app.appname == 'edit_user'),
        ])
        return menuitems
