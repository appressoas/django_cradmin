from django.conf.urls import url

from django_cradmin import viewhelpers

from .views import TestLockdownView

urlpatterns = [
    url(r'^$',
        TestLockdownView.as_view(),
        name='cradmin_lockdown_demo'),
]
