from django.conf.urls import patterns, include, url
from cradmin_demo.webdemo.cradmin import CrAdminInstance

from django.contrib import admin
admin.autodiscover()



urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^a/', include(CrAdminInstance.urls())),
    url(r'^silk', include('silk.urls', namespace='silk'))
)
