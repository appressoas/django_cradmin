from django_cradmin.demo.cradmin_listbuilder_guide.crapps.edit_delete_app.mixins import SongRolequeryMixin
from django_cradmin.demo.cradmin_listbuilder_guide.models import Song
from django_cradmin.viewhelpers import listbuilder
from django_cradmin.viewhelpers import listbuilderview


class SongItemValue(listbuilder.itemvalue.EditDelete):
    """Sets item value for view"""
    valuealias = 'song'

    def get_description(self):
        return 'Written by {}'.format(self.song.written_by)


class SongListbuilderView(SongRolequeryMixin, listbuilderview.ViewCreateButtonMixin, listbuilderview.View):
    """Build the list view with item"""
    model = Song
    value_renderer_class = SongItemValue
