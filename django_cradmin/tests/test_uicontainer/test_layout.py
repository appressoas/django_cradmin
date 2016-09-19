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


class TestPageSectionTight(test.TestCase):
    def test_sanity(self):
        container = uicontainer.layout.PageSectionTight().bootstrap()
        selector = htmls.S(container.render())
        self.assertTrue(selector.exists('.page-section--tight'))

    def test_default_css_classes(self):
        container = uicontainer.layout.PageSectionTight(dom_id='id_pagesection').bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('#id_pagesection').cssclasses_set,
                         {'page-section', 'page-section--tight', 'test-page-section'})


class TestContainer(test.TestCase):
    def test_sanity(self):
        container = uicontainer.layout.Container().bootstrap()
        selector = htmls.S(container.render())
        self.assertTrue(selector.exists('.container'))

    def test_default_css_classes(self):
        container = uicontainer.layout.Container(dom_id='id_container').bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('#id_container').cssclasses_set,
                         {'container', 'test-container'})


class TestContainerTight(test.TestCase):
    def test_sanity(self):
        container = uicontainer.layout.ContainerTight().bootstrap()
        selector = htmls.S(container.render())
        self.assertTrue(selector.exists('.container--tight'))

    def test_default_css_classes(self):
        container = uicontainer.layout.ContainerTight(dom_id='id_container').bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('#id_container').cssclasses_set,
                         {'container', 'container--tight', 'test-container'})
