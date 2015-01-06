from django.conf.urls import patterns, include, url

urlpatterns = patterns(
    '',
    url(r'^auth', include('django_cradmin.views.auth.urls')),
)
