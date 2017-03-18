from django_cradmin import viewhelpers
from django_cradmin.crinstance import reverse_cradmin_url
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.artist_app.artist_mixin import ArtistCreateEditMixin


class ArtistCreateView(ArtistCreateEditMixin, viewhelpers.formview.WithinRoleCreateView):

    def save_object(self, form, commit=True):
        self.artist = super(ArtistCreateView, self).save_object(form, commit)
        self.artist.admins.add(self.request.user)
        self.artist.full_clean()
        self.artist.save()
        return self.artist

    def get_success_url(self):
        """Take the user to the index for artist_app when success"""
        return reverse_cradmin_url(
            instanceid='artist_crinstance',
            appname='dashboard',
            roleid=self.artist.id
        )
