from django_cradmin.demo.cradmin_listbuilder_guide.crapps import mixins
from django_cradmin.demo.cradmin_listbuilder_guide.models import Song
from django_cradmin.viewhelpers import listbuilder
from django_cradmin.viewhelpers import listbuilderview


class FocusBoxSongItemValue(listbuilder.itemvalue.FocusBox):
    """"""


class FocusBoxSongListbuilderView(mixins.SongRolequeryMixin, listbuilderview.View):
    """"""
    model = Song
    value_renderer_class = FocusBoxSongItemValue
