from django.utils.translation import ugettext_lazy

from django_cradmin import crinstance
from django_cradmin import crmenu
from django_cradmin.demo.cradmin_listbuilder_guide.crapps import edit_delete_app
from django_cradmin.demo.cradmin_listbuilder_guide.crapps import edit_delete_preview_app
from django_cradmin.demo.cradmin_listbuilder_guide.crapps import focus_box_app
from django_cradmin.demo.cradmin_listbuilder_guide.models import Album


class ListbuilderCradminInstance(crinstance.BaseCrAdminInstance):
    """"""
    id = 'listbuilder_crinstance'
    roleclass = Album
    rolefrontpage_appname = 'songs'
    apps = [
        ('songs', edit_delete_app.App),
        ('preview', edit_delete_preview_app.App),
        ('focus_box', focus_box_app.App)
    ]

    def get_titletext_for_role(self, role):
        pass

    def get_rolequeryset(self):
        queryset = Album.objects.all()
        if not self.request.user.is_superuser:
            queryset = queryset.filter(albumadministrator__user=self.request.user)
        return queryset

    def get_expandable_menu_item_renderables(self):
        return [
            crmenu.ExpandableMenuItem(
                label=ugettext_lazy('Edit Delete Demo'),
                url=self.appindex_url('songs'),
                is_active=self.request.cradmin_app.appname == 'songs'
            ),
            crmenu.ExpandableMenuItem(
                label=ugettext_lazy('Edit Delete Preview Demo'),
                url=self.appindex_url('preview'),
                is_active=self.request.cradmin_app.appname == 'preview'
            ),
            crmenu.ExpandableMenuItem(
                label=ugettext_lazy('Focus Box Demo'),
                url=self.appindex_url('focus_box'),
                is_active=self.request.cradmin_app.appname == 'focus_box'
            )
        ]
