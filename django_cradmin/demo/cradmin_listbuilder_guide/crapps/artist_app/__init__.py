from django_cradmin import crapp
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.artist_app import artist_create_view
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.artist_app import artist_dashboard


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            artist_dashboard.ArtistBashboardView.as_view(),
            name=crapp.INDEXVIEW_NAME
        ),
        crapp.Url(
            r'^create$',
            artist_create_view.ArtistCreateView.as_view(),
            name='create'
        )
    ]
