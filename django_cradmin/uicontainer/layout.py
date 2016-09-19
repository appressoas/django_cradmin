from . import container


class PageSection(container.AbstractContainerRenderable):
    """
    ``page-section`` BEM block.
    """
    def get_default_bem_block_or_element(self):
        return 'page-section'

    def get_default_test_css_class_suffixes_list(self):
        return ['page-section']


class PageSectionTight(PageSection):
    """
    ``page-section`` BEM block with the ``tight`` BEM variant.
    """
    def get_default_bem_variant_list(self):
        return ['tight']


class Container(container.AbstractContainerRenderable):
    """
    ``container`` BEM block.
    """
    def get_default_bem_block_or_element(self):
        return 'container'

    def get_default_test_css_class_suffixes_list(self):
        return ['container']


class ContainerTight(Container):
    """
    ``container`` BEM block with the ``tight`` BEM variant.
    """
    def get_default_bem_variant_list(self):
        return ['tight']
