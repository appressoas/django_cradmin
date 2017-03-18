from django_cradmin import viewhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.song_app.song_mixin import SongQuerysetForRoleMixin, \
    SongCreateEditMixin


class SongEditView(SongQuerysetForRoleMixin, SongCreateEditMixin, viewhelpers.formview.WithinRoleUpdateView):
    """"""