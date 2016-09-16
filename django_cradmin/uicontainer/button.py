from django_cradmin.uicontainer import convenience


class Button(convenience.AbstractWithOptionalEscapedText):
    """
    Renders a ``<button type="button">`` with the default
    style (using the ``button`` css class).
    """
    def __init__(self, button_type=None, name=False, variant=None, **kwargs):
        self._overridden_button_type = button_type
        self._overridden_name = name
        self.variant = variant
        super(Button, self).__init__(**kwargs)

    def get_wrapper_htmltag(self):
        return 'button'

    def get_default_button_type(self):
        """
        Get the default value for the type attribute of the html element.

        Defaults to ``"button"``.
        """
        return 'button'

    @property
    def button_type(self):
        """
        Get the value for the type attribute of the html element.

        You should not override this. Override :meth:`.get_default_button_type` instead.
        """
        return self._overridden_button_type or self.get_default_button_type()

    def get_default_name(self):
        """
        Get the default value for the name attribute of the html element.

        Defaults to ``False``.
        """
        return False

    @property
    def name(self):
        """
        Get the value for the name attribute of the button html element.

        You should not override this. Override :meth:`.get_default_name` instead.
        """
        return self._overridden_name or self.get_default_name()

    def get_html_element_attributes(self):
        html_attributes = super(Button, self).get_html_element_attributes()
        html_attributes['type'] = self.button_type
        html_attributes['name'] = self.name
        return html_attributes

    def get_css_classes_list(self):
        css_classes = [
            'button'
        ]
        if self.variant:
            css_classes.append('button--{}'.format(self.variant))
        return css_classes


class ButtonPrimary(Button):
    """
    Renders a ``<button type="button">`` with the primary
    style (using the ``button  button--primary`` css class).
    """
    def __init__(self, **kwargs):
        super(ButtonPrimary, self).__init__(variant='primary', **kwargs)


class Submit(Button):
    """
    Renders a ``<button type="submit">`` with the default
    style (using the ``button`` css class).
    """
    def get_default_button_type(self):
        return 'submit'


class SubmitPrimary(Submit):
    """
    Renders a ``<button type="submit">`` with the primary
    style (using the ``button  button--primary`` css class).
    """
    def __init__(self, **kwargs):
        super(SubmitPrimary, self).__init__(variant='primary', **kwargs)
