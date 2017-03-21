from django_cradmin.demo.cradmin_listbuilder_guide.crapps import mixins
from django_cradmin.demo.cradmin_listbuilder_guide.models import Song
from django_cradmin.viewhelpers import listbuilder

from django_cradmin.viewhelpers import listbuilderview


class TemplateItemValue(listbuilder.base.ItemValueRenderer):
    """"""
    template_name = 'cradmin_listbuilder_guide/template_app/my_great_template.django.html'
    valuealias = 'song'


class TemplateListbuilderView(mixins.SongRolequeryMixin, listbuilderview.View):
    """"""
    model = Song
    value_renderer_class = TemplateItemValue
    template_name = 'cradmin_listbuilder_guide/template_app/my_great_listbuilder.django.html'

