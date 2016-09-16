from . import container
from . import convenience


class BlocklistItemTitle(convenience.AbstractWithOptionalEscapedText):
    """
    Renders :class:`.BlocklistItem` title.

    The HTML element has the ``blocklist__itemtitle`` css class.
    """

    #: Constant for the --small variant.
    #: Use this as the ``variant`` kwarg for :meth:`~.BlocklistItemTitle.__init__`.
    #: if you want the --small variant.
    VARIANT_SMALL = 'small'

    #: Constant for the --large variant.
    #: Use this as the ``variant`` kwarg for :meth:`~.BlocklistItemTitle.__init__`.
    #: if you want the --large variant.
    VARIANT_LARGE = 'large'

    #: Constant for the --xlarge variant.
    #: Use this as the ``variant`` kwarg for :meth:`~.BlocklistItemTitle.__init__`.
    #: if you want the --xlarge variant.
    VARIANT_XLARGE = 'xlarge'

    def __init__(self, html_tag, variant=None, **kwargs):
        """
        Args:
            html_tag: The HTML tag to use for the title.
                Typically a heading (``"h2"``, ``"h3"``, ...).
            variant: A variant. See :obj:`~.BlocklistItem.VARIANT_SMALL`,
                :obj:`~.BlocklistItem.VARIANT_LARGE` and
                :obj:`~.BlocklistItem.VARIANT_XLARGE`.
            **kwargs: Kwargs for
                :class:`~django_cradmin.uicontainer.container.AbstractWithOptionalEscapedText`.
        """
        self.html_tag = html_tag
        self.variant = variant
        super(BlocklistItemTitle, self).__init__(**kwargs)

    def get_wrapper_htmltag(self):
        return self.html_tag

    def get_css_classes_list(self):
        css_classes = [
            'blocklist__itemtitle'
        ]
        if self.variant:
            css_classes.append('blocklist__itemtitle--{}'.format(self.variant))
        return css_classes


class BlocklistItem(convenience.AbstractWithOptionalParagraphWithEscapedText):
    """
    Renders an item suitable to be a direct child of :class:`.Blocklist`.

    The HTML element has the ``blocklist__item`` css class.
    """

    #: Constant for the --warning variant.
    #: Use this as the ``variant`` kwarg for :meth:`~.BlocklistItem.__init__`.
    #: if you want the --warning variant.
    VARIANT_WARNING = 'warning'

    #: Constant for the --success variant.
    #: Use this as the ``variant`` kwarg for :meth:`~.BlocklistItem.__init__`.
    #: if you want the --success variant.
    VARIANT_SUCCESS = 'success'

    #: Constant for the --info variant.
    #: Use this as the ``variant`` kwarg for :meth:`~.BlocklistItem.__init__`.
    #: if you want the --info variant.
    VARIANT_INFO = 'info'

    def __init__(self, variant=None, **kwargs):
        """
        Args:
            variant: A variant. See :obj:`~.BlocklistItem.VARIANT_WARNING`,
                :obj:`~.BlocklistItem.VARIANT_SUCCESS` and
                :obj:`~.BlocklistItem.VARIANT_INFO`.
            **kwargs: Kwargs for
                :class:`~django_cradmin.uicontainer.container.AbstractWithOptionalParagraphWithEscapedText`.
        """
        self.variant = variant
        super(BlocklistItem, self).__init__(**kwargs)

    def get_wrapper_htmltag(self):
        return 'div'

    def get_css_classes_list(self):
        css_classes = [
            'blocklist__item'
        ]
        if self.variant:
            css_classes.append('blocklist__item--{}'.format(self.variant))
        return css_classes


class BlocklistItemWarning(BlocklistItem):
    """
    Shortcut for creating a :class:`.BlocklistItem` with the
    :obj:`~.BlocklistItem.VARIANT_WARNING` variant.
    """
    def __init__(self, **kwargs):
        super(BlocklistItemWarning, self).__init__(variant=self.VARIANT_WARNING, **kwargs)


class BlocklistItemSuccess(BlocklistItem):
    """
    Shortcut for creating a :class:`.BlocklistItem` with the
    :obj:`~.BlocklistItem.VARIANT_SUCCESS` variant.
    """
    def __init__(self, **kwargs):
        super(BlocklistItemSuccess, self).__init__(variant=self.VARIANT_SUCCESS, **kwargs)


class BlocklistItemInfo(BlocklistItem):
    """
    Shortcut for creating a :class:`.BlocklistItem` with the
    :obj:`~.BlocklistItem.VARIANT_INFO` variant.
    """
    def __init__(self, **kwargs):
        super(BlocklistItemInfo, self).__init__(variant=self.VARIANT_INFO, **kwargs)


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

    #: Constant for the --tight variant.
    #: Use this as the ``variant`` kwarg for :meth:`~.Blocklist.__init__`.
    #: if you want the --tight variant.
    VARIANT_TIGHT = 'tight'

    def __init__(self, variant=None, **kwargs):
        """
        Args:
            variant: A variant. See :obj:`~.Blocklist.VARIANT_TIGHT`.
            **kwargs: Kwargs for :class:`~django_cradmin.uicontainer.container.AbstractContainerRenderable`.
        """
        self.variant = variant
        super(Blocklist, self).__init__(**kwargs)

    def get_wrapper_htmltag(self):
        return 'div'

    def get_css_classes_list(self):
        css_classes = [
            'blocklist'
        ]
        if self.variant:
            css_classes.append('blocklist--{}'.format(self.variant))
        return css_classes
