import htmls
from django import test
from django_cradmin import uicontainer


class TestMessageContainer(test.TestCase):
    def test_sanity(self):
        container = uicontainer.messagecontainer.MessageContainer().bootstrap()
        selector = htmls.S(container.render())
        self.assertTrue(selector.exists('div'))

    def test_css_classes_default(self):
        container = uicontainer.messagecontainer.MessageContainer().bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('div')['class'], 'blocklist  blocklist--tight')

    def test_css_classes_variant_none(self):
        container = uicontainer.messagecontainer.MessageContainer(variant=None).bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('div')['class'], 'blocklist')

    def test_add_message(self):
        container = uicontainer.messagecontainer.MessageContainer()
        container.add_message(level='info', text='test')
        selector = htmls.S(container.bootstrap().render())
        self.assertEqual(selector.one('.blocklist__item').alltext_normalized,
                         'test')

    def test_add_warning(self):
        container = uicontainer.messagecontainer.MessageContainer()
        container.add_warning(text='test')
        selector = htmls.S(container.bootstrap().render())
        self.assertEqual(selector.one('.blocklist__item.blocklist__item--warning').alltext_normalized,
                         'test')

    def test_add_success(self):
        container = uicontainer.messagecontainer.MessageContainer()
        container.add_success(text='test')
        selector = htmls.S(container.bootstrap().render())
        self.assertEqual(selector.one('.blocklist__item.blocklist__item--success').alltext_normalized,
                         'test')

    def test_add_info(self):
        container = uicontainer.messagecontainer.MessageContainer()
        container.add_info(text='test')
        selector = htmls.S(container.bootstrap().render())
        self.assertEqual(selector.one('.blocklist__item.blocklist__item--info').alltext_normalized,
                         'test')
