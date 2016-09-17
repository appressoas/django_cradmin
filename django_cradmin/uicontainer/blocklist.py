from . import container
from . import convenience


class BlocklistItemTitle(convenience.AbstractWithOptionalEscapedText):
    """
    Renders :class:`.BlocklistItem` title.

    The HTML element has the ``blocklist__itemtitle`` css class.
    """
    def get_default_bem_block_or_element(self):
        return 'blocklist__itemtitle'


class BlocklistItem(convenience.AbstractWithOptionalParagraphWithEscapedText):
    """
    Renders an item suitable to be a direct child of :class:`.Blocklist`.

    The HTML element has the ``blocklist__item`` css class.
    """
    def get_default_bem_block_or_element(self):
        return 'blocklist__item'


class Blocklist(container.AbstractContainerRenderable):
    """
    Renders a list of block elements styled with the ``blocklist`` css class.

    Examples:

        Simple example::

            from django_cradmin import uicontainer

            uicontainer.blocklist.Blocklist(
                children=[
                    uicontainer.blocklist.BlocklistItem(text='Item 1'),
                    uicontainer.blocklist.BlocklistItem(text='Item 2')
                ]
            )

        Using variants of both the list and the items::

            from django_cradmin import uicontainer

            uicontainer.blocklist.Blocklist(
                variant=uicontainer.blocklist.Blocklist.VARIANT_TIGHT,
                children=[
                    uicontainer.blocklist.BlocklistItemSuccess(text='Success !'),
                    uicontainer.blocklist.BlocklistItemWarning(text='Warning :(')
                ]
            )

        More complex blocklist items::

            from django_cradmin import uicontainer

            uicontainer.blocklist.Blocklist(
                children=[
                    uicontainer.blocklist.BlocklistItem(
                        children=[
                            uicontainer.blocklist.BlocklistItemTitle(html_tag='h3')
                            uicontainer.typography.Paragraph(text='Hello world')
                        ]
                    ),
                    uicontainer.blocklist.BlocklistItem(
                        children=[
                            uicontainer.blocklist.BlocklistItemTitle(html_tag='h3',
                                variant=uicontainer.typography.BlocklistItemTitle.VARIANT_XLARGE)
                            uicontainer.typography.Paragraph(text='Hello world 2')
                        ]
                    ),
                ]
            )

    """
    def get_default_bem_block_or_element(self):
        return 'blocklist'
