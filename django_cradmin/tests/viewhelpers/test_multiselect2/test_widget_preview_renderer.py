import htmls
from django import test

from django_cradmin.viewhelpers.multiselect2 import widget_preview_renderer


class TestValue(test.TestCase):
    def test_wrap_in_li_element_false(self):
        selector = htmls.S(widget_preview_renderer.Value(
                value='testvalue', wrap_in_li_element=False).render())
        self.assertFalse(selector.exists('li').alltext_normalized)

    def test_wrap_in_li_element_true(self):
        selector = htmls.S(widget_preview_renderer.Value(
                value='testvalue', wrap_in_li_element=True).render())
        self.assertTrue(selector.exists('li').alltext_normalized)

    def test_render_value_wrap_in_li_element_false(self):
        selector = htmls.S(widget_preview_renderer.Value(
                value='testvalue', wrap_in_li_element=False).render())
        self.assertEqual(
            'testvalue',
            selector.one('.django-cradmin-listbuilder-itemvalue').alltext_normalized)

    def test_render_value_wrap_in_li_element_true(self):
        selector = htmls.S(widget_preview_renderer.Value(
                value='testvalue', wrap_in_li_element=True).render())
        self.assertEqual(
            'testvalue',
            selector.one('.django-cradmin-listbuilder-itemvalue').alltext_normalized)
