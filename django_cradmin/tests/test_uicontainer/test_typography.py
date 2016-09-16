import htmls
from django import test
from django_cradmin import uicontainer


class TestParagraph(test.TestCase):
    def test_sanity(self):
        container = uicontainer.semantic.Paragraph().bootstrap()
        selector = htmls.S(container.render())
        self.assertTrue(selector.exists('p'))

    def test_no_text(self):
        container = uicontainer.semantic.Paragraph().bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('p').alltext_normalized, '')

    def test_with_text(self):
        container = uicontainer.semantic.Paragraph(text='test').bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('p').alltext_normalized, 'test')


class TestH1(test.TestCase):
    def test_sanity(self):
        container = uicontainer.semantic.H1().bootstrap()
        selector = htmls.S(container.render())
        self.assertTrue(selector.exists('h1'))

    def test_no_text(self):
        container = uicontainer.semantic.H1().bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('h1').alltext_normalized, '')

    def test_with_text(self):
        container = uicontainer.semantic.H1(text='test').bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('h1').alltext_normalized, 'test')


class TestH2(test.TestCase):
    def test_sanity(self):
        container = uicontainer.semantic.H2().bootstrap()
        selector = htmls.S(container.render())
        self.assertTrue(selector.exists('h2'))

    def test_no_text(self):
        container = uicontainer.semantic.H2().bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('h2').alltext_normalized, '')

    def test_with_text(self):
        container = uicontainer.semantic.H2(text='test').bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('h2').alltext_normalized, 'test')


class TestH3(test.TestCase):
    def test_sanity(self):
        container = uicontainer.semantic.H3().bootstrap()
        selector = htmls.S(container.render())
        self.assertTrue(selector.exists('h3'))

    def test_no_text(self):
        container = uicontainer.semantic.H3().bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('h3').alltext_normalized, '')

    def test_with_text(self):
        container = uicontainer.semantic.H3(text='test').bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('h3').alltext_normalized, 'test')


class TestH4(test.TestCase):
    def test_sanity(self):
        container = uicontainer.semantic.H4().bootstrap()
        selector = htmls.S(container.render())
        self.assertTrue(selector.exists('h4'))

    def test_no_text(self):
        container = uicontainer.semantic.H4().bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('h4').alltext_normalized, '')

    def test_with_text(self):
        container = uicontainer.semantic.H4(text='test').bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('h4').alltext_normalized, 'test')
