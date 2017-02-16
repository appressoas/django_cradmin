from django_cradmin import crapp
from django_cradmin.demo.cradmin_gettingstarted.crapps.account_index import AccountIndexView


class App(crapp.App):
    appurls = [
        crapp.Url(r'^$', AccountIndexView.as_view(), name=crapp.INDEXVIEW_NAME)
    ]
