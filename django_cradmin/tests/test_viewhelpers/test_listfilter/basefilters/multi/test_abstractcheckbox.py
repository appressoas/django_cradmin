from __future__ import unicode_literals

from django.test import TestCase
from future import standard_library
import htmls

from django_cradmin.python2_compatibility import mock
from django_cradmin.viewhelpers.listfilter.base.abstractfilterlist import AbstractFilterList
from django_cradmin.viewhelpers.listfilter.basefilters.multi.abstractcheckbox import AbstractCheckboxFilter

standard_library.install_aliases()


class TestAbstractCheckboxFilter(TestCase):
    def test_render_sanity(self):
        class MyChecboxFilter(AbstractCheckboxFilter):
            def get_choices(self):
                return [
                    ('first', 'First choice'),
                    ('second', 'Second choice'),
                    ('third', 'Third choice'),
                ]

        testfilter = MyChecboxFilter(slug='test')
        filterlist = AbstractFilterList(urlbuilder=mock.MagicMock(), target_dom_id='testdomid')
        filterlist.append(testfilter)
        selector = htmls.S(testfilter.render())
        self.assertTrue(selector.exists('#django_cradmin_listfilter_test.django-cradmin-listfilter-filter'))
        self.assertTrue(selector.exists('#django_cradmin_listfilter_test_input'))
        self.assertEqual(3, selector.count('input[type="checkbox"]'))

    def test_render_add_value_first(self):
        class MyChecboxFilter(AbstractCheckboxFilter):
            def get_choices(self):
                return [
                    ('first', 'First choice'),
                ]

        testfilter = MyChecboxFilter(slug='test')
        testfilter.set_values(values=[])
        filterlist = AbstractFilterList(
            urlbuilder=lambda filters_string: '/test/{}'.format(filters_string),
            target_dom_id='testdomid')
        filterlist.append(testfilter)
        selector = htmls.S(testfilter.render())
        self.assertEqual('/test/test-first', selector.one('input[type="checkbox"]')['data-url'])

    def test_render_add_value_multiple(self):
        class MyChecboxFilter(AbstractCheckboxFilter):
            def get_choices(self):
                return [
                    ('first', 'First choice'),
                    ('second', 'Second choice'),
                    ('third', 'Third choice'),
                ]

        testfilter = MyChecboxFilter(slug='test')
        testfilter.set_values(values=['first', 'second'])
        filterlist = AbstractFilterList(
            urlbuilder=lambda filters_string: '/test/{}'.format(filters_string),
            target_dom_id='testdomid')
        filterlist.append(testfilter)
        selector = htmls.S(testfilter.render())
        self.assertEqual('/test/test-first%2Csecond%2Cthird',
                         selector.one('input#django_cradmin_listfilter_test_input_third')['data-url'])

    def test_render_remove_value_first(self):
        class MyChecboxFilter(AbstractCheckboxFilter):
            def get_choices(self):
                return [
                    ('first', 'First choice'),
                ]

        testfilter = MyChecboxFilter(slug='test')
        testfilter.set_values(values=['first'])
        filterlist = AbstractFilterList(
            urlbuilder=lambda filters_string: '/test/{}'.format(filters_string),
            target_dom_id='testdomid')
        filterlist.append(testfilter)
        selector = htmls.S(testfilter.render())
        self.assertEqual('/test/', selector.one('input[type="checkbox"]')['data-url'])

    def test_render_remove_value_multiple(self):
        class MyChecboxFilter(AbstractCheckboxFilter):
            def get_choices(self):
                return [
                    ('first', 'First choice'),
                    ('second', 'Second choice'),
                    ('third', 'Third choice'),
                ]

        testfilter = MyChecboxFilter(slug='test')
        testfilter.set_values(values=['first', 'second', 'third'])
        filterlist = AbstractFilterList(
            urlbuilder=lambda filters_string: '/test/{}'.format(filters_string),
            target_dom_id='testdomid')
        filterlist.append(testfilter)
        selector = htmls.S(testfilter.render())
        self.assertEqual('/test/test-first%2Cthird',
                         selector.one('input#django_cradmin_listfilter_test_input_second')['data-url'])

    def test_render_checkbox_label(self):
        class MyChecboxFilter(AbstractCheckboxFilter):
            def get_choices(self):
                return [
                    ('somevalue', 'Test'),
                ]

        testfilter = MyChecboxFilter(slug='test')
        filterlist = AbstractFilterList(urlbuilder=mock.MagicMock(), target_dom_id='testdomid')
        filterlist.append(testfilter)
        selector = htmls.S(testfilter.render())
        self.assertEqual(
            'Test',
            selector.one('#django_cradmin_listfilter_test_input_somevalue_wrapper').alltext_normalized)

    def test_render_checkbox_unchecked(self):
        class MyChecboxFilter(AbstractCheckboxFilter):
            def get_choices(self):
                return [
                    ('somevalue', 'Test'),
                ]

        testfilter = MyChecboxFilter(slug='test')
        testfilter.set_values(values=[])
        filterlist = AbstractFilterList(urlbuilder=mock.MagicMock(), target_dom_id='testdomid')
        filterlist.append(testfilter)
        selector = htmls.S(testfilter.render())
        self.assertFalse(
            selector.one('input[type="checkbox"]').hasattribute('checked'))

    def test_render_checkbox_checked(self):
        class MyChecboxFilter(AbstractCheckboxFilter):
            def get_choices(self):
                return [
                    ('somevalue', 'Test'),
                ]

        testfilter = MyChecboxFilter(slug='test')
        testfilter.set_values(values=['somevalue'])
        filterlist = AbstractFilterList(urlbuilder=mock.MagicMock(), target_dom_id='testdomid')
        filterlist.append(testfilter)
        selector = htmls.S(testfilter.render())
        self.assertTrue(
            selector.one('input[type="checkbox"]').hasattribute('checked'))

    def test_render_label_no_label(self):
        class MyChecboxFilter(AbstractCheckboxFilter):
            def get_choices(self):
                return [
                    ('unused', 'unused'),
                ]

        testfilter = MyChecboxFilter(slug='test')
        filterlist = AbstractFilterList(urlbuilder=mock.MagicMock(), target_dom_id='testdomid')
        filterlist.append(testfilter)
        selector = htmls.S(testfilter.render())
        self.assertFalse(selector.exists('label#django_cradmin_listfilter_test_label'))

    def test_render_label_has_label(self):
        class MyChecboxFilter(AbstractCheckboxFilter):
            def get_choices(self):
                return [
                    ('unused', 'unused'),
                ]

        testfilter = MyChecboxFilter(slug='test', label='A label')
        filterlist = AbstractFilterList(urlbuilder=mock.MagicMock(), target_dom_id='testdomid')
        filterlist.append(testfilter)
        selector = htmls.S(testfilter.render())
        self.assertEqual('A label',
                         selector.one('label#django_cradmin_listfilter_test_label').alltext_normalized)

    def test_render_label_get_label_is_screenreader_only_true(self):
        class MyChecboxFilter(AbstractCheckboxFilter):
            def get_choices(self):
                return [
                    ('unused', 'unused'),
                ]

            def get_label_is_screenreader_only(self):
                return True

        testfilter = MyChecboxFilter(slug='test', label='A label')
        filterlist = AbstractFilterList(urlbuilder=mock.MagicMock(), target_dom_id='testdomid')
        filterlist.append(testfilter)
        selector = htmls.S(testfilter.render())
        self.assertTrue(selector.exists('label#django_cradmin_listfilter_test_label'))
        self.assertTrue(selector.one('label#django_cradmin_listfilter_test_label').hasclass('screenreader-only'))
