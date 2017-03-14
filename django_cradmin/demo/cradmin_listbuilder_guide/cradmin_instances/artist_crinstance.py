from django_cradmin import crinstance
from django_cradmin.demo.cradmin_listbuilder_guide.crapps import artist
from django_cradmin.demo.cradmin_listbuilder_guide.models import Artist


class ArtistCradminInstance(crinstance.BaseCrAdminInstance):
    id = 'artist_crinstance'
    roleclass = Artist
    rolefrontpage_appname = 'dashboard'

    apps = [
        ('dashboard', artist.App)
    ]

    def get_titletext_for_role(self, role):
        return role.name

    def get_rolequeryset(self):
        queryset = Artist.objects.all()
        if not self.request.user.is_superuser:
            queryset = queryset.filter(admins=self.request.user)
        return queryset
