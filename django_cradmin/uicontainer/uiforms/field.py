from __future__ import unicode_literals

from django import forms
from django.utils import safestring

from . import mixins
from ..container import AbstractContainerRenderable


class FieldWrapperRenderableChildMixin(object):
    """
    Mixin class for renderables that are children of :class:`.FieldWrapperRenderable`.
    """
    @property
    def field_wrapper_renderable(self):
        return self.properties['field_wrapper_renderable']


class LabelRenderable(AbstractContainerRenderable, FieldWrapperRenderableChildMixin):
    """
    Renders a label for a :class:`.FieldWrapperRenderable`.

    You never use this on its own outside a :class:`.FieldWrapperRenderable`.
    """
    template_name = 'django_cradmin/uicontainer/uiforms/field/label.django.html'

    def get_wrapper_htmltag(self):
        return 'label'

    @property
    def for_attribute(self):
        if self.field_wrapper_renderable.field_should_be_child_of_label():
            return False
        else:
            return self.field_wrapper_renderable.field_renderable.dom_id

    def get_html_element_attributes(self):
        html_element_attributes = super(LabelRenderable, self).get_html_element_attributes()
        html_element_attributes['for'] = self.for_attribute
        return html_element_attributes

    @property
    def label_text(self):
        bound_formfield = self.field_wrapper_renderable.bound_formfield
        if bound_formfield.field.label:
            return bound_formfield.field.label
        else:
            return bound_formfield.name


class BaseFieldRenderable(AbstractContainerRenderable, FieldWrapperRenderableChildMixin):
    """
    Abstract base class for renders of the actual form field
    for a :class:`.FieldWrapperRenderable`.

    You never use this on its own outside a :class:`.FieldWrapperRenderable`.
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


class AutomaticDjangoFieldRenderable(BaseFieldRenderable):
    """
    Automatically renders a form field for a :class:`.FieldWrapperRenderable`
    using the Django widget system.

    You never use this on its own outside a :class:`.FieldWrapperRenderable`.
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
            raise NotImplementedError('AutomaticDjangoFieldRenderable does not support the '
                                      'RadioSelect widget yet.')
        elif isinstance(self.bound_formfield.field.widget, forms.CheckboxSelectMultiple):
            raise NotImplementedError('AutomaticDjangoFieldRenderable does not support the '
                                      'CheckboxSelectMultiple widget yet.')

        return self.bound_formfield.as_widget(attrs=self.field_attributes_dict)


class BaseHelpTextRenderable(AbstractContainerRenderable, FieldWrapperRenderableChildMixin):
    """
    Base class for renderers of help text for a :class:`.FieldWrapperRenderable`.

    You never use this on its own outside a :class:`.FieldWrapperRenderable`.
    """


class AutomaticHelpTextRenderable(BaseHelpTextRenderable):
    """
    Renders help text for a :class:`.FieldWrapperRenderable` using
    the help text from the Django form field.

    You never use this on its own outside a :class:`.FieldWrapperRenderable`.
    """
    template_name = 'django_cradmin/uicontainer/uiforms/field/automatic_help_text.django.html'

    def get_wrapper_htmltag(self):
        return 'p'

    @property
    def help_text(self):
        """
        Get the help text configured for the form field.

        Can be overridden to provide a custom help text.
        """
        bound_formfield = self.field_wrapper_renderable.bound_formfield
        return bound_formfield.help_text

    @property
    def should_render(self):
        """
        Returns ``False`` if :meth:`.help_text` is empty,
        which means that the help text is not rendered at all if
        there is no help text.
        """
        return bool(self.help_text)


class FieldWrapperRenderable(AbstractContainerRenderable, mixins.FormRenderableChildMixin):
    """
    Renders a form field.

    This just renders a wrapper ``div``, and lets other renderable classes
    render the field, label, etc.:

    - A :class:`.LabelRenderable` renders the label. This can be overridden
      using the ``label_renderable`` kwarg, or in :meth:`.get_default_label_renderable`.
    - A :class:`.BaseFieldRenderable` renders the form field. This can be overridden
      using the ``field_renderable`` kwarg, or in :meth:`.get_default_field_renderable`.
    - A :class:`.AutomaticHelpTextRenderable` renders the help text. This can be overridden
      using the ``help_text_renderable`` kwarg, or in :meth:`.get_default_help_text_renderable`.
    """
    template_name = 'django_cradmin/uicontainer/uiforms/field/fieldwrapper.django.html'

    def __init__(self, fieldname, label_renderable=None, field_renderable=None,
                 help_text_renderable=None, **kwargs):
        self.fieldname = fieldname
        self.label_renderable = label_renderable or self.get_default_label_renderable()
        self.field_renderable = field_renderable or self.get_default_field_renderable()
        self.help_text_renderable = help_text_renderable or self.get_default_help_text_renderable()
        super(FieldWrapperRenderable, self).__init__(**kwargs)
        self.properties['field_wrapper_renderable'] = self

    def bootstrap(self, **kwargs):
        """
        Extends :meth:`django_cradmin.uicontainer.container.AbstractContainerRenderable.bootstrap`
        with a call to
        :meth:`django_cradmin.uicontainer.uiforms.form.FormRenderable.register_field_wrapper_renderable`
        to register this with the form.
        """
        returnvalue = super(FieldWrapperRenderable, self).bootstrap(**kwargs)
        self.formrenderable.register_field_wrapper_renderable(field_wrapper_renderable=self)
        return returnvalue

    def get_wrapper_htmltag(self):
        return 'div'

    def get_default_label_renderable(self):
        """
        Get the default label renderable.

        This is used unless it is overridden using the ``label_renderable``
        kwarg for :meth:`.__init__`.

        Defaults to an object of :class:`.LabelRenderable`.
        """
        return LabelRenderable()

    def get_default_field_renderable(self):
        """
        Get the default field renderable.

        This is used unless it is overridden using the ``field_renderable``
        kwarg for :meth:`.__init__`.

        Defaults to an object of :class:`.AutomaticDjangoFieldRenderable`.
        """
        return AutomaticDjangoFieldRenderable()

    def get_default_help_text_renderable(self):
        """
        Get the default help text renderable.

        This is used unless it is overridden using the ``help_text_renderable``
        kwarg for :meth:`.__init__`.

        Defaults to an object of :class:`.AutomaticHelpTextRenderable`.
        """
        return AutomaticHelpTextRenderable()

    def field_should_be_child_of_label(self):
        """
        If this returns ``True``, we add the field renderable as a child
        of the label renderable. Otherwise, we add the label above the field
        renderable.

        Returns:
             boolean: ``True`` by default.
        """
        return True

    def prepopulate_children_list(self):
        """
        Pre-populates the children list with:

        - Label renderable.
        - Field renderable.
        - Help text renderable.

        By default the field renderable will be added as a child of the label
        renderable. This is determined by :meth:`.field_should_be_child_of_label`.

        If you want to:

        - Add any renderables above the label, you can override this method
          and insert a renderable at the top (or just override the ``content`` template
          block.
        - Add any renderables in between these renderables, you will need to override
          this method.

        See :meth:`django_cradmin.uicontainer.container.AbstractContainerRenderable.prepopulate_children_list`
        for details about what this method works, and what it should return.
        """
        children = [self.label_renderable]
        if self.field_should_be_child_of_label():
            self.label_renderable.add_child(self.field_renderable)
        else:
            children.append(self.field_renderable)
        children.append(self.help_text_renderable)
        return children

    @property
    def bound_formfield(self):
        """
        Get the :class:`django.forms.boundfield.BoundField` for the form field.
        """
        return self.formrenderable.form[self.fieldname]

    # def get_default_css_classes_list(self):
    #     css_classes = super(FieldWrapperRenderable, self).get_default_css_classes_list()
    #     css_classes.append('field')
    #     return css_classes
