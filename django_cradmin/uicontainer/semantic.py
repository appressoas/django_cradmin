from django_cradmin.uicontainer.container import AbstractContainerRenderable

from . import convenience


class Paragraph(convenience.AbstractWithOptionalEscapedText):
    """
    Renders a ``<p>``.
    """
    def get_default_html_tag(self):
        return 'p'


class H1(convenience.AbstractWithOptionalEscapedText):
    """
    Renders a ``<h1>``.
    """
    def get_default_html_tag(self):
        return 'h1'


class H2(convenience.AbstractWithOptionalEscapedText):
    """
    Renders a ``<h2>``.
    """
    def get_default_html_tag(self):
        return 'h2'


class H3(convenience.AbstractWithOptionalEscapedText):
    """
    Renders a ``<h3>``.
    """
    def get_default_html_tag(self):
        return 'h3'


class H4(convenience.AbstractWithOptionalEscapedText):
    """
    Renders a ``<h4>``.
    """
    def get_default_html_tag(self):
        return 'h4'


class Section(AbstractContainerRenderable):
    """
    Renders a ``<section>``.
    """
    def get_default_html_tag(self):
        return 'section'


class Header(AbstractContainerRenderable):
    """
    Renders a ``<header>``.
    """
    def get_default_html_tag(self):
        return 'header'


class Footer(AbstractContainerRenderable):
    """
    Renders a ``<footer>``.
    """
    def get_default_html_tag(self):
        return 'footer'


class Main(AbstractContainerRenderable):
    """
    Renders a ``<main>``.
    """
    def get_default_html_tag(self):
        return 'main'

    def get_default_role(self):
        return 'main'
