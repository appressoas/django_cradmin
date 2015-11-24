from __future__ import unicode_literals
from django.test import TestCase
import htmls

from django_cradmin.viewhelpers import listfilter

from future import standard_library
standard_library.install_aliases()


class MinimalFilterGroupChild(listfilter.base.AbstractGroupChild):
    template_name = 'cradmin_viewhelpers_testapp/listfilter/minimal-filtergroupchild.django.html'


class MinimalIntFilter(listfilter.base.AbstractFilter):
    template_name = 'cradmin_viewhelpers_testapp/listfilter/minimal-filtergroupchild.django.html'

    def get_slug(self):
        return 'i'

    def clean_value(self, value):
        return int(value)


class MinimalStringFilter(listfilter.base.AbstractFilter):
    template_name = 'cradmin_viewhelpers_testapp/listfilter/minimal-filtergroupchild.django.html'

    def get_slug(self):
        return 's'


class TestFiltersStringParser(TestCase):
    def test_invalid_filter_string(self):
        filtershandler = listfilter.base.FiltersHandler()
        with self.assertRaisesMessage(listfilter.base.InvalidFiltersStringError,
                                      '"x" does not contain "-".'):
            filtershandler.parse('x')

    def test_invalid_filter_slug(self):
        filtershandler = listfilter.base.FiltersHandler()
        with self.assertRaisesMessage(listfilter.base.InvalidFiltersStringError,
                                      '"x" is not a valid filter slug.'):
            filtershandler.parse('x-10')

    def test_parse_empty_string(self):
        filtershandler = listfilter.base.FiltersHandler()
        filtershandler.parse('')
        self.assertEqual(
            {},
            filtershandler.filtermap)

    def test_parse_none(self):
        filtershandler = listfilter.base.FiltersHandler()
        filtershandler.parse(None)
        self.assertEqual(
            {},
            filtershandler.filtermap)

    def test_parse_simple_valid_filter_string(self):
        filtershandler = listfilter.base.FiltersHandler()
        filtershandler.add_filter(MinimalStringFilter())
        filtershandler.parse('s-test')
        self.assertEqual(
            ['test'],
            filtershandler.filtermap['s'].values)

    def test_parse_multivalue_valid_filter_string(self):
        filtershandler = listfilter.base.FiltersHandler()
        filtershandler.add_filter(MinimalStringFilter())
        filtershandler.parse('s-a,b,c')
        self.assertEqual(
            ['a', 'b', 'c'],
            filtershandler.filtermap['s'].values)

    def test_parse_simple_valid_filter_string_trailing_slash(self):
        filtershandler = listfilter.base.FiltersHandler()
        filtershandler.add_filter(MinimalStringFilter())
        filtershandler.parse('s-test/')
        self.assertEqual(
            ['test'],
            filtershandler.filtermap['s'].values)

    def test_parse_simple_valid_filter_string_leading_slash(self):
        filtershandler = listfilter.base.FiltersHandler()
        filtershandler.add_filter(MinimalStringFilter())
        filtershandler.parse('/s-test')
        self.assertEqual(
            ['test'],
            filtershandler.filtermap['s'].values)

    def test_parse_complex_valid_filter_string(self):
        filtershandler = listfilter.base.FiltersHandler()
        filtershandler.add_filter(MinimalStringFilter())
        filtershandler.add_filter(MinimalIntFilter())
        filtershandler.parse('/i-10/s-jane,joe/')
        self.assertEqual(2, len(filtershandler.filtermap))
        self.assertEqual(
            ['10'],
            filtershandler.filtermap['i'].values)
        self.assertEqual(
            ['jane', 'joe'],
            filtershandler.filtermap['s'].values)


class TestAbstractFilterGroup(TestCase):
    def test_append(self):
        testgroup = listfilter.base.Group()
        testchild = MinimalFilterGroupChild()
        testgroup.append(testchild)
        self.assertEqual([testchild], testgroup.children)
        self.assertEqual(testgroup, testchild.parentgroup)

    def test_render(self):
        testgroup = listfilter.base.Group()
        testgroup.append(MinimalFilterGroupChild())
        testgroup.append(MinimalFilterGroupChild())
        selector = htmls.S(testgroup.render())
        self.assertEqual(2, selector.count('li'))

    def test_set_filters_string_invalid_slug(self):
        testgroup = listfilter.base.Group()
        stringfilter = MinimalStringFilter()
        testgroup.append(stringfilter)
        with self.assertRaisesMessage(listfilter.base.InvalidFiltersStringError,
                                      '"x" is not a valid filter slug.'):
            testgroup.set_filters_string('x-10')

    def test_set_filters_string(self):
        testgroup = listfilter.base.Group()
        intfilter = MinimalIntFilter()
        stringfilter = MinimalStringFilter()
        testgroup.append(intfilter)
        testgroup.append(stringfilter)
        testgroup.set_filters_string('i-10/s-test')
        self.assertEqual(['10'], intfilter.values)
        self.assertEqual([10], intfilter.cleaned_values)
        self.assertEqual(['test'], stringfilter.values)
        self.assertEqual(['test'], stringfilter.cleaned_values)
