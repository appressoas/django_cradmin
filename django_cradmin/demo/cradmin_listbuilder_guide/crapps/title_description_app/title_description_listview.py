from django_cradmin.demo.cradmin_listbuilder_guide.crapps import mixins
from django_cradmin.demo.cradmin_listbuilder_guide.models import Song
from django_cradmin.viewhelpers import listbuilder
from django_cradmin.viewhelpers import listbuilderview


class TitleDescriptionItemValue(listbuilder.itemvalue.TitleDescription):
    """"""
    valuealias = 'song'

    def get_description(self):
        return 'This song is written by {}'.format(self.song.written_by)


class TitleDescriptionListbuilderView(mixins.SongRolequeryMixin, listbuilderview.View):
    """"""
    model = Song
    value_renderer_class = TitleDescriptionItemValue
