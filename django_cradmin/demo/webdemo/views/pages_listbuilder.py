from __future__ import unicode_literals

from django_cradmin.demo.webdemo.views.pages import PagesQuerySetForRoleMixin, PageCreateView, PageUpdateView, \
    PageDeleteView
from django_cradmin.viewhelpers import listbuilderview
from django_cradmin import crapp
from django_cradmin.demo.webdemo.models import Page


class PagesListView(PagesQuerySetForRoleMixin, listbuilderview.View):
    model = Page


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            PagesListView.as_view(),
            name=crapp.INDEXVIEW_NAME),
        crapp.Url(
            r'^create$',
            PageCreateView.as_view(),
            name="create"),
        crapp.Url(
            r'^edit/(?P<pk>\d+)$',
            PageUpdateView.as_view(),
            name="edit"),
        crapp.Url(
            r'^delete/(?P<pk>\d+)$',
            PageDeleteView.as_view(),
            name="delete"),
    ]
