from django_cradmin.demo.cradmin_listbuilder_guide.crapps.edit_delete_app.mixins import SongRolequeryMixin
from django_cradmin.viewhelpers.formview import WithinRoleDeleteView


class SongDeleteView(SongRolequeryMixin, WithinRoleDeleteView):
    """"""
