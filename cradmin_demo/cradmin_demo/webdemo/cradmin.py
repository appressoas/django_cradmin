from django.utils.translation import ugettext_lazy as _
from django_cradmin import crinstance, crmenu

from .models import Site
from .views import dashboard
from .views import pages


class Menu(crmenu.Menu):
    def build_menu(self):
        self.add(label=_('Dashboard'), url=self.appindex_url('dashboard'),
            icon="home")
        self.add(label=_('Pages'), url=self.appindex_url('pages'),
            icon="database")
        

class CrAdminInstance(crinstance.BaseCrAdminInstance):
    id = 'webdemo'
    menuclass = Menu
    roleclass = Site
    rolefrontpage_appname = 'dashboard'

    apps = [
        ('dashboard', dashboard.App),
        ('pages', pages.App)
    ]

    def get_rolequeryset(self):
        queryset = Site.objects.all()
        if not self.request.user.is_superuser:
            queryset = queryset.filter(admins=self.requestuser)
        return queryset

    def get_titletext_for_role(self, role):
        """
        Get a short title briefly describing the given ``role``.
        Remember that the role is a Site.
        """
        return role.name
