from django_cradmin import crapp

from . import listview
from . import editviews


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            listview.PagesListBuilderView.as_view(),
            name=crapp.INDEXVIEW_NAME),
        crapp.Url(
            r'^filter/(?P<filters_string>.+)?$',
            listview.PagesListBuilderView.as_view(),
            name='filter'),
        crapp.Url(
            r'^create$',
            editviews.PageCreateView.as_view(),
            name="create"),
        crapp.Url(
            r'^edit/(?P<pk>\d+)$',
            editviews.PageUpdateView.as_view(),
            name="edit"),
        crapp.Url(
            r'^delete/(?P<pk>\d+)$',
            editviews.PageDeleteView.as_view(),
            name="delete"),
        # crapp.Url(
        #     r'^preview/(?P<pk>\d+)?$',
        #     preview.PreviewPageView.as_view(),
        #     name="preview"),
    ]
