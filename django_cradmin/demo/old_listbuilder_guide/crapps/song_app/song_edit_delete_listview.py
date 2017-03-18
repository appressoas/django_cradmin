from django_cradmin.demo.cradmin_listbuilder_guide.crapps.song_app.song_mixin import SongQuerysetForRoleMixin
from django_cradmin.demo.cradmin_listbuilder_guide.models import Song
from django_cradmin.viewhelpers import listbuilder
from django_cradmin.viewhelpers import listbuilderview


class SongListItemValue(listbuilder.itemvalue.EditDelete):
    template_name = 'cradmin_listbuilder_guide/crapps/song_app/song_edit_delete_listview.django.html'
    valuealias = 'song'

    def get_description(self):
        return self.song.title


class SongListBuilderView(SongQuerysetForRoleMixin,
                          listbuilderview.ViewCreateButtonMixin,
                          listbuilderview.View):
    model = Song
    value_render_class = SongListItemValue
