import re
from django import forms
from django.core import validators
from django.core.validators import EmailValidator
from django.utils.translation import ugettext_lazy as _


class EmailListField(forms.Field):
    default_error_messages = {
        'invalid': _('Type email-addresses separated by newlines, whitespace or comma.')
    }
    default_help_text = _('Type email-addresses separated by newlines, whitespace or comma.')
    widget = forms.Textarea
    stringsplit_regex = re.compile(r'(?:\s*,\s*)|\s+')
    email_validator = EmailValidator()

    def __init__(self, *args, **kwargs):
        if 'help_text' not in kwargs:
            kwargs['help_text'] = self.default_help_text
        super(EmailListField, self).__init__(*args, **kwargs)

    def string_to_list(self, value):
        value = value.strip()
        if value.strip():
            return self.stringsplit_regex.split(value)
        else:
            return []

    def to_python_list(self, value):
        if value in validators.EMPTY_VALUES:
            return []
        elif isinstance(value, list):
            return value
        elif isinstance(value, tuple):
            return list(value)
        elif isinstance(value, basestring):
            return self.string_to_list(value)
        else:
            raise TypeError('Invalid type for EmailListField: {}'.format(type(value)))

    def validate_list_of_emails(self, list_of_emails):
        for email in list_of_emails:
            try:
                self.email_validator(email)
            except forms.ValidationError:
                errormessage = _('Invalid email address: %(email)s') % {'email': email}
                raise forms.ValidationError(errormessage)

    def to_python(self, value):
        list_of_emails = self.to_python_list(value)
        self.validate_list_of_emails(list_of_emails)
        return list_of_emails
