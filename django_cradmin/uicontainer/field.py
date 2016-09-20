from __future__ import unicode_literals

from django import forms
from django.utils import safestring

from . import form_mixins
from . import container


class BaseFieldRenderable(container.AbstractContainerRenderable, form_mixins.FieldWrapperRenderableChildMixin):
    """
    Abstract base class for renders of the actual form field
    for a :class:`.FieldWrapper`.

    You never use this on its own outside a :class:`.FieldWrapper`.
    """
    def __init__(self, autofocus=False, placeholder=False, **kwargs):
        """

        Args:
            autofocus (boolean): Autofocus on this field at page load?
            placeholder (str): Placeholder text. See
                :meth:`~django_cradmin.uicontainer.container.AbstractContainerRenderable.get_html_element_attributes`
                for details about how values are applied.
            **kwargs: Kwargs for :class:`django_cradmin.uicontainer.container.AbstractContainerRenderable`.
        """
        self._overridden_autofocus = autofocus
        self._overridden_placeholder = placeholder
        super(BaseFieldRenderable, self).__init__(**kwargs)

    def get_default_autofocus(self):
        """
        Get the default value for the autofocus attribute of the html element.

        Defaults to ``False``.
        """
        return False

    @property
    def autofocus(self):
        """
        Get the value for the autofocus attribute of the html element.

        You should not override this. Override :meth:`.get_default_autofocus` instead.
        """
        return self._overridden_autofocus or self.get_default_autofocus()

    def get_default_placeholder(self):
        """
        Get the default value for the placeholder attribute of the html element.

        Defaults to ``False``.
        """
        return False

    @property
    def placeholder(self):
        """
        Get the value for the placeholder attribute of the html element.

        You should not override this. Override :meth:`.get_default_placeholder` instead.
        """
        return self._overridden_placeholder or self.get_default_placeholder()

    def get_html_element_attributes(self):
        attributes = super(BaseFieldRenderable, self).get_html_element_attributes()
        attributes.update({
            'autofocus': self.autofocus,
            'placeholder': self.placeholder,
        })
        return attributes

    @property
    def should_render_as_child_of_label(self):
        """
        Should this field be renderered as a child of the ``<label>``?


        Returns ``True`` by default, but subclasses should override this
        for fields that should not be rendered within a label.

        For example, :class:`.Field` overrides this with varying behavior
        depending on the type of the Django field widget.
        """
        return True

    @property
    def bound_formfield(self):
        return self.field_wrapper_renderable.formrenderable.form[self.field_wrapper_renderable.fieldname]

    def get_default_dom_id(self):
        return self.bound_formfield.auto_id

    @property
    def field_attributes_dict(self):
        attributes_dict = {}
        attributes_dict = self.bound_formfield.build_widget_attrs(attributes_dict)
        attributes_dict.update(self.get_html_element_attributes())
        return attributes_dict


class Field(BaseFieldRenderable):
    """
    Automatically renders a form field for a :class:`.FieldWrapper`
    using the Django widget system.

    You never use this on its own outside a :class:`.FieldWrapper`.
    """
    template_name = 'django_cradmin/uicontainer/field/field.django.html'

    def is_radio_select(self):
        """
        Returns ``True`` if the field widget is a :class:`django.forms.widgets.RadioSelect`.
        """
        return isinstance(self.bound_formfield.field.widget, forms.RadioSelect)

    def is_checkbox_select_multiple(self):
        """
        Returns ``True`` if the field widget is a :class:`django.forms.widgets.CheckboxSelectMultiple`.
        """
        return isinstance(self.bound_formfield.field.widget, forms.CheckboxSelectMultiple)

    def should_render_as_subwidgets(self):
        """
        Returns True if we should render using :meth:`.render_bound_formfield_as_widget`.
        """
        if self.is_radio_select() or self.is_checkbox_select_multiple():
            return True
        else:
            return False

    def render_bound_formfield_as_widget(self):
        return self.bound_formfield.as_widget(attrs=self.field_attributes_dict)

    def render_bound_formfield_subwidgets(self):
        widgets = []
        for subwidget in self.bound_formfield.field.widget.subwidgets(
                name=self.bound_formfield.html_name,
                value=self.bound_formfield.value(),
                attrs=self.field_attributes_dict):
            widgets.append(str(subwidget))
        return safestring.mark_safe('\n'.join(widgets))

    def should_render_as_child_of_label(self):
        return not self.should_render_as_subwidgets()

    @property
    def rendered_field(self):
        # print()
        # print("*" * 70)
        # print()
        # print(dir(self.bound_formfield))
        # for attribute in ('data', 'errors', 'auto_id', 'html_name',
        #                   'id_for_label', 'label', 'label_tag', 'name', 'value'):
        #     print(attribute, getattr(self.bound_formfield, attribute))
        # print('label', self.bound_formfield.field.label)
        # print(dir(self.bound_formfield.field.widget))
        # print(self.bound_formfield.field.widget.input_type)
        # print()
        # print("*" * 70)
        # print()

        # widgets = []
        # for subwidget in self.bound_formfield.field.widget.subwidgets(
        #         name=self.bound_formfield.html_name,
        #         value=self.bound_formfield.value(),
        #         attrs=self.field_attributes_dict):
        #     widgets.append(str(subwidget))
        # return safestring.mark_safe('\n'.join(widgets))

        # # TODO: Add support for radio and checkbox lists
        # if self.is_radio_select():
        #     raise NotImplementedError('Field does not support the '
        #                               'RadioSelect widget yet.')
        # elif self.is_checkbox_select_multiple():
        #     raise NotImplementedError('Field does not support the '
        #                               'CheckboxSelectMultiple widget yet.')
        if self.should_render_as_subwidgets():
            return self.render_bound_formfield_subwidgets()
        else:
            return self.render_bound_formfield_as_widget()


class HiddenField(Field):
    """
    Just like :class:`.Field`, but renders as
    a ``<input type="hidden">``.
    """
    @property
    def rendered_field(self):
        return self.bound_formfield.as_hidden(attrs=self.field_attributes_dict)
