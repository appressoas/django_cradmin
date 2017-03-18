from django_cradmin.demo.cradmin_listbuilder_guide.crapps.song_app.mixins import SongRolequeryMixin
from django_cradmin.demo.cradmin_listbuilder_guide.models import Song
from django_cradmin.viewhelpers import listbuilder
from django_cradmin.viewhelpers import listbuilderview


class SongItemValue(listbuilder.itemvalue.EditDelete):
    """"""
    valuealias = 'song'

    def get_description(self):
        return 'Written by {}'.format(self.song.written_by)


class SongListbuilderView(SongRolequeryMixin, listbuilderview.ViewCreateButtonMixin, listbuilderview.View):
    """"""
    model = Song
    value_renderer_class = SongItemValue
