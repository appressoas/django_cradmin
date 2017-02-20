from django_cradmin import crapp
from django_cradmin.demo.cradmin_gettingstarted.crapps.account import account_index


class App(crapp.App):
    appurls = [
        crapp.Url(r'^$', account_index.AccountIndexView.as_view(), name=crapp.INDEXVIEW_NAME),
    ]
