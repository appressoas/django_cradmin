from django.contrib.auth.views import logout


def cradmin_logoutview(request):
    return logout(
        request,
        template_name='django_cradmin/auth/logout.django.html')
