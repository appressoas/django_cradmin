from . import convenience


class Paragraph(convenience.AbstractWithOptionalEscapedText):
    """
    Renders a ``<p>``.
    """
    def get_wrapper_htmltag(self):
        return 'p'


class H1(convenience.AbstractWithOptionalEscapedText):
    """
    Renders a ``<h1>``.
    """
    def get_wrapper_htmltag(self):
        return 'h1'


class H2(convenience.AbstractWithOptionalEscapedText):
    """
    Renders a ``<h2>``.
    """
    def get_wrapper_htmltag(self):
        return 'h2'


class H3(convenience.AbstractWithOptionalEscapedText):
    """
    Renders a ``<h3>``.
    """
    def get_wrapper_htmltag(self):
        return 'h3'


class H4(convenience.AbstractWithOptionalEscapedText):
    """
    Renders a ``<h4>``.
    """
    def get_wrapper_htmltag(self):
        return 'h4'
