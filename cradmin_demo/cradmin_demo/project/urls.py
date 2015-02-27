from django.conf.urls import patterns, include, url
from django.views.generic import RedirectView
from cradmin_demo.project import settings
from cradmin_demo.webdemo.cradmin import CrAdminInstance

from django.contrib import admin
admin.autodiscover()


urlpatterns = patterns(
    '',
    url(r'^accounts/login/$', 'django.contrib.auth.views.login',
        {'template_name': 'webdemo/login.django.html'}),
    url(r'^accounts/logout/$', 'django.contrib.auth.views.logout',
        {'template_name': 'webdemo/logout.django.html'}),
    url(r'^account/resetpassword/', include('django_cradmin.apps.cradmin_resetpassword.urls')),

    url(r'^djangoadmin/', include(admin.site.urls)),
    url(r'^cradmin/', include(CrAdminInstance.urls())),
    url(r'^cradmin_temporaryfileuploadstore/', include('django_cradmin.apps.cradmin_temporaryfileuploadstore.urls')),
    url(r'^$', RedirectView.as_view(url='/cradmin/', permanent=False)),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
        'document_root': settings.MEDIA_ROOT})
)
