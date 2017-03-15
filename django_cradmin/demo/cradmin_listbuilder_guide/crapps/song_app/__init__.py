from django_cradmin import crapp
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.song_app import song_create_view
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.song_app import song_dashboard


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            song_dashboard.SingleDashboardView.as_view(),
            name=crapp.INDEXVIEW_NAME
        ),
        crapp.Url(
            r'^create$',
            song_create_view.SongCreateView.as_view(),
            name='create'
        )
    ]
