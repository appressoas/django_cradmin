from django_cradmin import crapp
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.album_app import album_create_view
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.album_app import album_dashboard


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            album_dashboard.AlbumDashboardView.as_view(),
            name=crapp.INDEXVIEW_NAME
        ),
        crapp.Url(
            r'^create',
            album_create_view.AlbumCreateView.as_view(),
            name='create'
        )
    ]
