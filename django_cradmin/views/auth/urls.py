from django.conf.urls import patterns, url


urlpatterns = patterns(
    'django_cradmin.views.auth',
    url(r'^login$', 'login.cradmin_loginview', name='django_cradmin-login'),
    url(r'^logout$', 'logout.cradmin_logoutview', name='django_cradmin-logout'),

    # url(r'^signup/$', SignupView.as_view(), name='django_cradmin-signup'),
    # url(r'^signup/success$', SignupSuccessView.as_view(), name='django_cradmin-signup-success'),
    # url(r'^signup/activate/(?P<key>[a-zA-Z0-9:_%+.-]+)$', SignupActivateView.as_view(),
    #     name='django_cradmin-signup-activate'),
    #
    # url(r'^password_reset/$',
    #     'views.password_reset.password_reset_view',
    #     name='django_cradmin-password_reset'),
    # url(r'^password_reset/done$',
    #     'views.password_reset.password_reset_done_view',
    #     name='django_cradmin-password_reset_done'),
    # url(r'^password_reset/confirm/(?P<uidb64>[0-9A-Za-z=+_]+)-(?P<token>.+)$',
    #     'views.password_reset.password_reset_confirm_view',
    #     name='django_cradmin-password_reset_confirm'),
    # url(r'^password_reset/complete$',
    #     'views.password_reset.password_reset_complete_view',
    #     name='django_cradmin-password_reset_complete')
)
