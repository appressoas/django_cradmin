from __future__ import unicode_literals

from .. import container
from . import mixins
from . import field
from . import label
from . import help_text


class FieldWrapperRenderable(container.AbstractContainerRenderable, mixins.FormRenderableChildMixin):
    """
    Renders a form field.

    This just renders a wrapper ``div``, and lets other renderable classes
    render the field, label, etc.:

    - A :class:`~django_cradmin.uicontainer.uiforms.label.LabelRenderable` renders the label.
      This can be overridden using the ``label_renderable`` kwarg, or in
      :meth:`.get_default_label_renderable`.
    - A :class:`~django_cradmin.uicontainer.uiforms.field.BaseFieldRenderable` renders the
      form field. This can be overridden using the ``field_renderable`` kwarg,
      or in :meth:`.get_default_field_renderable`.
    - A :class:`~django_cradmin.uicontainer.uiforms.help_text.AutomaticHelpTextRenderable`
      renders the help text. This can be overridden using the ``help_text_renderable``
      kwarg, or in :meth:`.get_default_help_text_renderable`.
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
        Extends :meth:`django_cradmin.uicontainer.container.container.AbstractContainerRenderable.bootstrap`
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

        Defaults to an object of :class:`~django_cradmin.uicontainer.uiforms.label.LabelRenderable`.
        """
        return label.LabelRenderable()

    def get_default_field_renderable(self):
        """
        Get the default field renderable.

        This is used unless it is overridden using the ``field_renderable``
        kwarg for :meth:`.__init__`.

        Defaults to an object of
        :class:`~django_cradmin.uicontainer.uiforms.field.AutomaticDjangoFieldRenderable`.
        """
        return field.AutomaticDjangoFieldRenderable()

    def get_default_help_text_renderable(self):
        """
        Get the default help text renderable.

        This is used unless it is overridden using the ``help_text_renderable``
        kwarg for :meth:`.__init__`.

        Defaults to an object of :class:`~django_cradmin.uicontainer.uiforms.help_text.AutomaticHelpTextRenderable`.
        """
        return help_text.AutomaticHelpTextRenderable()

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

        See :meth:`django_cradmin.uicontainer.container.container.AbstractContainerRenderable.prepopulate_children_list`
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
