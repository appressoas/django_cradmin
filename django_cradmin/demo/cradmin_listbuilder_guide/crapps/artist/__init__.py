from django_cradmin import crapp
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.artist import artist_dashboard


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            artist_dashboard.ArtistBashboard.as_view(),
            name=crapp.INDEXVIEW_NAME
        )
    ]
