from django_cradmin.demo.cradmin_listbuilder_guide.crapps.song_app.mixins import SongCreateUpdateRolequeryMixin, \
    SongCreateUpdateFormMixin
from django_cradmin.viewhelpers.formview import WithinRoleUpdateView


class SongEditView(SongCreateUpdateRolequeryMixin, SongCreateUpdateFormMixin, WithinRoleUpdateView):
    """"""
