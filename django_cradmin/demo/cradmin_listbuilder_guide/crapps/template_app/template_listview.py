from django_cradmin.demo.cradmin_listbuilder_guide.crapps import mixins
from django_cradmin.demo.cradmin_listbuilder_guide.models import Song
from django_cradmin.viewhelpers import listbuilder

from django_cradmin.viewhelpers import listbuilderview


class TemplateItemValue(listbuilder.base.ItemValueRenderer):
    """"""
    template_name = 'cradmin_listbuilder_guide/template_app/my_great_item_value.django.html'
    valuealias = 'song'

    # def get_extra_info(self):
    #     extra_info = []
    #     written_by = self.song.written_by
    #     on_album = self.song.album
    #     extra_info.append(written_by)
    #     extra_info.append(on_album)
    #     return extra_info

    def get_extra_info(self):
        song_info = {
            'written_by': self.song.written_by,
            'on_album': self.song.album
        }
        return song_info


class TemplateListbuilderView(mixins.SongRolequeryMixin, listbuilderview.View):
    """"""
    model = Song
    value_renderer_class = TemplateItemValue
    template_name = 'cradmin_listbuilder_guide/template_app/my_great_listbuilder.django.html'

