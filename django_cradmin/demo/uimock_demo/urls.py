from django.conf.urls import url

from django_cradmin import viewhelpers

urlpatterns = [
    url(r'^myproject-mocks/(?P<mockname>.+)?$',
        viewhelpers.uimock.UiMock.as_view(template_directory='uimock_demo/myproject-mocks/'),
        name='cradmin_uimock_demo'),
]
