from django_cradmin import crapp
from django_cradmin import viewhelpers


class MainDashboardView(viewhelpers.generic.StandaloneBaseTemplateView):
    template_name = 'cradmin_listbuilder_guide/main_dashboard.django.html'


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$', MainDashboardView.as_view(),
            name=crapp.INDEXVIEW_NAME
        )
    ]