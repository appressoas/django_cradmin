from __future__ import unicode_literals

from django_cradmin import crinstance, crmenu
from django_cradmin.demo.uicontainerdemo.views import simple_uiforms


class Menu(crmenu.Menu):
    def build_menu(self):
        self.add_menuitem(
            label='Simple uiforms', url=self.appindex_url('simple_uiforms'),
            active=self.request.cradmin_app.appname == 'simple_uiforms')


class UIContainerDemoCrAdminInstance(crinstance.BaseCrAdminInstance):
    id = 'uicontainerdemo'
    menuclass = Menu
    rolefrontpage_appname = 'simple_uiforms'
    flatten_rolefrontpage_url = True

    apps = [
        ('simple_uiforms', simple_uiforms.App),
    ]

    def has_access(self):
        return True

    def get_titletext_for_role(self, role):
        return role.name

    @classmethod
    def matches_urlpath(cls, urlpath):
        return urlpath.startswith('/uicontainerdemo')
