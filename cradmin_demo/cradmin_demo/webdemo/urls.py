from django.conf.urls import url, patterns
from cradmin_demo.webdemo.crapps.inviteadmins_private.accept_private_invite import AcceptPrivateSiteAdminInviteView
from cradmin_demo.webdemo.crapps.sharable_link.accept import AcceptPublicSiteAdminInviteView


urlpatterns = patterns(
    '',
    url(r'^inviteadmins_private/(?P<token>.+)$',
        AcceptPrivateSiteAdminInviteView.as_view(),
        name="webdemo-inviteadmins-private-accept"),
    url(r'^inviteadmins_public/(?P<token>.+)$',
        AcceptPublicSiteAdminInviteView.as_view(),
        name="webdemo-inviteadmins-public-accept"),
)
