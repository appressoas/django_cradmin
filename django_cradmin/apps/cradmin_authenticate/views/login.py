from django.contrib import auth
from django.contrib.auth import authenticate, get_user_model
from django.http import HttpResponseRedirect
from django.conf import settings
from django.http import QueryDict
from django.utils.safestring import mark_safe
from django.utils.translation import gettext_lazy as _, gettext_lazy
from django import forms
from django_cradmin import uicontainer

from django_cradmin.viewhelpers import formview


class AbstractLoginForm(forms.Form):
    """
    Superclass for the various Login-forms used by :class:`.LoginView` by default. Known subclasses:

     - :class:`.EmailLoginForm`
     - :class:`.EmailLoginFormNoSanityCheck`
     - :class:`UsernameLoginForm`

    """

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

    def model_sanity_check(self):
        pass

    def __init__(self, *args, **kwargs):
        self.model_sanity_check()
        super(AbstractLoginForm, self).__init__(*args, **kwargs)

    def authenticate(self, **kwargs):
        """
        Wrapper around ``django.contrib.auth.authenticate`` to make
        it easy for subclasses to add extra kwargs.
        """
        return authenticate(**kwargs)

    def clean(self):
        """
        validate the form, and execute :func:`django.contrib.auth.authenticate` to login the user if form is valid.
        """
        username = self.cleaned_data.get(self.username_field)
        password = self.cleaned_data.get('password')
        if username and password:
            authenticated_user = self.authenticate(**{
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
    """
    This form is used for username-based login.

    Using this form in its default state requires the `User`-models ``USERNAME_FIELD`` to be ``username``.
    This is set in the field ``username_field`` in this class.
    """
    username_field = 'username'
    username_field_placeholder = _('Username')
    username = forms.CharField(
        label=_('Username'))
    error_message_invalid_login = _("Your username and password didn't match. Please try again.")

    def model_sanity_check(self):
        user_model = get_user_model()
        if user_model.USERNAME_FIELD != self.username_field:
            raise ValueError('The username_field attribute of the login form must match the USERNAME_FIELD '
                             'attribute of the User model.')


class EmailLoginForm(AbstractLoginForm):
    """
    This form is used for email-based login along with the
    :class:`django_cradmin.apps.cradmin_authenticate.backends.EmailAuthBackend`.

    This requires adding ``DJANGO_CRADMIN_USE_EMAIL_AUTH_BACKEND = True`` to your ``settings.py``.

    This will work with the default django ``User``-model, and your own custom ``User`` model,
    as long as your ``User`` model has the field ``email`` for login. If your ``email`` field
    is called something else, you will need to override the ``username_field`` attribute of
    this class.

    If you want to use this class without the :class:`EmailAuthBackend`, you should rather use the
    :class:`.EmailLoginFormNoSanityCheck`.
    """
    username_field = 'email'
    username_field_placeholder = _('Email')
    email = forms.CharField(
        label=_('Email'))
    error_message_invalid_login = _("Your email and password didn't match. Please try again.")

    def model_sanity_check(self):
        if not getattr(settings, 'DJANGO_CRADMIN_USE_EMAIL_AUTH_BACKEND', False):
            raise ValueError('The DJANGO_CRADMIN_USE_EMAIL_AUTH_BACKEND must be set to use the EmailLoginForm.')


class EmailLoginFormNoSanityCheck(EmailLoginForm):
    """
    This works exactly like :class:`.EmailLoginForm`, but does not require
    ``DJANGO_CRADMIN_USE_EMAIL_AUTH_BACKEND`` to be set.
    """
    def model_sanity_check(self):
        pass


class LoginView(formview.StandaloneFormView):
    """
    View for handling login.
    By default, a "forgot password" link is read from ``DJANGO_CRADMIN_FORGOTPASSWORD_URL`` to your ``settings.py``.
    """
    template_name = 'cradmin_authenticate/login.django.html'

    def get_form_class(self):
        """
        Determine which subclass of :class:`.AbstractLoginForm` should be used for login.

        if ``settings.DJANGO_CRADMIN_USE_EMAIL_AUTH_BACKEND`` is set, the :class:`.EmailLoginForm` will be used.
        If not, the ``user_model.USERNAME_FIELD`` will be checked, and :class:`.EmailLoginFormNoSanityCheck`
        will be used if this is ``email``, and :class:`.UsernameLoginForm` if it is set to `username`.

        Override this function to add your own login-form.
        """
        user_model = get_user_model()
        if getattr(settings, 'DJANGO_CRADMIN_USE_EMAIL_AUTH_BACKEND', False):
            return EmailLoginForm
        elif user_model.USERNAME_FIELD == 'email':
            return EmailLoginFormNoSanityCheck
        elif user_model.USERNAME_FIELD == 'username':
            return UsernameLoginForm

        else:
            raise ValueError('User.USERNAME_FIELD is not one of "email" or "username".')

    def get(self, *args, **kwargs):
        """
        If user is authenticated, call :meth:`.LoginView.get_redirect_url()`, else render the login form.
        """
        if self.request.user.is_authenticated:
            return HttpResponseRedirect(self.get_redirect_url())
        else:
            return super(LoginView, self).get(*args, **kwargs)

    def get_initial_email_value(self):
        """
        Can be overriden to provide an initial value for the email.

        If this returns anything other than ``None``, it changes
        the behavior of the form to focus on the password field
        instead of the email field at page load, and the email field
        becomes a hidden field instead of an input field.

        .. seealso:: :meth:`.initial_email_value`.

        Returns:
            The initial email value if we have any. Should
            return something that evaluates to ``bool(value) == False``
            if we have no initial email value.
        """
        return None

    @property
    def initial_email_value(self):
        """
        We use this to retrieve the value of :meth:`.get_initial_email_value`,
        and you should use it if you need the value in your subclasses.

        This method only retrieves the value returned by
        :meth:`.get_initial_email_value` once, and cache it internally.
        This means that the get_initial_email_value method can perform
        potentially expensive operations, or operations that should
        only run once (like request.session.pop) without worrying
        about it.
        """
        if not hasattr(self, '_inital_email_value'):
            self._inital_email_value = self.get_initial_email_value()
        return self._inital_email_value

    def get_form_field_renderables(self):
        form_class = self.get_form_class()
        autofocus_password_field = False
        if self.initial_email_value:
            formchildren = [
                uicontainer.fieldwrapper.FieldWrapper(
                    fieldname=form_class.username_field,
                    field_renderable=uicontainer.field.HiddenField()),
            ]
            autofocus_password_field = True
        else:
            formchildren = [
                uicontainer.fieldwrapper.FieldWrapper(
                    fieldname=form_class.username_field,
                    field_renderable=uicontainer.field.Field(
                        autofocus=True,
                        placeholder=form_class.username_field_placeholder
                    )
                ),
            ]
        formchildren.extend([
            uicontainer.fieldwrapper.FieldWrapper(
                fieldname='password',
                field_renderable=uicontainer.field.Field(
                    autofocus=autofocus_password_field,
                    placeholder=form_class.password_field_placeholder
                )),
            uicontainer.button.SubmitPrimary(
                text=gettext_lazy('Sign in')),
        ])
        return formchildren

    def get_form_renderable(self):
        return uicontainer.layout.AdminuiPageSectionTight(
            children=[
                uicontainer.form.Form(
                    form=self.get_form(),
                    children=self.get_form_field_renderables()
                )
            ]
        ).bootstrap()

    def get_redirect_url(self):
        """
        Returns the redirect url to use. We always want to redirect to the `next` queryparam if
        provided regardless.

        Returns the `settings.LOGIN_REDIRECT_URL` if no `next` queryparam is provided.
        """
        next_url = self.request.GET.get('next')
        if next_url:
            return next_url
        else:
            return settings.LOGIN_REDIRECT_URL

    def get_success_url(self):
        """
        Returns the redirect-url after login-success. This will either be the ``next`` field in ``request.GET``
        if present, or ``settings.LOGIN_REDIRECT_URL`` if not.
        """
        return self.get_redirect_url()

    def form_valid(self, form):
        """
        Run :func:`django.contrib.auth.login()` once the login-form was validated.
        """
        authenticated_user = form.get_user()
        auth.login(self.request, authenticated_user)
        return super(LoginView, self).form_valid(form)

    def get_context_data(self, **kwargs):
        """
        adds form from :func:`get_form_helper`, and (if set) ``settings.DJANGO_CRADMIN_FORGOTPASSWORD_URL`` to
        template-context.
        """
        context = super(LoginView, self).get_context_data(**kwargs)
        context['DJANGO_CRADMIN_FORGOTPASSWORD_URL'] = getattr(
            settings, 'DJANGO_CRADMIN_FORGOTPASSWORD_URL', None)
        next_querystring = QueryDict(mutable=True)
        next_querystring['next'] = self.request.GET.get('next')
        context['next_querystring'] = mark_safe(next_querystring.urlencode())
        return context
