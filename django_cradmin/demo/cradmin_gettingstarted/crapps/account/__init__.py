from django_cradmin import crapp
from django_cradmin.demo.cradmin_gettingstarted.crapps.account import account_index
from django_cradmin.demo.cradmin_gettingstarted.crapps.account import edit_account


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            account_index.AccountIndexView.as_view(),
            name=crapp.INDEXVIEW_NAME
        ),
        crapp.Url(
            r'^edit/(?P<pk>\d+)$',
            edit_account.AccountUpdateView.as_view(),
            name='edit'
        )
    ]