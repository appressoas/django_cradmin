from django_cradmin import crapp
from django_cradmin.demo.cradmin_gettingstarted.crapps.account import account_index
from django_cradmin.demo.cradmin_gettingstarted.crapps.account import create_account


class App(crapp.App):
    appurls = [
        crapp.Url(r'^$', account_index.AccountIndexView.as_view(), name=crapp.INDEXVIEW_NAME),
        crapp.Url(r'^create$', create_account.AccountCreateView.as_view, name='create')
    ]