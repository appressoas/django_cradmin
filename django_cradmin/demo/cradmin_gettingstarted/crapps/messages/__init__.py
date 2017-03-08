from django_cradmin import crapp
from django_cradmin.demo.cradmin_gettingstarted.crapps.messages import create_message_view


class App(crapp.App):
    appurls = [
        crapp.Url(
                r'^',
                create_message_view.CreateMessageView.as_view(),
                name='create'
            )
    ]