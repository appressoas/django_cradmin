from __future__ import unicode_literals

from django_cradmin import crinstance, crmenu
from django_cradmin.demo.multiselect2demo.views import productlist


class Menu(crmenu.Menu):
    def build_menu(self):
        self.add_menuitem(
            label='Productlist', url=self.appindex_url('productlist'),
            active=self.request.cradmin_app.appname == 'productlist')


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
