from django_cradmin.demo.webdemo.models import Page
from django_cradmin.viewhelpers import listbuilder
from django_cradmin.viewhelpers import listbuilderview

from . import mixins


class PageListItemValue(listbuilder.itemvalue.EditDeleteWithArchiveImage):
    template_name = 'webdemo/pages/pagelist-itemvalue.django.html'
    valuealias = 'page'

    def get_archiveimage(self):
        return self.page.image

    def get_description(self):
        return self.page.intro


class PagesListBuilderView(mixins.PagesQuerySetForRoleMixin,
                           listbuilderview.ViewCreateButtonMixin,
                           listbuilderview.View):
    """
    Shows how to use listbuilderview with listfilter.
    """
    model = Page
    value_renderer_class = PageListItemValue

    def get_unfiltered_queryset_for_role(self):
        return mixins.PagesQuerySetForRoleMixin\
            .get_queryset_for_role(self)\
            .prefetch_related('tags')
