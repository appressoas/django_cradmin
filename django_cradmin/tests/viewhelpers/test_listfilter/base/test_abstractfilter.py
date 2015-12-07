from __future__ import unicode_literals

from django.test import TestCase
import htmls
from django_cradmin.python2_compatibility import mock
from future import standard_library

from django_cradmin.viewhelpers.listfilter.base.abstractfilter import AbstractFilter
from django_cradmin.viewhelpers.listfilter.base.abstractfilterlist import AbstractFilterList

standard_library.install_aliases()


class MinimalIntFilter(AbstractFilter):
    template_name = 'cradmin_viewhelpers_testapp/listfilter/minimal-filtergroupchild.django.html'

    def get_slug(self):
        return 'i'

    def clean_value(self, value):
        return int(value)


class MinimalStringFilter(AbstractFilter):
    template_name = 'cradmin_viewhelpers_testapp/listfilter/minimal-filtergroupchild.django.html'

    def get_slug(self):
        return 's'


class TestAbstractFilter(TestCase):
    def test_copy_include_values(self):
        testfilter = MinimalStringFilter()
        testfilter.set_values(values=['a', 'b'])
        self.assertEqual(['a', 'b'], testfilter.copy().values)

    def test_copy_include_values_does_not_affect_original(self):
        testfilter = MinimalStringFilter()
        testfilter.set_values(values=['a', 'b'])
        copyfilter = testfilter.copy()
        copyfilter.values[0] = 'x'
        self.assertEqual(['a', 'b'], testfilter.values)
        self.assertEqual(['x', 'b'], copyfilter.values)

    def test_copy_include_slug(self):
        testfilter = MinimalStringFilter(slug='testslug')
        self.assertEqual('testslug', testfilter.copy().slug)

    def test_copy_include_label(self):
        testfilter = MinimalStringFilter(label='testlabel')
        self.assertEqual('testlabel', testfilter.copy().label)

    def test_set_values(self):
        testfilter = MinimalStringFilter()
        self.assertEqual([], testfilter.values)
        testfilter.set_values(values=['a', 'b'])
        self.assertEqual(['a', 'b'], testfilter.values)

    def test_clear_values(self):
        testfilter = MinimalStringFilter()
        testfilter.values = ['a']
        testfilter.clear_values()
        self.assertEqual([], testfilter.values)

    def test_add_values(self):
        testfilter = MinimalStringFilter()
        testfilter.values = ['a', 'b']
        testfilter.add_values(values=['c', 'd'])
        self.assertEqual(['a', 'b', 'c', 'd'], testfilter.values)

    def test_remove_values(self):
        testfilter = MinimalStringFilter()
        testfilter.values = ['a', 'b', 'c', 'd']
        testfilter.remove_values(values=['a', 'd'])
        self.assertEqual(['b', 'c'], testfilter.values)

    def test_remove_values_ignores_nonexisting_values(self):
        testfilter = MinimalStringFilter()
        testfilter.values = ['a', 'b']
        testfilter.remove_values(values=['doesnotexist', 'b'])
        self.assertEqual(['a'], testfilter.values)

    def test_get_cleaned_values(self):
        class SimpleFilter(AbstractFilter):
            def clean_value(self, value):
                return 'cleaned-' + value

        testfilter = SimpleFilter()
        testfilter.values = ['a', 'b']
        self.assertEqual(['cleaned-a', 'cleaned-b'], testfilter.get_cleaned_values())

    def test_build_add_values_url(self):
        stringfilter = MinimalStringFilter()
        stringfilter.set_values(values=['a', 'b'])
        intfilter = MinimalIntFilter()
        intfilter.set_values(values=['10'])
        filterlist = AbstractFilterList(
            urlbuilder=lambda filters_string: '/test/{}'.format(filters_string),
            target_dom_id='testdomid')
        filterlist.append(stringfilter)
        filterlist.append(intfilter)
        stringfilter.set_filterlist(filterlist)
        self.assertEqual(
            '/test/s-a%2Cb%2Cc/i-10',
            stringfilter.build_add_values_url(values=['c']))

    def test_build_clear_values_url(self):
        stringfilter = MinimalStringFilter()
        stringfilter.set_values(values=['a', 'b'])
        intfilter = MinimalIntFilter()
        intfilter.set_values(values=['10'])
        filterlist = AbstractFilterList(
            urlbuilder=lambda filters_string: '/test/{}'.format(filters_string),
            target_dom_id='testdomid')
        filterlist.append(stringfilter)
        filterlist.append(intfilter)
        stringfilter.set_filterlist(filterlist)
        self.assertEqual(
            '/test/i-10',
            stringfilter.build_clear_values_url())

    def test_build_set_values_url(self):
        stringfilter = MinimalStringFilter()
        stringfilter.set_values(values=['a', 'b'])
        intfilter = MinimalIntFilter()
        intfilter.set_values(values=['10'])
        filterlist = AbstractFilterList(
            urlbuilder=lambda filters_string: '/test/{}'.format(filters_string),
            target_dom_id='testdomid')
        filterlist.append(stringfilter)
        filterlist.append(intfilter)
        stringfilter.set_filterlist(filterlist)
        self.assertEqual(
            '/test/s-c/i-10',
            stringfilter.build_set_values_url(values=['c']))

    def test_build_remove_values_url(self):
        stringfilter = MinimalStringFilter()
        stringfilter.set_values(values=['a', 'b'])
        intfilter = MinimalIntFilter()
        intfilter.set_values(values=['10'])
        filterlist = AbstractFilterList(
            urlbuilder=lambda filters_string: '/test/{}'.format(filters_string),
            target_dom_id='testdomid')
        filterlist.append(stringfilter)
        filterlist.append(intfilter)
        stringfilter.set_filterlist(filterlist)
        self.assertEqual(
            '/test/s-b/i-10',
            stringfilter.build_remove_values_url(values=['a']))

    def test_render(self):
        stringfilter = AbstractFilter(slug='test')
        stringfilter.set_filterlist(mock.MagicMock())
        selector = htmls.S(stringfilter.render())
        self.assertTrue(selector.exists('.django-cradmin-listfilter-filter'))
