from __future__ import unicode_literals
from django.template import Template, Context, TemplateSyntaxError
from django.test import TestCase


class TestCradminWrapText(TestCase):
    def __render_template(self, template):
        full_template = '{{% load cradmin_textformatting_tags %}}{}'.format(template)
        return Template(full_template).render(Context({}))

    def test_does_not_change_short_lines(self):
        self.assertEqual(
            self.__render_template('{% cradmin_wrap_text 5 %}Test{% end_cradmin_wrap_text %}'),
            'Test')

    def test_wraps_long_lines(self):
        self.assertEqual(
            self.__render_template('{% cradmin_wrap_text 5 %}Test Stuff{% end_cradmin_wrap_text %}'),
            'Test\nStuff')

    def test_does_not_break_long_words(self):
        self.assertEqual(
            self.__render_template('{% cradmin_wrap_text 5 %}TestStuff{% end_cradmin_wrap_text %}'),
            'TestStuff')

    def test_keep_indent(self):
        self.assertEqual(
            self.__render_template('{% cradmin_wrap_text 5 indentspaces=4 %}Test Stuff{% end_cradmin_wrap_text %}'),
            '    Test\n    Stuff')

    def test_no_max_line_length(self):
        with self.assertRaises(TemplateSyntaxError):
            self.__render_template('{% cradmin_wrap_text %}Test{% end_cradmin_wrap_text %}')
