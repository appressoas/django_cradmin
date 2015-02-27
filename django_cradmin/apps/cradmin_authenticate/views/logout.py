from django.contrib.auth.views import logout


def cradmin_logoutview(request, template_name='cradmin_authenticate/logout.django.html'):
    return logout(
        request,
        template_name=template_name)
