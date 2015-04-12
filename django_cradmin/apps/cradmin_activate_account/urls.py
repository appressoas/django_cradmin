from __future__ import unicode_literals
from django.conf.urls import url, patterns
from django_cradmin.apps.cradmin_activate_account.views.activate import ActivateAccountView

urlpatterns = patterns(
    '',
    url(r'^activate/(?P<token>.+)',
        ActivateAccountView.as_view(),
        name="cradmin-activate-account-activate"),
)
