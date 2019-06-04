from __future__ import unicode_literals

from django.conf import settings
from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.views import static

from django_cradmin.demo.no_role_demo.cradmin import NoRoleCrAdminInstance
from django_cradmin.demo.project.demo.views.demo_overview import DemoView
from django_cradmin.demo.uicontainerdemo.uicontainerdemo_cradmin_instance import UIContainerDemoCrAdminInstance

admin.site.login = login_required(admin.site.login)

urlpatterns = [
    url(r'^authenticate/', include('django_cradmin.apps.cradmin_authenticate.urls')),
    url(r'^resetpassword/', include('django_cradmin.apps.cradmin_resetpassword.urls')),
    url(r'^activate_account/', include('django_cradmin.apps.cradmin_activate_account.urls')),
    url(r'^register/', include('django_cradmin.apps.cradmin_register_account.urls')),
    url(r'^styleguide/', include('django_cradmin.apps.cradmin_kss_styleguide.urls')),
    url(r'^cradmin_email/', include('django_cradmin.apps.cradmin_email.urls')),

    url(r'^djangoadmin/', admin.site.urls),
    url(r'^javascript_demos/', include('django_cradmin.demo.cradmin_javascript_demos.urls')),
    url(r'^no_role_demo/', include(NoRoleCrAdminInstance.urls())),
    url(r'^uicontainerdemo/', include(UIContainerDemoCrAdminInstance.urls())),
    url(r'^uimock_demo/', include('django_cradmin.demo.uimock_demo.urls')),
    url(r'^$', DemoView.as_view()),
    url(r'^media/(?P<path>.*)$', static.serve, {
        'document_root': settings.MEDIA_ROOT}),
]
