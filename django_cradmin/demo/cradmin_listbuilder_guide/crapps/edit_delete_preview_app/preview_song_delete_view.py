from django_cradmin.demo.cradmin_listbuilder_guide.crapps.edit_delete_preview_app.preview_mixins import \
    EditDeletePreviewRolequeryMixin
from django_cradmin.viewhelpers.formview import WithinRoleDeleteView


class EditDeletePreviewSongDeleteView(EditDeletePreviewRolequeryMixin, WithinRoleDeleteView):
    """"""