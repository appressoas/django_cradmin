import htmls
from django import test
from django_cradmin import uicontainer


class TestPageSection(test.TestCase):
    def test_sanity(self):
        container = uicontainer.layout.PageSection().bootstrap()
        selector = htmls.S(container.render())
        self.assertTrue(selector.exists('.page-section'))

    def test_default_css_classes(self):
        container = uicontainer.layout.PageSection(dom_id='id_pagesection').bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('#id_pagesection').cssclasses_set,
                         {'page-section', 'test-page-section'})
