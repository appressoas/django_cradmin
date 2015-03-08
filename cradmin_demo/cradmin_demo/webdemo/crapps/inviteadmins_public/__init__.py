from django_cradmin import crapp

from . import create
from . import delete
from . import show


class App(crapp.App):
    appurls = [
        crapp.Url(r'^$', show.ShowView.as_view(), name=crapp.INDEXVIEW_NAME),
        crapp.Url(r'^create', create.CreatePublicInvite.as_view(), name='create'),
        crapp.Url(r'^delete/(?P<pk>\d+)$', delete.DeletePublicInviteView.as_view(), name='delete'),
    ]
