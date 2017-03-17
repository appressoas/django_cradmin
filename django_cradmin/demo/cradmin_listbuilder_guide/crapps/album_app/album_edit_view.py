from django_cradmin import viewhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.album_app.album_mixins import AlbumCreateUpdateMixin, \
    AlbumQuerysetForRoleMixin
from django_cradmin.demo.cradmin_listbuilder_guide.models import Album


class AlbumEditView(AlbumQuerysetForRoleMixin, AlbumCreateUpdateMixin, viewhelpers.formview.WithinRoleUpdateView):
    """View for editing existing albums"""

    def get_queryset_for_role(self):
        return Album.objects.filter(artist=self.request.cradmin_role)