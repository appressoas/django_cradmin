from . import form_mixins
from . import container


class AbstractLabel(container.AbstractContainerRenderable):
    template_name = 'django_cradmin/uicontainer/label/label.django.html'

    def get_default_html_tag(self):
        return 'label'

    @property
    def for_attribute(self):
        return False

    def get_html_element_attributes(self):
        html_element_attributes = super(AbstractLabel, self).get_html_element_attributes()
        html_element_attributes['for'] = self.for_attribute
        return html_element_attributes

    @property
    def label_text(self):
        raise NotImplementedError()

    @property
    def field_renderable(self):
        raise NotImplementedError()

    def should_show_text_after_field(self):
        return False


class Label(AbstractLabel, form_mixins.FieldWrapperRenderableChildMixin):
    """
    Renders a label for a :class:`~django_cradmin.uicontainer.fieldwrapper.FieldWrapper`.

    You never use this on its own outside a
    :class:`~django_cradmin.uicontainer.fieldwrapper.FieldWrapper`.
    """
    def should_include_for_attribute(self):
        return not self.field_wrapper_renderable.field_renderable.should_render_as_subwidgets()

    @property
    def for_attribute(self):
        if self.should_include_for_attribute():
            if self.field_wrapper_renderable.field_renderable.should_render_as_child_of_label():
                return False
            else:
                return self.field_wrapper_renderable.field_renderable.dom_id
        else:
            return False

    @property
    def label_text(self):
        bound_formfield = self.field_wrapper_renderable.bound_formfield
        if bound_formfield.field.label:
            return bound_formfield.field.label
        else:
            return bound_formfield.name

    @property
    def field_renderable(self):
        if self.field_wrapper_renderable.field_renderable.should_render_as_child_of_label():
            return self.field_wrapper_renderable.field_renderable
        else:
            return None


class SubWidgetLabel(AbstractLabel, form_mixins.FieldChildMixin):
    def __init__(self, subwidget_field_renderable, **kwargs):
        self.subwidget_field_renderable = subwidget_field_renderable
        super(SubWidgetLabel, self).__init__(**kwargs)

    def prepopulate_virtual_children_list(self):
        return [
            self.subwidget_field_renderable
        ]

    def should_show_text_after_field(self):
        return True

    def get_default_dom_id(self):
        return '{field_dom_id}_{index_in_parent}_label'.format(
            field_dom_id=self.field_renderable.dom_id,
            index_in_parent=self.subwidget_field_renderable.index_in_parent)

    @property
    def label_text(self):
        return self.subwidget_field_renderable.label_text

    @property
    def field_renderable(self):
        return self.subwidget_field_renderable


class StyledSubWidgetLabel(SubWidgetLabel):
    template_name = 'django_cradmin/uicontainer/label/styled_sub_widget_label.django.html'

    def __init__(self, **kwargs):
        super(StyledSubWidgetLabel, self).__init__(**kwargs)

    @property
    def control_indicator_bem_element(self):
        return '{}__control-indicator'.format(self.get_bem_block_or_element())


class RadioSubWidgetLabel(StyledSubWidgetLabel):
    def __init__(self, **kwargs):
        super(RadioSubWidgetLabel, self).__init__(**kwargs)

    def get_default_bem_block_or_element(self):
        return 'radio'


class CheckboxSubWidgetLabel(StyledSubWidgetLabel):
    def __init__(self, **kwargs):
        super(CheckboxSubWidgetLabel, self).__init__(**kwargs)

    def get_default_bem_block_or_element(self):
        return 'checkbox'
