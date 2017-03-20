from django_cradmin import crapp
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.edit_delete_preview_app import preview_edit_views
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.edit_delete_preview_app import preview_listview
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.edit_delete_preview_app import preview_song_preview


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            preview_listview.PreviewSongListbuilderView.as_view(),
            name=crapp.INDEXVIEW_NAME
        ),
        crapp.Url(
            r'^create',
            preview_edit_views.PreviewSongCreateView.as_view(),
            name='create'
        ),
        crapp.Url(
            r'^edit/(?P<pk>\d+)$',
            preview_edit_views.PreviewSongEditView.as_view(),
            name='edit'
        ),
        crapp.Url(
            r'^delete/(?P<pk>\d+)$',
            preview_edit_views.PreviewSongDeleteView.as_view(),
            name='delete'
        ),
        crapp.Url(
            r'^preview/(?P<pk>\d+)$',
            preview_song_preview.PreviewSongView.as_view(),
            name='preview'
        )
    ]
