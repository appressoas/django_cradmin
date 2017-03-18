from django_cradmin import viewhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.album_app.album_mixins import AlbumCreateUpdateMixin, \
    AlbumQuerysetForRoleMixin
from django_cradmin.demo.cradmin_listbuilder_guide.models import Album


class AlbumEditView(AlbumQuerysetForRoleMixin, AlbumCreateUpdateMixin, viewhelpers.formview.WithinRoleUpdateView):
    """View for editing existing albums"""
