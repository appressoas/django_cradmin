from __future__ import unicode_literals

from django_cradmin.uicontainer import messagescontainer

from .. import container
from . import mixins
from . import field
from . import label
from . import help_text


class FieldWrapper(container.AbstractContainerRenderable, mixins.FormRenderableChildMixin):
    """
    Renders a form field.

    This just renders a wrapper ``div``, and lets other renderable classes
    render the field, label, etc.:

    - A :class:`~django_cradmin.uicontainer.uiforms.label.Label` renders the label.
      This can be overridden using the ``label_renderable`` kwarg, or in
      :meth:`.get_default_label_renderable`.
    - A :class:`~django_cradmin.uicontainer.uiforms.field.BaseFieldRenderable` renders the
      form field. This can be overridden using the ``field_renderable`` kwarg,
      or in :meth:`.get_default_field_renderable`.
    - A :class:`~django_cradmin.uicontainer.uiforms.help_text.AutomaticHelpText`
      renders the help text. This can be overridden using the ``help_text_renderable``
      kwarg, or in :meth:`.get_default_help_text_renderable`.
    """
    template_name = 'django_cradmin/uicontainer/uiforms/field/fieldwrapper.django.html'

    def __init__(self, fieldname, label_renderable=None, field_renderable=None,
                 help_text_renderable=None, messages_container=None, **kwargs):
        self.fieldname = fieldname
        self.label_renderable = label_renderable or self.get_default_label_renderable()
        self.field_renderable = field_renderable or self.get_default_field_renderable()
        self.help_text_renderable = help_text_renderable or self.get_default_help_text_renderable()
        self.messages_container = messages_container or self.get_default_messages_container()
        super(FieldWrapper, self).__init__(**kwargs)
        self.properties['field_wrapper_renderable'] = self

    def get_default_dom_id(self):
        return '{}_wrapper'.format(self.field_renderable.dom_id)

    def bootstrap(self, **kwargs):
        """
        Extends :meth:`django_cradmin.uicontainer.container.container.AbstractContainerRenderable.bootstrap`
        with a call to
        :meth:`django_cradmin.uicontainer.uiforms.form.Form.register_field_wrapper_renderable`
        to register this with the form.
        """
        returnvalue = super(FieldWrapper, self).bootstrap(**kwargs)
        self.formrenderable.register_field_wrapper_renderable(field_wrapper_renderable=self)
        return returnvalue

    def get_wrapper_htmltag(self):
        return 'div'

    def get_default_label_renderable(self):
        """
        Get the default label renderable.

        This is used unless it is overridden using the ``label_renderable``
        kwarg for :meth:`.__init__`.

        Defaults to an object of :class:`~django_cradmin.uicontainer.uiforms.label.Label`.
        """
        return label.Label()

    def get_default_field_renderable(self):
        """
        Get the default field renderable.

        This is used unless it is overridden using the ``field_renderable``
        kwarg for :meth:`.__init__`.

        Defaults to an object of
        :class:`~django_cradmin.uicontainer.uiforms.field.AutomaticDjangoField`.
        """
        return field.AutomaticDjangoField()

    def get_default_help_text_renderable(self):
        """
        Get the default help text renderable.

        This is used unless it is overridden using the ``help_text_renderable``
        kwarg for :meth:`.__init__`.

        Defaults to an object of :class:`~django_cradmin.uicontainer.uiforms.help_text.AutomaticHelpText`.
        """
        return help_text.AutomaticHelpText()

    def get_default_messages_container(self):
        """
        Get the default message container.

        This is used unless it is overridden using the ``messages_container``
        kwarg for :meth:`.__init__`.

        Defaults to a :class:`django_cradmin.uicontainer.messagecontainer.MessagesContainer`.

        Must implement :class:`django_cradmin.uicontainer.messagecontainer.AbstractMessageListMixin`.
        """
        return messagescontainer.MessagesContainer(
            test_css_class_suffixes_list=['field-messages']
        )

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
        - Message renderable.

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
        children.append(self.messages_container)
        return children

    @property
    def bound_formfield(self):
        """
        Get the :class:`django.forms.boundfield.BoundField` for the form field.
        """
        return self.formrenderable.form[self.fieldname]

    # def get_default_css_classes_list(self):
    #     css_classes = super(FieldWrapper, self).get_default_css_classes_list()
    #     css_classes.append('field')
    #     return css_classes
