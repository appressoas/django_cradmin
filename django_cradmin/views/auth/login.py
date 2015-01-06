from django.http import HttpResponseRedirect
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.views import login
from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit


class CradminAuthenticationForm(AuthenticationForm):
    username = forms.CharField(max_length=254, label=_('Email'))

    error_messages = {
        'invalid_login': _("Your email and password didn't match. Please try again."),
        'inactive': _("This account is inactive."),
    }

    def __init__(self, *args, **kwargs):
        super(CradminAuthenticationForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.add_input(Submit('login', _('Sign in')))


def cradmin_loginview(request, template_name='django_cradmin/auth/login.django.html',
                      authentication_form=CradminAuthenticationForm):
    if request.user.is_authenticated():
        return HttpResponseRedirect(settings.LOGIN_REDIRECT_URL)

    return login(
        request,
        template_name=template_name,
        authentication_form=authentication_form)
