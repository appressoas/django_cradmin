from django_cradmin.demo.cradmin_listbuilder_guide.crapps import mixins
from django_cradmin.demo.cradmin_listbuilder_guide.models import Song, Album
from django_cradmin.viewhelpers import listbuilder

from django_cradmin.viewhelpers import listbuilderview


class TemplateItemValue(listbuilder.base.ItemValueRenderer):
    """"""
    template_name = 'cradmin_listbuilder_guide/template_app/my_great_item_value.django.html'
    valuealias = 'song'

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
    template_name = 'cradmin_listbuilder_guide/template_app/my_great_listbuilderview.django.html'

    def __get_album(self):
        queryset = Album.objects.filter(id=self.request.cradmin_role.id).get()
        return queryset

    def get_context_data(self, **kwargs):
        context = super(TemplateListbuilderView, self).get_context_data(**kwargs)
        context['album'] = self.__get_album()
        return context
