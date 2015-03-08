from django_cradmin import crapp

from . import index
from . import create_public_invite
from . import delete_public_invite
from . import show


class App(crapp.App):
    appurls = [
        # crapp.Url(r'^$', index.Overview.as_view(), name=crapp.INDEXVIEW_NAME),
        crapp.Url(r'^$', show.ShowView.as_view(), name=crapp.INDEXVIEW_NAME),
        crapp.Url(r'^create', create_public_invite.CreatePublicInvite.as_view(), name='create'),
        crapp.Url(r'^delete/(?P<pk>\d+)$', delete_public_invite.DeletePublicInviteView.as_view(), name='delete'),
    ]
