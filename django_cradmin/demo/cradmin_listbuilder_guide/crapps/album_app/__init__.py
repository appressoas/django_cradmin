from django_cradmin import crapp
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.album_app import album_create_view
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.album_app import album_dashboard
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.album_app import album_edit_view


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            album_dashboard.AlbumDashboardView.as_view(),
            name=crapp.INDEXVIEW_NAME
        ),
        crapp.Url(
            r'^create$',
            album_create_view.AlbumCreateView.as_view(),
            name='create'
        ),
        crapp.Url(
            r'^edit/(?P<pk>\d+)$',
            album_edit_view.AlbumEditView.as_view(),
            name='edit'
        )
    ]
