from django_cradmin import crapp
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.artist_app import artist_create_view
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.artist_app import artist_dashboard
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.artist_app import artist_edit_view


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
        ),
        crapp.Url(
            r'^edit/(?P<pk>\d+)$',
            artist_edit_view.ArtistEditView.as_view(),
            name='edit'
        ),
        # crapp.Url(
        #     r'^delete/(?P<pk>\d+)$',
        #     artist_delete_view.ArtistDeleteView.as_view(),
        #     name='delete'
        # )
    ]
