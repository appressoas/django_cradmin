from django_cradmin import crapp
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.edit_delete_app import edit_views
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.edit_delete_app import listview


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            listview.EditDeleteSongListbuilderView.as_view(),
            name=crapp.INDEXVIEW_NAME
        ),
        crapp.Url(
            r'^create$',
            edit_views.EditDeleteSongCreateView.as_view(),
            name='create'
        ),
        crapp.Url(
            r'^edit/(?P<pk>\d+)$',
            edit_views.EditDeleteSongEditView.as_view(),
            name='edit'
        ),
        crapp.Url(
            r'^delete/(?P<pk>\d+)$',
            edit_views.EditDeleteSongDeleteView.as_view(),
            name='delete'
        )
    ]
