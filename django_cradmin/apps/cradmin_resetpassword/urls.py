from django.urls import path

from django_cradmin.apps.cradmin_resetpassword.views.begin import BeginPasswordResetView
from django_cradmin.apps.cradmin_resetpassword.views.email_sent import EmailSentView
from django_cradmin.apps.cradmin_resetpassword.views.reset import ResetPasswordView

urlpatterns = [
    path('begin',
         BeginPasswordResetView.as_view(),
         name="cradmin-resetpassword-begin"),
    path('email-sent',
         EmailSentView.as_view(),
         name="cradmin-resetpassword-email-sent"),
    path('reset/<str:token>',
         ResetPasswordView.as_view(),
         name="cradmin-resetpassword-reset"),
]
