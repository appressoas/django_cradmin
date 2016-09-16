from ..container import AbstractContainerRenderable


class FormRenderable(AbstractContainerRenderable):
    template_name = 'django_cradmin/uicontainer/uiforms/form.django.html'

    def __init__(self, form, action=None, method=None, **kwargs):
        self.form = form
        self.action = action
        self._overridden_method = method
        self._fieldrenderable_map = {}
        super(FormRenderable, self).__init__(**kwargs)
        self.properties['formrenderable'] = self

    def get_wrapper_htmltag(self):
        return 'form'

    def get_default_method(self):
        """
        Get the default value for the method attribute of the form element.

        Defaults to ``"POST"``.
        """
        return 'POST'

    @property
    def method(self):
        """
        Get the value for the method attribute of the form element.

        You should not override this. Override :meth:`.get_default_method` instead.
        """
        return self._overridden_method or self.get_default_method()

    def action_is_redirect_to_self(self):
        return self.action is None

    def get_html_element_attributes(self):
        html_element_attributes = super(FormRenderable, self).get_html_element_attributes()
        html_element_attributes['method'] = self.method
        if not self.action_is_redirect_to_self():
            # if action is ``None`` (I.E.: redirect to self), we add this attribute in the
            # template, so it is not added here.
            # We have to do it this way because we do not have access to the request
            # object here.
            html_element_attributes['action'] = self.action
        return html_element_attributes

    def register_field_wrapper_renderable(self, field_wrapper_renderable):
        """
        Register a :class:`django_cradmin.uicontainer.uiforms.field.FieldWrapperRenderable`
        with this form.

        The form can access all its fields via :meth:`.get_field_wrapper_renderable`
        and :meth:`.iter_field_wrapper_renderables`.

        Args:
            field_wrapper_renderable: A :class:`django_cradmin.uicontainer.uiforms.field.FieldWrapperRenderable`
                object.
        """
        self._fieldrenderable_map[field_wrapper_renderable.fieldname] = field_wrapper_renderable

    def get_default_css_classes_list(self):
        css_classes = super(FormRenderable, self).get_default_css_classes_list()
        css_classes.append('form')
        return css_classes

    def get_field_wrapper_renderable(self, fieldname):
        """
        Get a :class:`django_cradmin.uicontainer.uiforms.field.FieldWrapperRenderable`
        that is a child of the form.

        Args:
            fieldname (str): A fieldname for a FieldWrapperRenderable that is a child
                of the form. Does not need to be a direct child.

        Raises:
            KeyError: If no FieldWrapperRenderable with the provided ``fieldname`` exists
                within the form.

        Returns:
            django_cradmin.uicontainer.uiforms.field.FieldWrapperRenderable: The FieldWrapperRenderable
            with the provided ``fieldname``.
        """
        return self._fieldrenderable_map[fieldname]

    def iter_field_wrapper_renderables(self):
        """
        Get an iterator over all the :class:`django_cradmin.uicontainer.uiforms.field.FieldWrapperRenderable`
        objects within the form.
        """
        return self._fieldrenderable_map.values()
