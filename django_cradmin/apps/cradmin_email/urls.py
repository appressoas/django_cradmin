from django.conf.urls import url

from django_cradmin.apps.cradmin_email.views import email_design

urlpatterns = [
    url(r'^emaildesign/(?P<format>html|plaintext)?$', email_design.EmailDesignView.as_view()),
]
