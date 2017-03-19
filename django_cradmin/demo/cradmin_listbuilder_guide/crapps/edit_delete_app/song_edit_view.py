from django_cradmin.demo.cradmin_listbuilder_guide.crapps.edit_delete_app.mixins import SongRolequeryMixin, \
    SongCreateUpdateFormMixin
from django_cradmin.viewhelpers.formview import WithinRoleUpdateView


class SongEditView(SongRolequeryMixin, SongCreateUpdateFormMixin, WithinRoleUpdateView):
    """"""
