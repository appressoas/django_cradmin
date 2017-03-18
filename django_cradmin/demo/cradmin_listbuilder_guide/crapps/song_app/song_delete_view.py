from django_cradmin.demo.cradmin_listbuilder_guide.crapps.song_app.mixins import SongRolequeryMixin
from django_cradmin.viewhelpers.formview import WithinRoleDeleteView


class SongDeleteView(SongRolequeryMixin, WithinRoleDeleteView):
    """"""