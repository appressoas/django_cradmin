from __future__ import unicode_literals

from django_cradmin.demo.webdemo.views.pages import PagesQuerySetForRoleMixin
from django_cradmin.viewhelpers import listfilter
from django_cradmin.viewhelpers import listbuilderview
from django_cradmin import crapp
from django_cradmin.demo.webdemo.models import Page


class PagesListFilterView(PagesQuerySetForRoleMixin, listbuilderview.View):
    model = Page

    def get_filterlist_url(self, filters_string):
        return self.request.cradmin_app.reverse_appindexurl(kwargs={
            'filters_string': filters_string})

    def get_filterlist(self):
        filterlist = listfilter.base.AbstractFilterList(urlbuilder=self.filterlist_urlbuilder)
        filterlist.append(listfilter.django.single.selectinput.Boolean(
            slug='image', title='Has image?'))
        filterlist.set_filters_string(filters_string=self.get_filters_string())
        return filterlist


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^(?P<filters_string>.+)?$',
            PagesListFilterView.as_view(),
            name=crapp.INDEXVIEW_NAME)
    ]
