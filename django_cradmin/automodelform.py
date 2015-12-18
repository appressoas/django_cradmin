from django import forms

from django_cradmin.widgets import datetimepicker
from django_cradmin.widgets import filewidgets


class ModelForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        self.view = kwargs.pop('view', None)
        super(ModelForm, self).__init__(*args, **kwargs)
        self.autosetup_fields()

    def setup_datetime_field(self, fieldname, formfield):
        """
        Called by :meth:`.setup_field` if the ``formfield`` is a DateTimeField.

        Sets up :class:`django_cradmin.widgets.datetimepicker.DateTimePickerWidget`
        as the widget.

        Parameters:
            fieldname: The name of the field.
            formfield: The form field object.
        """
        self.fields[fieldname].widget = datetimepicker.DateTimePickerWidget(
            required=formfield.required
        )

    def setup_date_field(self, fieldname, formfield):
        """
        Called by :meth:`.setup_field` if the ``formfield`` is a DateField.

        Sets up :class:`django_cradmin.widgets.datetimepicker.DatePickerWidget`
        as the widget.

        Parameters:
            fieldname: The name of the field.
            formfield: The form field object.
        """
        self.fields[fieldname].widget = datetimepicker.DatePickerWidget(
            required=formfield.required
        )

    def setup_file_field(self, fieldname, formfield):
        """
        Called by :meth:`.setup_field` if the ``formfield`` is a FileField.

        Sets up :class:`django_cradmin.widgets.filewidgets.FileWidget`
        as the widget.

        Parameters:
            fieldname: The name of the field.
            formfield: The form field object.
        """
        self.fields[fieldname].widget = filewidgets.FileWidget(
            clearable=not formfield.required
        )

    def setup_image_field(self, fieldname, formfield):
        """
        Called by :meth:`.setup_field` if the ``formfield`` is an ImageField.

        Sets up :class:`django_cradmin.widgets.filewidgets.ImageWidget`
        as the widget if the ``view``-argument is provided to the constructor
        of this form.

        Parameters:
            fieldname: The name of the field.
            formfield: The form field object.
        """
        if self.view:
            self.fields[fieldname].widget = filewidgets.ImageWidget(
                request=self.view.request,
                clearable=not formfield.required,
            )
        else:
            self.setup_file_field(fieldname=fieldname, formfield=formfield)

    def setup_field(self, fieldname, formfield):
        """
        Setup widgets and other properties from the given field.
        Called once for each field in the form by :meth:`.autosetup_fields`.

        We provide defaults for many field types:

        - :meth:`.setup_datetime_field`
        - :meth:`.setup_date_field`

        You can override this method to custom handle of some
        or all of your fields.

        Parameters:
            fieldname: The name of the field.
            formfield: The form field object.
        """
        if isinstance(formfield, forms.DateField):
            self.setup_date_field(fieldname=fieldname, formfield=formfield)
        elif isinstance(formfield, forms.DateTimeField):
            self.setup_datetime_field(fieldname=fieldname, formfield=formfield)
        elif isinstance(formfield, forms.ImageField):
            self.setup_image_field(fieldname=fieldname, formfield=formfield)
        elif isinstance(formfield, forms.FileField):
            self.setup_file_field(fieldname=fieldname, formfield=formfield)

    def autosetup_fields(self):
        """
        Automatically setup sane defaults for the fields in the form.
        """
        for fieldname, formfield in self.fields.items():
            self.setup_field(fieldname=fieldname, formfield=formfield)
