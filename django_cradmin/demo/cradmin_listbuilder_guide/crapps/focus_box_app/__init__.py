from django_cradmin import crapp
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.focus_box_app import focus_box_listview


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            focus_box_listview.FocusBoxSongListbuilderView.as_view(),
            name=crapp.INDEXVIEW_NAME
        )
    ]
