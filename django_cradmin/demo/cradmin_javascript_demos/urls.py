from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter

from django_cradmin.demo.cradmin_javascript_demos import demo_api
from . import views

apirouter = DefaultRouter()
apirouter.register(r'fictional-figures', demo_api.FictionalFigureViewSet)

urlpatterns = [
    url(r'^$',
        views.Overview.as_view(),
        name="cradmin_javascript_demos_overview"),
    url(r'^date-time-picker-demo$',
        views.DateTimePickerDemo.as_view(),
        name="cradmin_javascript_demos_datetimepicker"),
    url(r'^select-demo$',
        views.SelectDemo.as_view(),
        name="cradmin_javascript_demos_select"),
    url(r'^tabs-demo$',
        views.TabsDemo.as_view(),
        name="cradmin_javascript_demos_tabs"),
    url(r'^api/',
        include(apirouter.urls, namespace='cradmin_javascript_demos_api')),
]
