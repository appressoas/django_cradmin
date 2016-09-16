import htmls
from django import test
from django_cradmin import uicontainer


class TestBlocklistItemTitle(test.TestCase):
    def test_sanity(self):
        container = uicontainer.blocklist.BlocklistItemTitle(html_tag='h1').bootstrap()
        selector = htmls.S(container.render())
        self.assertTrue(selector.exists('h1'))

    def test_css_classes_no_variant(self):
        container = uicontainer.blocklist.BlocklistItemTitle(html_tag='h1').bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('h1')['class'], 'blocklist__itemtitle')

    def test_css_classes_variant_small(self):
        container = uicontainer.blocklist.BlocklistItemTitle(
            html_tag='h1',
            variant=uicontainer.blocklist.BlocklistItemTitle.VARIANT_SMALL).bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('h1')['class'], 'blocklist__itemtitle  blocklist__itemtitle--small')

    def test_css_classes_variant_large(self):
        container = uicontainer.blocklist.BlocklistItemTitle(
            html_tag='h1',
            variant=uicontainer.blocklist.BlocklistItemTitle.VARIANT_LARGE).bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('h1')['class'], 'blocklist__itemtitle  blocklist__itemtitle--large')

    def test_css_classes_variant_xlarge(self):
        container = uicontainer.blocklist.BlocklistItemTitle(
            html_tag='h1',
            variant=uicontainer.blocklist.BlocklistItemTitle.VARIANT_XLARGE).bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('h1')['class'], 'blocklist__itemtitle  blocklist__itemtitle--xlarge')

    def test_no_text(self):
        container = uicontainer.blocklist.BlocklistItemTitle(html_tag='h1').bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('h1').alltext_normalized, '')

    def test_has_text(self):
        container = uicontainer.blocklist.BlocklistItemTitle(html_tag='h1', text='test').bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('h1').alltext_normalized, 'test')


class TestBlocklistItem(test.TestCase):
    def test_sanity(self):
        container = uicontainer.blocklist.BlocklistItem().bootstrap()
        selector = htmls.S(container.render())
        self.assertTrue(selector.exists('div'))

    def test_css_classes_no_variant(self):
        container = uicontainer.blocklist.BlocklistItem().bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('div')['class'], 'blocklist__item')

    def test_css_classes_variant_warning(self):
        container = uicontainer.blocklist.BlocklistItem(
            variant=uicontainer.blocklist.BlocklistItem.VARIANT_WARNING).bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('div')['class'], 'blocklist__item  blocklist__item--warning')

    def test_css_classes_variant_success(self):
        container = uicontainer.blocklist.BlocklistItem(
            variant=uicontainer.blocklist.BlocklistItem.VARIANT_SUCCESS).bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('div')['class'], 'blocklist__item  blocklist__item--success')

    def test_css_classes_variant_info(self):
        container = uicontainer.blocklist.BlocklistItem(
            variant=uicontainer.blocklist.BlocklistItem.VARIANT_INFO).bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('div')['class'], 'blocklist__item  blocklist__item--info')

    def test_no_text(self):
        container = uicontainer.blocklist.BlocklistItem().bootstrap()
        selector = htmls.S(container.render())
        self.assertFalse(selector.exists('div p'))

    def test_has_text(self):
        container = uicontainer.blocklist.BlocklistItem(text='test').bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('div p').alltext_normalized, 'test')


class TestBlocklistItemWarning(test.TestCase):
    def test_sanity(self):
        container = uicontainer.blocklist.BlocklistItemWarning()
        self.assertEqual(container.variant, uicontainer.blocklist.BlocklistItem.VARIANT_WARNING)


class TestBlocklistItemSuccess(test.TestCase):
    def test_sanity(self):
        container = uicontainer.blocklist.BlocklistItemSuccess()
        self.assertEqual(container.variant, uicontainer.blocklist.BlocklistItem.VARIANT_SUCCESS)


class TestBlocklistItemInfo(test.TestCase):
    def test_sanity(self):
        container = uicontainer.blocklist.BlocklistItemInfo()
        self.assertEqual(container.variant, uicontainer.blocklist.BlocklistItem.VARIANT_INFO)


class TestBlocklist(test.TestCase):
    def test_sanity(self):
        container = uicontainer.blocklist.Blocklist().bootstrap()
        selector = htmls.S(container.render())
        self.assertTrue(selector.exists('div'))

    def test_css_classes_no_variant(self):
        container = uicontainer.blocklist.Blocklist().bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('div')['class'], 'blocklist')

    def test_css_classes_variant_tight(self):
        container = uicontainer.blocklist.Blocklist(
            variant=uicontainer.blocklist.Blocklist.VARIANT_TIGHT).bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('div')['class'], 'blocklist  blocklist--tight')

    def test_with_children(self):
        container = uicontainer.blocklist.Blocklist(
            children=[
                uicontainer.blocklist.BlocklistItem(text='a'),
                uicontainer.blocklist.BlocklistItem(text='b'),
            ]
        ).bootstrap()
        selector = htmls.S(container.render())
        child_text = [child.alltext_normalized for child in selector.list('.blocklist__item')]
        self.assertEqual(child_text[0], 'a')
        self.assertEqual(child_text[1], 'b')
