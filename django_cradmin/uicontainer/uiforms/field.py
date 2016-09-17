from __future__ import unicode_literals

from django import forms

from . import form_mixins
from .. import container


class BaseFieldRenderable(container.AbstractContainerRenderable, form_mixins.FieldWrapperRenderableChildMixin):
    """
    Abstract base class for renders of the actual form field
    for a :class:`.FieldWrapper`.

    You never use this on its own outside a :class:`.FieldWrapper`.
    """
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


class AutomaticDjangoField(BaseFieldRenderable):
    """
    Automatically renders a form field for a :class:`.FieldWrapper`
    using the Django widget system.

    You never use this on its own outside a :class:`.FieldWrapper`.
    """
    template_name = 'django_cradmin/uicontainer/uiforms/field/automatic_django_field.django.html'

    @property
    def rendered_field(self):
        # print()
        # print("*" * 70)
        # print()
        # print(dir(self.bound_formfield))
        # for attribute in ('data', 'errors', 'auto_id', 'html_name', 'id_for_label', 'label', 'label_tag', 'name', 'value'):
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

        # TODO: Add support for radio and checkbox lists
        if isinstance(self.bound_formfield.field.widget, forms.RadioSelect):
            raise NotImplementedError('AutomaticDjangoField does not support the '
                                      'RadioSelect widget yet.')
        elif isinstance(self.bound_formfield.field.widget, forms.CheckboxSelectMultiple):
            raise NotImplementedError('AutomaticDjangoField does not support the '
                                      'CheckboxSelectMultiple widget yet.')

        return self.bound_formfield.as_widget(attrs=self.field_attributes_dict)
