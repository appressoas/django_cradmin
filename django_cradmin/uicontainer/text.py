from . import container


class EscapedText(container.AbstractContainerRenderable):
    """
    Renders provided text after escaping any HTML.

    Can not have children.
    """
    template_name = 'django_cradmin/uicontainer/text/escaped_text.django.html'

    def __init__(self, text, **kwargs):
        """
        Args:
            text: The text to render.
            **kwargs: Kwargs for :class:`~django_cradmin.uicontainer.container.AbstractContainerRenderable`.
        """
        self.text = text
        super(EscapedText, self).__init__(**kwargs)

    @property
    def can_have_children(self):
        return False


class Html(container.AbstractContainerRenderable):
    """
    Renders provided HTML directly without any formatting or escaping.

    Can not have children.
    """
    template_name = 'django_cradmin/uicontainer/text/html.django.html'

    def __init__(self, html, **kwargs):
        """
        Args:
            html: The HTML to render.
            **kwargs: Kwargs for :class:`~django_cradmin.uicontainer.container.AbstractContainerRenderable`.
        """
        self.html = html
        super(Html, self).__init__(**kwargs)

    @property
    def can_have_children(self):
        return False
