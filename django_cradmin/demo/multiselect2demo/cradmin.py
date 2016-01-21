from __future__ import unicode_literals

from django_cradmin import crinstance, crmenu, crapp
from django_cradmin.demo.multiselect2demo.views import productlist


class Menu(crmenu.Menu):
    def build_menu(self):
        cradmin_app = self.request.cradmin_app
        self.add_menuitem(
            label='Simple', url=self.appindex_url('productlist'),
            active=(cradmin_app.appname == 'productlist' and
                    cradmin_app.active_viewname == crapp.INDEXVIEW_NAME))
        self.add_menuitem(
            label='With filters',
            url=self.cradmin_instance.reverse_url(appname='productlist',
                                                  viewname='withfilters'),
            active=(cradmin_app.appname == 'productlist' and
                    cradmin_app.active_viewname == 'withfilters'))
        self.add_menuitem(
            label='Select on load',
            url=self.cradmin_instance.reverse_url(appname='productlist',
                                                  viewname='select-on-load'),
            active=(cradmin_app.appname == 'productlist' and
                    cradmin_app.active_viewname == 'select-on-load'))


class MultiselectDemoCrAdminInstance(crinstance.BaseCrAdminInstance):
    id = 'multiselect2demo'
    menuclass = Menu
    rolefrontpage_appname = 'productlist'
    flatten_rolefrontpage_url = True

    apps = [
        ('productlist', productlist.App),
    ]

    def has_access(self):
        """
        We give any user access to this instance, including unauthenticated users.
        """
        return True

    @classmethod
    def matches_urlpath(cls, urlpath):
        """
        We only need this because we have multiple cradmin UIs
        in the demo project.
        """
        return urlpath.startswith('/multiselect2demo')
