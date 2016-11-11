from __future__ import unicode_literals

from django_cradmin import crinstance, crmenu, crapp
from django_cradmin.demo.multiselect2demo.views import productlist


class MultiselectDemoCrAdminInstance(crinstance.NoRoleNoLoginCrAdminInstance):
    id = 'multiselect2demo'
    rolefrontpage_appname = 'productlist'

    apps = [
        ('productlist', productlist.App),
    ]

    def get_menu_item_renderables(self):
        cradmin_app = self.request.cradmin_app
        return [
            crmenu.NavLinkItemRenderable(
                label='Simple', url=self.appindex_url('productlist'),
                is_active=(cradmin_app.appname == 'productlist' and
                           cradmin_app.active_viewname == crapp.INDEXVIEW_NAME)),
            crmenu.NavLinkItemRenderable(
                label='With filters',
                url=self.reverse_url(appname='productlist',
                                     viewname='withfilters'),
                is_active=(cradmin_app.appname == 'productlist' and
                           cradmin_app.active_viewname == 'withfilters')),
            crmenu.NavLinkItemRenderable(
                label='Select on load',
                url=self.reverse_url(appname='productlist',
                                     viewname='select-on-load'),
                is_active=(cradmin_app.appname == 'productlist' and
                           cradmin_app.active_viewname == 'select-on-load')),
            crmenu.NavLinkItemRenderable(
                label='Extra form data',
                url=self.reverse_url(appname='productlist',
                                     viewname='extra-form-data'),
                is_active=(cradmin_app.appname == 'productlist' and
                           cradmin_app.active_viewname == 'extra-form-data')),
        ]
