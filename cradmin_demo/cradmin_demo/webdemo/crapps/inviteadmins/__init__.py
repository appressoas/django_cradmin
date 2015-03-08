from cradmin_demo.webdemo.crapps.inviteadmins import delete_private_invite
from django_cradmin import crapp

from . import index
from . import send_private_invite


class App(crapp.App):
    appurls = [
        crapp.Url(r'^$', index.Overview.as_view(), name=crapp.INDEXVIEW_NAME),
        crapp.Url(r'^send$', send_private_invite.SendPrivateInvites.as_view(), name='send'),
        crapp.Url(r'^delete/(?P<pk>\d+)$', delete_private_invite.DeletePrivateInviteView.as_view(), name='delete')
    ]
