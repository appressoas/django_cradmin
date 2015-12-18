from __future__ import unicode_literals

from builtins import str

from django import forms
from django.utils.translation import pgettext

from django_cradmin.widgets import datetimepicker
from django_cradmin.widgets import filewidgets
from django_cradmin.widgets.modelchoice import ModelChoiceWidget


class ModelForm(forms.ModelForm):
    """
    A subclass of :class:`django.form.ModelForm` that automatically sets
    up good default widgets and other things for the fields.
    """
    def __init__(self, *args, **kwargs):
        """
        Parameters:
            view: The View object where this form is used. If this is
                provided, we are able to setup more widgets because
                some widgets depend on data from the view (such
                as ``view.request``).
        """
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
        of this form, falls back to :meth:`.setup_file_field` if not.

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

    def make_related_object_preview(self, fieldname, formfield, relatedobject):
        """
        Make preview for related object.

        Used by :meth:`.setup_modelchoice_field` to generate the preview for an
        object.

        Defaults to ``str(relatedobject)`` with fallback to ``(Not selected)`` (translatable)
        if ``relatedobject`` is ``None``.

        Parameters:
            fieldname: The name of the field.
            formfield: The form field object.
            relatedobject: The related model object.
        """
        if relatedobject is None:
            return pgettext('automodelform modelchoice_field no value', '(Not selected)')
        else:
            return str(relatedobject)

    def setup_modelchoice_field(self, fieldname, formfield):
        """
        Called by :meth:`.setup_field` if the ``formfield`` is a ModelChoiceField.

        Sets up :class:`django_cradmin.widgets.modelchoice.ModelChoiceWidget`
        as the widget if the ``view``-argument is provided to the constructor
        of this form, and if ``view.request.cradmin_instance.get_foreignkeyselectview_url`
        returns a view URL for the model in the ModelChoiceField.

        Parameters:
            fieldname: The name of the field.
            formfield: The form field object.
        """
        if not self.view or not hasattr(self.view.request, 'cradmin_instance'):
            return
        model_class = formfield.queryset.model
        cradmin_instance = self.view.request.cradmin_instance
        foreignkeyselectview_url = cradmin_instance.get_foreignkeyselectview_url(model_class=model_class)
        if not foreignkeyselectview_url:
            return

        preview = ''
        if self.instance:
            try:
                relatedobject = getattr(self.instance, fieldname)
            except model_class.DoesNotExist:
                pass
            else:
                preview = self.make_related_object_preview(fieldname=fieldname,
                                                           formfield=formfield,
                                                           relatedobject=relatedobject)

        self.fields[fieldname].widget = ModelChoiceWidget(
            queryset=formfield.queryset,
            preview=preview,
            selectview_url=foreignkeyselectview_url)

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
        elif isinstance(formfield, forms.ModelMultipleChoiceField):
            pass
        elif isinstance(formfield, forms.ModelChoiceField):
            self.setup_modelchoice_field(fieldname=fieldname, formfield=formfield)

    def autosetup_fields(self):
        """
        Automatically setup sane defaults for the fields in the form.
        """
        for fieldname, formfield in self.fields.items():
            self.setup_field(fieldname=fieldname, formfield=formfield)
