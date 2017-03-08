from django_cradmin import crapp
from django_cradmin.demo.cradmin_gettingstarted.crapps.account_adminui import account_dashboard_view
from django_cradmin.demo.cradmin_gettingstarted.crapps.account_adminui import delete_account_view
from django_cradmin.demo.cradmin_gettingstarted.crapps.account_adminui import edit_account_view


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            account_dashboard_view.AccountDashboardView.as_view(),
            name=crapp.INDEXVIEW_NAME
        ),
        crapp.Url(
            r'^edit/(?P<pk>\d+)$',
            edit_account_view.AccountUpdateView.as_view(),
            name='edit'
        ),
        crapp.Url(
            r'^delete/(?P<pk>\d+)$',
            delete_account_view.AccountDeleteView.as_view(),
            name='delete'
        )
    ]
