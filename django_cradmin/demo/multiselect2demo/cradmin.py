from __future__ import unicode_literals

from django_cradmin import crinstance, crmenu, crapp
from django_cradmin.demo.multiselect2demo.views import productlist


class MultiselectDemoCrAdminInstance(crinstance.NoRoleNoLoginCrAdminInstance):
    id = 'multiselect2demo'
    rolefrontpage_appname = 'productlist'

    apps = [
        ('productlist', productlist.App),
    ]

    @classmethod
    def matches_urlpath(cls, urlpath):
        """
        We only need this because we have multiple cradmin UIs
        in the demo project.
        """
        return urlpath.startswith('/multiselect2demo')

    def get_menu_item_renderables(self):
        cradmin_app = self.request.cradmin_app
        return [
            crmenu.LinkItemRenderable(
                label='Simple', url=self.appindex_url('productlist'),
                is_active=(cradmin_app.appname == 'productlist' and
                           cradmin_app.active_viewname == crapp.INDEXVIEW_NAME)),
            crmenu.LinkItemRenderable(
                label='With filters',
                url=self.reverse_url(appname='productlist',
                                     viewname='withfilters'),
                is_active=(cradmin_app.appname == 'productlist' and
                           cradmin_app.active_viewname == 'withfilters')),
            crmenu.LinkItemRenderable(
                label='Select on load',
                url=self.reverse_url(appname='productlist',
                                     viewname='select-on-load'),
                is_active=(cradmin_app.appname == 'productlist' and
                           cradmin_app.active_viewname == 'select-on-load')),
            crmenu.LinkItemRenderable(
                label='Extra form data',
                url=self.reverse_url(appname='productlist',
                                     viewname='extra-form-data'),
                is_active=(cradmin_app.appname == 'productlist' and
                           cradmin_app.active_viewname == 'extra-form-data')),
        ]
