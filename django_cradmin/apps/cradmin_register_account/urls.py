from __future__ import unicode_literals

from django.conf.urls import url

from django_cradmin.apps.cradmin_register_account.views.begin import BeginRegisterAccountView
from django_cradmin.apps.cradmin_register_account.views.email_sent import EmailSentView

urlpatterns = [
    url(r'^begin',
        BeginRegisterAccountView.as_view(),
        name="cradmin-register-account-begin"),
    url(r'^email-sent',
        EmailSentView.as_view(),
        name="cradmin-register-account-email-sent"),
]
