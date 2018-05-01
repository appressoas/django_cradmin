from django.conf.urls import url

from django_cradmin import viewhelpers

from .views import overview

urlpatterns = [
    url(r'^simple/(?P<mockname>.+)?$',
        viewhelpers.uimock.UiMock.as_view(template_directory='uimock_demo/simple/'),
        name='cradmin_uimock_demo_simple'),
    url(r'^$',
        overview.Overview.as_view(),
        name='cradmin_uimock_demo'),
]
