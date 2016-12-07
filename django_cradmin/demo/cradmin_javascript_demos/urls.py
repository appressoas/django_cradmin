from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$',
        views.Overview.as_view(),
        name="cradmin_javascript_demos_overview"),
    url(r'^date-time-picker-demo$',
        views.DateTimePickerDemo.as_view(),
        name="cradmin_javascript_demos_datetimepicker_demo"),
    url(r'^select-demo$',
        views.SelectDemo.as_view(),
        name="cradmin_javascript_demos_select_demo")
]
