from django_cradmin import crapp
from django_cradmin.demo.cradmin_gettingstarted.crapps.publicui import message_list_view


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            message_list_view.MessageListBuilderView.as_view(),
            name=crapp.INDEXVIEW_NAME)
    ]
