from __future__ import unicode_literals

from django.conf.urls import url

from django_cradmin.apps.cradmin_authenticate.views.login import LoginView
from django_cradmin.apps.cradmin_authenticate.views.logout import cradmin_logoutview

urlpatterns = [
    url(r'^login$', LoginView.as_view(), name='cradmin-authenticate-login'),
    url(r'^logout$', cradmin_logoutview, name='cradmin-authenticate-logout'),
]
