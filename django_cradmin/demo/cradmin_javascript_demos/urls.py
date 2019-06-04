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
    url(r'^receive-post-data$',
        views.ReceivePostDataView.as_view(),
        name="cradmin_javascript_demos_receive_post_data"),
    url(r'^geolocation-demo$',
        views.JavascriptDemoView.as_view(
            template_name='cradmin_javascript_demos/geolocation-demo.django.html'),
        name="cradmin_javascript_demos_geolocation"),
    url(r'^rotating-placeholder',
        views.JavascriptDemoView.as_view(
            template_name='cradmin_javascript_demos/rotating-placeholder.django.html'),
        name="cradmin_javascript_demos_rotating_placeholder"),
    url(r'^html5-date-picker-demo$',
        views.JavascriptDemoView.as_view(
            template_name='cradmin_javascript_demos/html5-datetimepicker-demo.django.html'),
        name="cradmin_javascript_demos_html5-datepicker"),
    url(r'^old-date-time-picker-demo$',
        views.JavascriptDemoView.as_view(
            template_name='cradmin_javascript_demos/old-datetimepicker-demo.django.html'),
        name="cradmin_javascript_demos_old_datetimepicker"),
    url(r'^date-time-picker-demo$',
        views.JavascriptDemoView.as_view(
            template_name='cradmin_javascript_demos/datetimepicker-demo.django.html'),
        name="cradmin_javascript_demos_datetimepicker"),
    url(r'^tabs-demo$',
        views.JavascriptDemoView.as_view(
            template_name='cradmin_javascript_demos/tabs-demo.django.html'),
        name="cradmin_javascript_demos_tabs"),
    url(r'^print-on-click$',
        views.JavascriptDemoView.as_view(
            template_name='cradmin_javascript_demos/print-on-click.django.html'),
        name="cradmin_print_on_click_demo"),
    url(r'^filterlist$',
        views.JavascriptDemoView.as_view(
            template_name='cradmin_javascript_demos/filterlist/filterlist-demo.django.html'),
        name="cradmin_javascript_demos_filterlist"),
    url(r'^filterlist-querystring$',
        views.JavascriptDemoView.as_view(
            template_name='cradmin_javascript_demos/filterlist/filterlist-querystring-demo.django.html'),
        name="cradmin_javascript_demos_filterlist_querystring"),
    url(r'^datalistwidgets$',
        ensure_csrf_cookie(views.JavascriptDemoView.as_view(
            template_name='cradmin_javascript_demos/data-list-widgets-demo.django.html')),
        name="cradmin_javascript_demos_datalistwidgets"),

    url(r'^datalistwidgets-uicontainer$',
        views.DataListWidgetsUicontainerDemo.as_view(),
        name="cradmin_javascript_demos_datalistwidgets_uicontainer"),
    url(r'^auto-submit-form-after-countdown$',
        views.AutoSubmitFormAfterCountdownDemoView.as_view(),
        name="cradmin_auto_submit_form_after_countdown_demo"),

    url(r'^api/move-fictional-figures$',
        demo_api.FictionalFigureMoveView.as_view(),
        name='cradmin_move_fictional_figures_api'),
    url(r'^api/',
        include((apirouter.urls, 'cradmin_javascript_demos_api'), namespace='cradmin_javascript_demos_api')),

    url(r'^filterlist-uicontainer-demo$',
        views.FilterListUiContainerDemoView.as_view(),
        name='cradmin_javascript_demos_filterlist_uicontainer')
]
