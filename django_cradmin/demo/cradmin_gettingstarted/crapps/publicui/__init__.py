from django_cradmin import crapp
from django_cradmin.demo.cradmin_gettingstarted.crapps.publicui import public_message_detail_view
from django_cradmin.demo.cradmin_gettingstarted.crapps.publicui import public_message_list_view


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            public_message_list_view.MessageListBuilderView.as_view(),
            name=crapp.INDEXVIEW_NAME),
        crapp.Url(
            r'^detail/(?P<pk>\d+)$',
            public_message_detail_view.MessageDetailView.as_view(),
            name='detail')
    ]
