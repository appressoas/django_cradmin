from django_cradmin import renderable


class AbstractHeader(renderable.AbstractRenderableWithCss):
    def __init__(self, cradmin_instance):
        self.cradmin_instance = cradmin_instance

    def get_wrapper_htmltag(self):
        """
        Get the HTML tag to wrap the header in.

        Defaults to ``"header"``.
        """
        return 'header'

    def get_wrapper_htmltag_id(self):
        return 'id_django_cradmin_header'


class DefaultHeader(AbstractHeader):
    template_name = 'django_cradmin/crheader/default-header.django.html'
