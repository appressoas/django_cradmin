from __future__ import unicode_literals

from django_cradmin import crapp
from django_cradmin import viewhelpers


class Overview(viewhelpers.generic.StandaloneBaseTemplateView):
    template_name = 'usermanagerdemo/overview.django.html'


class App(crapp.App):
    appurls = [
        crapp.Url(r'^$', Overview.as_view(), name=crapp.INDEXVIEW_NAME)
    ]
