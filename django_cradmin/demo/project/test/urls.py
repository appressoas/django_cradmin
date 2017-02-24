from django.conf.urls import include, url

from django_cradmin.demo.cradmin_gettingstarted.cradmin_instances import create_account_cradmin_instance
from django_cradmin.demo.cradmin_gettingstarted.cradmin_instances import gettingstarted_cradmin_instance
from django_cradmin.demo.webdemo.webdemo_cradmin_instance import WebdemoCrAdminInstance

urlpatterns = [
    url(r'^cradmin_authenticate/', include('django_cradmin.apps.cradmin_authenticate.urls')),
    url(r'^cradmin_temporaryfileuploadstore/', include('django_cradmin.apps.cradmin_temporaryfileuploadstore.urls')),
    url(r'^cradmin_resetpassword/', include('django_cradmin.apps.cradmin_resetpassword.urls')),
    url(r'^cradmin_activate_account/', include('django_cradmin.apps.cradmin_activate_account.urls')),
    url(r'^cradmin_register_account/', include('django_cradmin.apps.cradmin_register_account.urls')),

    # Demo apps
    url(r'^webdemoadmin/', include(WebdemoCrAdminInstance.urls())),
    url(r'^webdemo/', include('django_cradmin.demo.webdemo.urls')),
    url(r'^gettingstarted/', include(create_account_cradmin_instance.CreateAccountCrAdminInstance.urls())),
    url(r'^gettingstarted/admin/', include(gettingstarted_cradmin_instance.GettingStartedCradminInstance.urls())),
]
