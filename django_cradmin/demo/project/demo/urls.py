from __future__ import unicode_literals
from django.conf import settings
from django.conf.urls import patterns, include, url
from django.views.generic import RedirectView
from django_cradmin.demo.usermanagerdemo.cradmin import UsermanagerCrAdminInstance
from django_cradmin.demo.webdemo.cradmin import WebdemoCrAdminInstance

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
    url(r'^webdemo/', include('django_cradmin.demo.webdemo.urls')),
    url(r'^usermanagerdemo/', include(UsermanagerCrAdminInstance.urls())),
    url(r'^cradmin_temporaryfileuploadstore/', include('django_cradmin.apps.cradmin_temporaryfileuploadstore.urls')),
    url(r'^$', RedirectView.as_view(url='/webdemoadmin/', permanent=False)),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
        'document_root': settings.MEDIA_ROOT}),
    url(r'^polls/', include('django_cradmin.demo.polls_demo.urls'))
)
