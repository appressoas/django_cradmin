from django_cradmin import crinstance
from django_cradmin.demo.cradmin_listbuilder_guide.crapps import album_app
from django_cradmin.demo.cradmin_listbuilder_guide.crapps import artist_app
from django_cradmin.demo.cradmin_listbuilder_guide.crapps import song_app
from django_cradmin.demo.cradmin_listbuilder_guide.models import Artist


class ArtistCradminInstance(crinstance.BaseCrAdminInstance):
    id = 'artist_crinstance'
    roleclass = Artist
    rolefrontpage_appname = 'dashboard'

    apps = [
        ('dashboard', artist_app.App),
        ('albums', album_app.App),
        ('songs', song_app.App)
    ]

    def get_titletext_for_role(self, role):
        return role.name

    def get_rolequeryset(self):
        queryset = Artist.objects.all()
        if not self.request.user.is_superuser:
            queryset = queryset.filter(admins=self.request.user)
        return queryset
