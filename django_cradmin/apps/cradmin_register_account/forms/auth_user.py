from django.utils.translation import ugettext_lazy as _
from django import forms
from django.contrib.auth import get_user_model
from django_cradmin.apps.cradmin_register_account.forms.base import AbstractCreateAccountWithPasswordForm


class AuthUserCreateAccountForm(AbstractCreateAccountWithPasswordForm):
    r"""
    A create account form for ``auth_user``.

    Can be used directly as the ``DJANGO_CRADMIN_REGISTER_ACCOUNT_FORM_CLASS``
    setting, or extended to create a custom register account form.

    To use it directly, set the following setting::

        DJANGO_CRADMIN_REGISTER_ACCOUNT_FORM_CLASS = \
            'django_cradmin.apps.cradmin_register_account.forms.auth_user.AuthUserCreateAccountForm'

    The form only includes username, email and password. To add more fields, simply
    override the Meta-class and the field layout. Lets say we want to make
    a form that includes the ``first_name`` and ``last_name`` fields::

        from django_cradmin.apps.cradmin_register_account.forms.auth_user import AuthUserCreateAccountForm

        class AuthUserCreateAccountWithFullNameForm(AuthUserCreateAccountForm):
            class Meta(AuthUserCreateAccountForm.Meta):
                fields = ['email', 'username', 'first_name', 'last_name']

            def get_field_layout(self):
                return [
                    'username',
                    'email',
                    'first_name',
                    'last_name',
                    'password1',
                    'password2',
                ]

    """
    class Meta(AbstractCreateAccountWithPasswordForm.Meta):
        fields = ['email', 'username']

    def __init__(self, *args, **kwargs):
        super(AuthUserCreateAccountForm, self).__init__(*args, **kwargs)
        self.fields['email'].required = True
        self.fields['username'].required = True

    def clean_email(self):
        email = self.cleaned_data['email']
        user_model = get_user_model()
        if user_model.objects.filter(email=email).exists():
            raise forms.ValidationError(
                message=_('Account with this email address already exists.'),
                code='not_unique_email')
        return email

    def deactivate_user(self, user):
        user.is_active = False

    def get_field_layout(self):
        return [
            'username',
            'email',
            'password1',
            'password2',
        ]


class AuthUserCreateAccountAutoUsernameForm(AuthUserCreateAccountForm):
    r"""
    A create account form for ``auth_user`` that autocreates the username
    from the email.

    This is a subclass of :class:`.AuthUserCreateAccountForm`,
    and the examples for extending that class works for this class too.

    Can be used directly as the ``DJANGO_CRADMIN_REGISTER_ACCOUNT_FORM_CLASS``
    setting, or extended to create a custom register account form.

    To use it directly, set the following setting::

        DJANGO_CRADMIN_REGISTER_ACCOUNT_FORM_CLASS = \
            'django_cradmin.apps.cradmin_register_account.forms.auth_user.AuthUserCreateAccountAutoUsernameForm'

    """
    def __init__(self, *args, **kwargs):
        super(AuthUserCreateAccountForm, self).__init__(*args, **kwargs)
        self.fields['email'].required = True
        self.fields['username'].widget = forms.HiddenInput()
        self.fields['username'].required = False

    @classmethod
    def create_username_from_email(cls, email):
        return email.replace('@', '_at_')[0:30]

    def clean_username(self):
        email = self.cleaned_data['email']
        username = self.__class__.create_username_from_email(email)
        return username
