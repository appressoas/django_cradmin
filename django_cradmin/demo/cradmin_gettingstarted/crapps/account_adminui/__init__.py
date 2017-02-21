from django_cradmin import crapp
from django_cradmin.demo.cradmin_gettingstarted.crapps.account_adminui import account_index_view
from django_cradmin.demo.cradmin_gettingstarted.crapps.account_adminui import edit_account_view


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            account_index_view.AccountIndexView.as_view(),
            name=crapp.INDEXVIEW_NAME
        ),
        crapp.Url(
            r'^edit/(?P<pk>\d+)$',
            edit_account_view.AccountUpdateView.as_view(),
            name='edit'
        ),
    ]
