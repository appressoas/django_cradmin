from __future__ import unicode_literals

from django_cradmin import crapp
from django_cradmin import viewhelpers


class DashboardView(viewhelpers.generic.StandaloneBaseTemplateView):
    template_name = 'login_not_required_demo/dashboard.django.html'


class App(crapp.App):
    appurls = [
        crapp.Url(r'^$', DashboardView.as_view(), name=crapp.INDEXVIEW_NAME)
    ]
