from __future__ import unicode_literals

from django_cradmin import crinstance, crmenu
from django_cradmin.demo.listfilterdemo.models import Site
from django_cradmin.demo.listfilterdemo.views import personlist


class ListfilterDemoCrAdminInstance(crinstance.BaseCrAdminInstance):
    id = 'listfilterdemo'
    roleclass = Site
    rolefrontpage_appname = 'personlist'

    apps = [
        ('personlist', personlist.App),
    ]

    def get_rolequeryset(self):
        queryset = Site.objects.all()
        if not self.request.user.is_superuser:
            queryset = queryset.filter(admins=self.request.user)
        return queryset

    def get_titletext_for_role(self, role):
        return role.name

    def get_menu_item_renderables(self):
        return [
            crmenu.NavLinkItemRenderable(
                label='Personlist', url=self.appindex_url('personlist'),
                is_active=self.request.cradmin_app.appname == 'personlist'),
        ]
