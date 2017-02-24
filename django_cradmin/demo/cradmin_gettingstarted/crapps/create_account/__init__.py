from django_cradmin import crapp
from django_cradmin.demo.cradmin_gettingstarted.crapps.create_account import create_account_view
from django_cradmin.demo.cradmin_gettingstarted.crapps.create_account.create_account_dashboard_view import CreateAccountDashboardView


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            CreateAccountDashboardView.as_view(),
            name=crapp.INDEXVIEW_NAME),
        crapp.Url(
            r'^create-account$',
            create_account_view.CreateAccountView.as_view(),
            name='create_account'
        ),
    ]
