from django_cradmin import viewhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.album_app.album_mixins import AlbumCreateUpdateMixin


class AlbumCreateView(AlbumCreateUpdateMixin, viewhelpers.formview.WithinRoleCreateView):

    def save_object(self, form, commit=True):
        new_album = super(AlbumCreateView, self).save_object(form, commit)
        new_album.artist = self.request.cradmin_role
        new_album.full_clean()
        new_album.save()
        return new_album
