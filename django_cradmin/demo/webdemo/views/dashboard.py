from __future__ import unicode_literals

from django_cradmin import crapp
from django_cradmin import viewhelpers


class DashboardView(viewhelpers.generic.WithinRoleTemplateView):
    template_name = 'webdemo/dashboard.django.html'


class App(crapp.App):
    appurls = [
        crapp.Url(r'^$', DashboardView.as_view(), name=crapp.INDEXVIEW_NAME)
    ]
