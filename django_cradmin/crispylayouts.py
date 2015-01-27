"""
Custom django-crispy-forms layouts.
"""
from crispy_forms.layout import Submit
from crispy_forms.utils import flatatt


class CradminSubmitButton(Submit):
    template = 'django_cradmin/crispylayouts/submitbutton.django.html'
    extra_button_attributes = {}

    def get_extra_button_attributes(self):
        return self.extra_button_attributes

    def __init__(self, name, value, icon_cssclass=None, **kwargs):
        self.extra_button_attributes = flatatt(self.get_extra_button_attributes())
        self.icon_cssclass = icon_cssclass
        super(CradminSubmitButton, self).__init__(name, value, **kwargs)


class PrimarySubmit(CradminSubmitButton):
    field_classes = "btn btn-primary"


class DangerSubmit(CradminSubmitButton):
    field_classes = "btn btn-danger"


class DefaultSubmit(CradminSubmitButton):
    field_classes = "btn btn-default"
