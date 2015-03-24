from crispy_forms import layout
from django.contrib import auth
from django.contrib.auth import authenticate, get_user_model
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from django import forms
from crispy_forms.helper import FormHelper
from django.views.generic import FormView

from django_cradmin.crispylayouts import PrimarySubmitLg


class AbstractLoginForm(forms.Form):

    #: The field used with the password for authentication.
    #: Must be set in subclasses
    username_field = None

    #: The placeholder text for the username field.
    #: Must be set in subclasses
    username_field_placeholder = None

    #: The placeholder text for the password field.
    #: Must be set in subclasses
    password_field_placeholder = _('Password')

    #: Error message to show if username and password do not match
    error_message_invalid_login = None

    #: Error message to show if the account is inactive.
    error_message_inactive = _("This account is inactive.")

    #: The password field
    password = forms.CharField(
        label=_('Password'),
        widget=forms.PasswordInput)

    def __init__(self, *args, **kwargs):
        user_model = get_user_model()
        if user_model.USERNAME_FIELD != self.username_field:
            raise ValueError('The username_field attribute of the login form must match the '
                             'USERNAME_FIELD attribute of the User model.')
        super(AbstractLoginForm, self).__init__(*args, **kwargs)

    def clean(self):
        username = self.cleaned_data.get(self.username_field)
        password = self.cleaned_data.get('password')
        if username and password:
            authenticated_user = authenticate(**{
                self.username_field: username,
                'password': password
            })
            if authenticated_user is None:
                raise forms.ValidationError(self.error_message_invalid_login)
            elif not authenticated_user.is_active:
                raise forms.ValidationError(self.error_message_inactive)
            self.__authenticated_user = authenticated_user
        return self.cleaned_data

    def get_user(self):
        return self.__authenticated_user


class UsernameLoginForm(AbstractLoginForm):
    username_field = 'username'
    username_field_placeholder = _('Username')
    username = forms.CharField(
        label=_('Username'))
    error_message_invalid_login = _("Your username and password didn't match. Please try again.")


class EmailLoginForm(AbstractLoginForm):
    username_field = 'email'
    username_field_placeholder = _('Email')
    email = forms.CharField(
        label=_('Email'))
    error_message_invalid_login = _("Your email and password didn't match. Please try again.")


class LoginView(FormView):
    template_name = 'cradmin_authenticate/login.django.html'

    def get_form_class(self):
        user_model = get_user_model()
        if user_model.USERNAME_FIELD == 'email':
            return EmailLoginForm
        elif user_model.USERNAME_FIELD == 'username':
            return UsernameLoginForm

        else:
            raise ValueError('User.USERNAME_FIELD is not one of "email" or "username".')

    def get(self, *args, **kwargs):
        if self.request.user.is_authenticated():
            return HttpResponseRedirect(settings.LOGIN_REDIRECT_URL)
        else:
            return super(LoginView, self).get(*args, **kwargs)

    def get_form_helper(self):
        formhelper = FormHelper()
        formhelper.form_action = reverse('cradmin-authenticate-login')
        formhelper.form_id = 'cradmin_authenticate_login_form'
        formhelper.label_class = 'sr-only'

        form_class = self.get_form_class()
        formhelper.layout = layout.Layout(
            layout.Field(form_class.username_field,
                         placeholder=form_class.username_field_placeholder,
                         css_class='input-lg'),
            layout.Field('password',
                         placeholder=form_class.password_field_placeholder,
                         css_class='input-lg'),
            PrimarySubmitLg('login', _('Sign in'))
        )
        return formhelper

    def get_success_url(self):
        if 'next' in self.request.GET:
            return self.request.GET['next']
        else:
            return settings.LOGIN_REDIRECT_URL

    def form_valid(self, form):
        authenticated_user = form.get_user()
        auth.login(self.request, authenticated_user)
        return super(LoginView, self).form_valid(form)

    def get_context_data(self, **kwargs):
        context = super(LoginView, self).get_context_data(**kwargs)
        context['formhelper'] = self.get_form_helper()
        context['DJANGO_CRADMIN_FORGOTPASSWORD_URL'] = getattr(
            settings, 'DJANGO_CRADMIN_FORGOTPASSWORD_URL', None)
        return context
