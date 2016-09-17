from django.conf.urls import url

from django_cradmin.apps.cradmin_kss_styleguide.views import exampleview
from .views import styleguideview

urlpatterns = [
    url(r'^$', styleguideview.GuideListView.as_view(),
        name='cradmin_kss_styleguide_guides'),
    url(r'^guide/(?P<unique_id>[a-zA-Z_.0-9-]+)/(?P<prefix>[^/]+)?',
        styleguideview.GuideView.as_view(),
        name='cradmin_kss_styleguide_guide'),
    url(r'^example/(?P<unique_id>[a-zA-Z_.0-9-]+)/(?P<section>[^/]+)/(?P<exampleindex>\d+)',
        exampleview.ExampleView.as_view(),
        name='cradmin_kss_styleguide_example'),
]
