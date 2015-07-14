from __future__ import unicode_literals
from django.conf.urls import patterns, url, include

from .views import poll_views
from django_cradmin.demo.polls_demo import cradmin

urlpatterns = patterns(
    '',
    url(r'^$', poll_views.IndexView.as_view(), name='index'),
    url(r'^(?P<pk>\d+)/$', poll_views.DetailView.as_view(), name='detail'),
    url(r'^(?P<pk>\d+)/results/$', poll_views.ResultsView.as_view(), name='results'),
    url(r'^(?P<question_id>\d+)/vote/$', poll_views.vote, name='vote'),
    url(r'^cradmin/', include(cradmin.CrAdminInstance.urls()), name='cradmin')
)
