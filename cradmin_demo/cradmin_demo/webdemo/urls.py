from django.conf.urls import url, patterns
from cradmin_demo.webdemo.crapps.inviteadmins.accept_private_invite import AcceptSiteAdminInviteView


urlpatterns = patterns(
    '',
    url(r'^inviteadmins/(?P<token>.+)$',
        AcceptSiteAdminInviteView.as_view(),
        name="webdemo-inviteadmins-accept"),
)
