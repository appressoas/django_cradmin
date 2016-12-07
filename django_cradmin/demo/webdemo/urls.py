from __future__ import unicode_literals

from django.conf.urls import url

from django_cradmin.demo.webdemo.crapps.inviteadmins.accept import AcceptPrivateSiteAdminInviteView
from django_cradmin.demo.webdemo.crapps.sharable_link.accept import AcceptPublicSiteAdminInviteView

urlpatterns = [
    url(r'^inviteadmins/(?P<token>.+)$',
        AcceptPrivateSiteAdminInviteView.as_view(),
        name="webdemo-inviteadmins-accept"),
    url(r'^sharable_link/(?P<token>.+)$',
        AcceptPublicSiteAdminInviteView.as_view(),
        name="webdemo-inviteadmins-public-accept"),
]
