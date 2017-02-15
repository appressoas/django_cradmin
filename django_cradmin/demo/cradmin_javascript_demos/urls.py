from django.conf.urls import url, include
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.routers import DefaultRouter

from django_cradmin.demo.cradmin_javascript_demos import demo_api
from . import views

apirouter = DefaultRouter()
apirouter.register(r'fictional-figures', demo_api.FictionalFigureViewSet,
                   base_name='fictional-figures')

urlpatterns = [
    url(r'^$',
        views.Overview.as_view(),
        name="cradmin_javascript_demos_overview"),
    url(r'^geolocation-demo$',
        views.JavascriptDemoView.as_view(
            template_name='cradmin_javascript_demos/geolocation-demo.django.html'),
        name="cradmin_javascript_demos_geolocation"),
    url(r'^date-time-picker-demo$',
        views.JavascriptDemoView.as_view(
            template_name='cradmin_javascript_demos/datetimepicker-demo.django.html'),
        name="cradmin_javascript_demos_datetimepicker"),
    url(r'^datalistwidgets$',
        ensure_csrf_cookie(views.DataListWidgetsDemo.as_view()),
        name="cradmin_javascript_demos_datalistwidgets"),
    url(r'^datalistwidgets-uicontainer$',
        views.DataListWidgetsUicontainerDemo.as_view(),
        name="cradmin_javascript_demos_datalistwidgets_uicontainer"),
    url(r'^tabs-demo$',
        views.TabsDemo.as_view(),
        name="cradmin_javascript_demos_tabs"),
    url(r'^auto-submit-form-after-countdown$',
        views.AutoSubmitFormAfterCountdownDemoView.as_view(),
        name="cradmin_auto_submit_form_after_countdown_demo"),
    url(r'^print-on-click$',
        views.PrintOnClickDemoView.as_view(),
        name="cradmin_print_on_click_demo"),
    url(r'^api/move-fictional-figures$',
        demo_api.FictionalFigureMoveView.as_view(),
        name='cradmin_move_fictional_figures_api'),
    url(r'^api/',
        include(apirouter.urls, namespace='cradmin_javascript_demos_api')),
]
