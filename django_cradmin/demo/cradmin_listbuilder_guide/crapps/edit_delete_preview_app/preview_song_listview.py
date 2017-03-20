from django_cradmin.demo.cradmin_listbuilder_guide.crapps.edit_delete_preview_app.preview_mixins import \
    EditDeletePreviewRolequeryMixin
from django_cradmin.demo.cradmin_listbuilder_guide.models import Song
from django_cradmin.viewhelpers import listbuilder
from django_cradmin.viewhelpers import listbuilderview


class PreviewSongItemValue(listbuilder.itemvalue.EditDeleteWithPreview):
    """"""
    valuealias = 'song'

    def get_description(self):
        return 'Written by {}'.format(self.song.written_by)


class PreviewSongListbuilderView(EditDeletePreviewRolequeryMixin,
                                 listbuilderview.ViewCreateButtonMixin,
                                 listbuilderview.View):
    """"""
    model = Song
    value_renderer_class = PreviewSongItemValue
