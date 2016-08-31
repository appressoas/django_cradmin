from django_cradmin import renderable


class AbstractFooter(renderable.AbstractRenderableWithCss):
    def __init__(self, cradmin_instance):
        self.cradmin_instance = cradmin_instance

    def get_wrapper_htmltag(self):
        """
        Get the HTML tag to wrap the footer in.

        Defaults to ``"footer"``.
        """
        return 'footer'
