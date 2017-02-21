from __future__ import unicode_literals

from django.conf import settings
from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.views import static

from django_cradmin.demo.cradmin_gettingstarted.cradmin_instances import gettingstarted_cradmin_instance
from django_cradmin.demo.cradmin_gettingstarted.cradmin_instances import create_account_cradmin_instance
from django_cradmin.demo.listfilterdemo.cradmin import ListfilterDemoCrAdminInstance
from django_cradmin.demo.login_not_required_demo.cradmin import LoginNotRequiredCrAdminInstance
from django_cradmin.demo.multiselect2demo.cradmin import MultiselectDemoCrAdminInstance
from django_cradmin.demo.no_role_demo.cradmin import NoRoleCrAdminInstance
from django_cradmin.demo.project.demo.views.demo_overview import DemoView
from django_cradmin.demo.uicontainerdemo.cradmin import UIContainerDemoCrAdminInstance
from django_cradmin.demo.webdemo.webdemo_cradmin_instance import WebdemoCrAdminInstance

admin.site.login = login_required(admin.site.login)

urlpatterns = [
    url(r'^authenticate/', include('django_cradmin.apps.cradmin_authenticate.urls')),
    url(r'^resetpassword/', include('django_cradmin.apps.cradmin_resetpassword.urls')),
    url(r'^activate_account/', include('django_cradmin.apps.cradmin_activate_account.urls')),
    url(r'^register/', include('django_cradmin.apps.cradmin_register_account.urls')),
    url(r'^styleguide/', include('django_cradmin.apps.cradmin_kss_styleguide.urls')),
    url(r'^cradmin_email/', include('django_cradmin.apps.cradmin_email.urls')),

    url(r'^djangoadmin/', include(admin.site.urls)),
    url(r'^gettingstarted/admin/', include(gettingstarted_cradmin_instance.GettingStartedCradminInstance.urls())),
    url(r'^gettingstarted/', include(create_account_cradmin_instance.NoRoleCrAdminInstance.urls())),
    url(r'^webdemo/', include(WebdemoCrAdminInstance.urls())),
    url(r'^javascript_demos/', include('django_cradmin.demo.cradmin_javascript_demos.urls')),
    url(r'^listfilterdemo/', include(ListfilterDemoCrAdminInstance.urls())),
    url(r'^multiselect2demo/', include(MultiselectDemoCrAdminInstance.urls())),
    url(r'^login_not_required_demo/', include(LoginNotRequiredCrAdminInstance.urls())),
    url(r'^no_role_demo/', include(NoRoleCrAdminInstance.urls())),
    url(r'^webdemo/', include('django_cradmin.demo.webdemo.urls')),
    url(r'^uicontainerdemo/', include(UIContainerDemoCrAdminInstance.urls())),
    url(r'^cradmin_temporaryfileuploadstore/', include('django_cradmin.apps.cradmin_temporaryfileuploadstore.urls')),
    url(r'^$', DemoView.as_view()),
    url(r'^media/(?P<path>.*)$', static.serve, {
        'document_root': settings.MEDIA_ROOT}),
]
