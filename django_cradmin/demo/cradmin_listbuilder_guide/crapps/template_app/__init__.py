from django_cradmin import crapp
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.template_app import template_listview


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            template_listview.TemplateListbuilderView.as_view(),
            name=crapp.INDEXVIEW_NAME
        )
    ]
