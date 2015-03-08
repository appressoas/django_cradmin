from django.conf.urls import patterns, include, url
from django.views.generic import RedirectView
from cradmin_demo.project import settings
from cradmin_demo.usermanagerdemo.cradmin import UsermanagerCrAdminInstance
from cradmin_demo.webdemo.cradmin import WebdemoCrAdminInstance

from django.contrib import admin
admin.autodiscover()


urlpatterns = patterns(
    '',
    url(r'^authenticate/', include('django_cradmin.apps.cradmin_authenticate.urls')),
    url(r'^resetpassword/', include('django_cradmin.apps.cradmin_resetpassword.urls')),
    url(r'^activate_account/', include('django_cradmin.apps.cradmin_activate_account.urls')),
    url(r'^register/', include('django_cradmin.apps.cradmin_register_account.urls')),

    url(r'^djangoadmin/', include(admin.site.urls)),
    url(r'^webdemoadmin/', include(WebdemoCrAdminInstance.urls())),
    url(r'^webdemo/', include('cradmin_demo.webdemo.urls')),
    url(r'^usermanagerdemo/', include(UsermanagerCrAdminInstance.urls())),
    url(r'^cradmin_temporaryfileuploadstore/', include('django_cradmin.apps.cradmin_temporaryfileuploadstore.urls')),
    url(r'^$', RedirectView.as_view(url='/webdemoadmin/', permanent=False)),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
        'document_root': settings.MEDIA_ROOT})
)
