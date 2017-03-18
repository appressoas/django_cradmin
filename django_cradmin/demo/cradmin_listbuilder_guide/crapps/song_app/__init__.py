from django_cradmin import crapp
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.song_app import song_create_view
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.song_app import song_edit_view


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^create$',
            song_create_view.SongCreateView.as_view(),
            name='create'
        ),
        crapp.Url(
            r'^edit/(?P<pk>\d+)$',
            song_edit_view.SongEditView.as_view(),
            name='edit'
        )

    ]
