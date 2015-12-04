from __future__ import unicode_literals
from django_cradmin.demo.webdemo.views.pages_listbuilder import PagesListBuilderView

from django_cradmin.viewhelpers import listfilter
from django_cradmin.viewhelpers import listbuilderview
from django_cradmin import crapp


class PagesListFilterView(listbuilderview.FilterListMixin, PagesListBuilderView):
    # def get_filterlist_position(self):
    #     return 'left'
    #     return 'top'

    def get_filterlist_url(self, filters_string):
        return self.request.cradmin_app.reverse_appurl(
            'filter', kwargs={'filters_string': filters_string})

    def build_filterlist(self):
        filterlist = listfilter.lists.Vertical(urlbuilder=self.filterlist_urlbuilder)
        # filterlist = listfilter.lists.Horizontal(urlbuilder=self.filterlist_urlbuilder)
        filterlist.append(listfilter.django.single.selectinput.IsNotNull(
            slug='image', title='Has image?'))
        filterlist.append(listfilter.django.single.selectinput.DateTime(
            slug='publishing_time', title='Publishing time'))
        filterlist.set_filters_string(filters_string=self.get_filters_string())
        return filterlist

    def get_queryset_for_role(self, site):
        queryset = super(PagesListFilterView, self).get_queryset_for_role(site=site)
        queryset = self.get_filterlist().filter(queryset)
        return queryset


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            PagesListFilterView.as_view(),
            name=crapp.INDEXVIEW_NAME),
        crapp.Url(
            r'^filter/(?P<filters_string>.+)?$',
            PagesListFilterView.as_view(),
            name='filter')
    ]
