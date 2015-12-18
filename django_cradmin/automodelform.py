from django import forms

from django_cradmin.widgets.datetimepicker import DateTimePickerWidget


class ModelForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(ModelForm, self).__init__(*args, **kwargs)
        self.autosetup_fields()

    def setup_datetime_field(self, fieldname, formfield):
        self.fields[fieldname].widget = DateTimePickerWidget(
            required=formfield.required
        )

    def setup_datetime_field(self, fieldname, formfield):
        self.fields[fieldname].widget = DateTimePickerWidget(
            required=formfield.required
        )

    def setup_field(self, fieldname, formfield):
        if isinstance(formfield, forms.DateTimeField):
            self.setup_datetime_field(fieldname=fieldname, formfield=formfield)

    def autosetup_fields(self):
        for fieldname, formfield in self.fields.items():
            self.setup_field(fieldname=fieldname, formfield=formfield)
