from django_cradmin import viewhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.album_app.album_mixins import AlbumQuerysetForRoleMixin


class AlbumDeleteView(AlbumQuerysetForRoleMixin, viewhelpers.formview.WithinRoleDeleteView):
    """"""
