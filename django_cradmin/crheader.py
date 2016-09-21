from django_cradmin import renderable


class AbstractHeaderRenderable(renderable.AbstractRenderableWithCss):
    def __init__(self, cradmin_instance):
        self.cradmin_instance = cradmin_instance

    def get_wrapper_htmltag(self):
        """
        Get the HTML tag to wrap the header in.

        Defaults to ``"header"``.
        """
        return 'header'

    def get_wrapper_htmltag_id(self):
        return 'id_django_cradmin_page_header'

    def include_menutoggle_javascript(self):
        return False


class DefaultHeaderRenderable(AbstractHeaderRenderable):
    template_name = 'django_cradmin/crheader/default-header.django.html'

    @property
    def bem_block(self):
        return 'adminui-page-header'

    @property
    def bem_variants_list(self):
        return []

    def expand_bem_variants_list(self):
        bem_block = self.bem_block
        return ['{}--{}'.format(bem_block, variant) for variant in self.bem_variants_list]

    def get_base_css_classes_list(self):
        return [self.bem_block] + self.expand_bem_variants_list()

    def include_menutoggle_javascript(self):
        return False
