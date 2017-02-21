from django_cradmin import crapp
from django_cradmin.demo.cradmin_gettingstarted.views.dashboard import DashboardView


class App(crapp.App):
    appurls = [
        crapp.Url(r'^$', DashboardView.as_view(), name=crapp.INDEXVIEW_NAME)
    ]