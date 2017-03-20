from django_cradmin import crapp
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.title_description_app import title_description_listview


class App(crapp.App):
    """"""
    appurls = [
        crapp.Url(
            r'^$',
            title_description_listview.TitleDescriptionListbuilderView.as_view(),
            name=crapp.INDEXVIEW_NAME
        )
    ]
