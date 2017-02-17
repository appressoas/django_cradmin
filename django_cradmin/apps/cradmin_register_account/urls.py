from __future__ import unicode_literals

from django.conf.urls import url
from django_cradmin.apps.cradmin_register_account.views import register_account

urlpatterns = [
    url(r'^$',
        register_account.RegisterAccountView.as_view(),
        name="cradmin-register-account"),
]
