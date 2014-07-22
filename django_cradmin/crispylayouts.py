"""
Custom django-crispy-forms layouts.
"""
from crispy_forms.layout import Submit


class PrimarySubmit(Submit):
    field_classes = "btn btn-primary"


class DangerSubmit(Submit):
    field_classes = "btn btn-danger"


class DefaultSubmit(Submit):
    field_classes = "btn btn-default"
