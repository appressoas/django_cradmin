from __future__ import unicode_literals

from . import form_mixins
from . import container


class Label(container.AbstractContainerRenderable, form_mixins.FieldWrapperRenderableChildMixin):
    """
    Renders a label for a :class:`~django_cradmin.uicontainer.fieldwrapper.FieldWrapper`.

    You never use this on its own outside a
    :class:`~django_cradmin.uicontainer.fieldwrapper.FieldWrapper`.
    """
    template_name = 'django_cradmin/uicontainer/field/label.django.html'

    def get_default_html_tag(self):
        return 'label'

    @property
    def for_attribute(self):
        if self.field_wrapper_renderable.field_renderable.should_render_as_child_of_label():
            return False
        else:
            return self.field_wrapper_renderable.field_renderable.dom_id

    def get_html_element_attributes(self):
        html_element_attributes = super(Label, self).get_html_element_attributes()
        html_element_attributes['for'] = self.for_attribute
        return html_element_attributes

    @property
    def label_text(self):
        bound_formfield = self.field_wrapper_renderable.bound_formfield
        if bound_formfield.field.label:
            return bound_formfield.field.label
        else:
            return bound_formfield.name
