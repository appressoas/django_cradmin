from __future__ import unicode_literals

from django_cradmin import crinstance, crmenu
from django_cradmin.demo.uicontainerdemo.views import simple_uiforms


class UIContainerDemoCrAdminInstance(crinstance.NoRoleNoLoginCrAdminInstance):
    id = 'uicontainerdemo'
    rolefrontpage_appname = 'simple_uiforms'
    flatten_rolefrontpage_url = True

    apps = [
        ('simple_uiforms', simple_uiforms.App),
    ]

    def get_menu_item_renderables(self):
        return [
            crmenu.NavLinkItemRenderable(
                label='Simple uiforms', url=self.appindex_url('simple_uiforms'),
                is_active=self.request.cradmin_app.appname == 'simple_uiforms'),
        ]
