from django.conf.urls import url
from .views import styleguideview

urlpatterns = [
    url(r'^$', styleguideview.GuideListView.as_view(),
        name='cradmin_kss_styleguide_guides'),
    url(r'^(?P<unique_id>[a-zA-Z_.0-9-]+)/(?P<prefix>[.0-9]+)?', styleguideview.GuideView.as_view(),
        name='cradmin_kss_styleguide_guide'),
]
