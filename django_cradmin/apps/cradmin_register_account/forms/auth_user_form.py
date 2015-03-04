from django.utils.translation import ugettext_lazy as _
from django import forms
from django.contrib.auth import get_user_model
from django_cradmin.apps.cradmin_register_account.forms.base import AbstractCreateAccountWithPasswordForm


class AuthUserCreateAccountWithUsernameForm(AbstractCreateAccountWithPasswordForm):
    """

    """
    class Meta(AbstractCreateAccountWithPasswordForm.Meta):
        fields = ['email', 'username']

    def __init__(self, *args, **kwargs):
        super(AuthUserCreateAccountWithUsernameForm, self).__init__(*args, **kwargs)
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


class AuthUserCreateAccountForm(AuthUserCreateAccountWithUsernameForm):
    """

    """
    def __init__(self, *args, **kwargs):
        super(AuthUserCreateAccountWithUsernameForm, self).__init__(*args, **kwargs)
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
