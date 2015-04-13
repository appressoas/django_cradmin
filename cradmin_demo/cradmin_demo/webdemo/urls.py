from __future__ import unicode_literals
from django.conf.urls import url, patterns
from cradmin_demo.webdemo.crapps.inviteadmins.accept import AcceptPrivateSiteAdminInviteView
from cradmin_demo.webdemo.crapps.sharable_link.accept import AcceptPublicSiteAdminInviteView


urlpatterns = patterns(
    '',
    url(r'^inviteadmins/(?P<token>.+)$',
        AcceptPrivateSiteAdminInviteView.as_view(),
        name="webdemo-inviteadmins-accept"),
    url(r'^sharable_link/(?P<token>.+)$',
        AcceptPublicSiteAdminInviteView.as_view(),
        name="webdemo-inviteadmins-public-accept"),
)
