from django.conf.urls import patterns, include, url

urlpatterns = patterns(
    '',
    url(r'^auth', include('django_cradmin.views.auth.urls')),
    url(r'^cradmin_temporaryfileuploadstore/', include('django_cradmin.apps.cradmin_temporaryfileuploadstore.urls')),
    url(r'^cradmin_resetpassword/', include('django_cradmin.apps.cradmin_resetpassword.urls')),
)
