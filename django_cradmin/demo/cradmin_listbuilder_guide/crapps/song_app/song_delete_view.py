from django_cradmin import viewhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.song_app.song_mixin import SongQuerysetForRoleMixin


class SongDeleteView(SongQuerysetForRoleMixin, viewhelpers.formview.WithinRoleDeleteView):
    """"""
