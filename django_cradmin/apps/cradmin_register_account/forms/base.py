from crispy_forms import layout
from crispy_forms.helper import FormHelper
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.translation import ugettext_lazy as _
from django import forms
from django_cradmin.crispylayouts import PrimarySubmitLg


class BaseCreateAccountForm(forms.ModelForm):
    #: Used to add custom attributes like angularjs directives to the form.
    #: See :meth:`.get_form_attributes`.
    form_attributes = {}

    password1 = forms.CharField(
        label=_('Type your password'),
        widget=forms.PasswordInput)
    password2 = forms.CharField(
        label=_('Type your password one more time'),
        widget=forms.PasswordInput)

    class Meta:
        model = get_user_model()

    def clean(self):
        cleaned_data = super(BaseCreateAccountForm, self).clean()
        password1 = cleaned_data.get("password1")
        password2 = cleaned_data.get("password2")

        if password1 and password2:
            if password1 != password2:
                raise forms.ValidationError(_('The passwords do not match'))
        return cleaned_data

    def __init__(self, *args, **kwargs):
        super(BaseCreateAccountForm, self).__init__(*args, **kwargs)
        self.helper = self.get_formhelper()

    def get_formhelper(self):
        """
        Get a :class:`crispy_forms.helper.FormHelper`.

        You normally do not need to override this directly. Instead
        you should override:

        - :meth:`.get_field_layout`.
        - :meth:`.get_hidden_fields`
        """
        helper = FormHelper()
        layoutargs = list(self.get_field_layout()) + list(self.get_button_layout()) + list(self.get_hidden_fields())
        helper.layout = layout.Layout(*layoutargs)
        helper.form_action = '#'
        form_id = self.get_form_id()
        if form_id:
            helper.form_id = form_id
        helper.attrs = self.get_form_attributes()
        return helper

    def get_submit_button_label(self):
        return _('Sign up for %(sitename)s') % {'sitename': settings.DJANGO_CRADMIN_SITENAME}

    def get_button_layout(self):
        """
        Get the button layout. This is added to the crispy form layout.
        """
        return [
            PrimarySubmitLg('submit-register', self.get_submit_button_label()),
        ]

    def get_form_attributes(self):
        """
        You can add custom attributes to the form via this method.

        This is set as the ``attrs``-attribute of the crispy FormHelper
        created in :meth:`.get_formhelper`.

        Defaults to :obj:`.form_attributes`.

        Returns:
            A dictionary to set any kind of form attributes. Underscores in
            keys are translated into hyphens.
        """
        return self.form_attributes

    def get_form_id(self):
        """
        Returns the ID to set on the DOM element for the form.

        Defaults to :obj:`.form_id`.
        """
        return 'django_cradmin_register_account_form'

    def get_field_layout(self):
        """
        Get a list/tuple of fields. These are added to a ``crispy_forms.layout.Layout``.

        Must be overridden.

        Simple example::

            from django.views.generic import FormView
            from crispy_forms import layout

            class MyForm(BaseCreateAccountForm):
                def get_field_layout(self):
                    return [
                        layout.Div('name', 'username')
                    ]
        """

    def get_hidden_fields(self):
        """
        Get hidden fields for the form.

        Returns:
            An iterable of :class:`crispy_forms.layout.Hidden` objects.
            Defaults to an empty list.
        """
        return []
