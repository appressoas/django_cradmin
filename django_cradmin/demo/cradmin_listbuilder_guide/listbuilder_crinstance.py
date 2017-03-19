from django_cradmin import crinstance
from django_cradmin.demo.cradmin_listbuilder_guide.crapps import edit_delete_app
from django_cradmin.demo.cradmin_listbuilder_guide.models import Album


class ListbuilderCradminInstance(crinstance.BaseCrAdminInstance):
    """"""
    id = 'listbuilder_crinstance'
    roleclass = Album
    rolefrontpage_appname = 'songs'
    apps = [
        ('songs', edit_delete_app.App)
    ]

    def get_titletext_for_role(self, role):
        pass

    def get_rolequeryset(self):
        queryset = Album.objects.all()
        if not self.request.user.is_superuser:
            queryset = queryset.filter(albumadministrator__user=self.request.user)
        return queryset
