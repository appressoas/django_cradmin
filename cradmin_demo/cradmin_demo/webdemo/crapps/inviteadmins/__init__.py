from django_cradmin import crapp

from . import index
from . import send_private_invite


class App(crapp.App):
    appurls = [
        crapp.Url(r'^$', index.Overview.as_view(), name=crapp.INDEXVIEW_NAME),
        crapp.Url(r'^sendprivate$', send_private_invite.SendPrivateInvites.as_view(), name='sendprivate')
    ]
