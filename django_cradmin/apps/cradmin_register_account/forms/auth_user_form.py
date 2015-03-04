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
            raise forms.ValidationError("Account with this email address already exists")
        return email

    def save(self, commit=True):
        user_object = super(AuthUserCreateAccountWithUsernameForm, self).save(commit=False)
        user_object.is_active = False
        if commit:
            user_object.save()
        return user_object

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
        return email.replace('@', '_at_')

    def clean_username(self):
        email = self.cleaned_data['email']
        username = self.__class__.create_username_from_email(email)
        return username
