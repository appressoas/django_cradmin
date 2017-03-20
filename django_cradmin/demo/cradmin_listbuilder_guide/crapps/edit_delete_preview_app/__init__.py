from django_cradmin import crapp
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.edit_delete_preview_app import preview_song_create_view
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.edit_delete_preview_app import preview_song_delete_view
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.edit_delete_preview_app import preview_song_edit_view
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.edit_delete_preview_app import preview_song_listview
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.edit_delete_preview_app import preview_song_preview


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            preview_song_listview.PreviewSongListbuilderView.as_view(),
            name=crapp.INDEXVIEW_NAME
        ),
        crapp.Url(
            r'^create',
            preview_song_create_view.EditDeltePreviewSongCreateView.as_view(),
            name='create'
        ),
        crapp.Url(
            r'^edit/(?P<pk>\d+)$',
            preview_song_edit_view.EditDeletePreviewSongEditView.as_view(),
            name='edit'
        ),
        crapp.Url(
            r'^delete/(?P<pk>\d+)$',
            preview_song_delete_view.EditDeletePreviewSongDeleteView.as_view(),
            name='delete'
        ),
        crapp.Url(
            r'^preview/(?P<pk>\d+)$',
            preview_song_preview.PreviewSongView.as_view(),
            name='preview'
        )
    ]
