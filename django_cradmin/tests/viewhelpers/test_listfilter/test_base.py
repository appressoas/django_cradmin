from __future__ import unicode_literals
from django.test import TestCase
import htmls
import mock
from model_mommy import mommy
from django_cradmin.tests.viewhelpers.cradmin_viewhelpers_testapp.models import FilterTestModel

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


class TestFiltersHandler(TestCase):
    def test_split_raw_filter_values(self):
        filtershandler = listfilter.base.FiltersHandler(urlbuilder=mock.MagicMock())
        self.assertEqual(
            ['a/b', 'c,d'],
            filtershandler.split_raw_filter_values('a%252Fb%2Cc%252Cd'))

    def test_join_filter_values(self):
        filtershandler = listfilter.base.FiltersHandler(urlbuilder=mock.MagicMock())
        self.assertEqual(
            'a%252Fb%2Cc%252Cd',
            filtershandler.join_filter_values(['a/b', 'c,d']))

    def test_invalid_filter_string(self):
        filtershandler = listfilter.base.FiltersHandler(urlbuilder=mock.MagicMock())
        with self.assertRaisesMessage(listfilter.base.InvalidFiltersStringError,
                                      '"x" does not contain "-".'):
            filtershandler.parse('x')

    def test_invalid_filter_slug(self):
        filtershandler = listfilter.base.FiltersHandler(urlbuilder=mock.MagicMock())
        with self.assertRaisesMessage(listfilter.base.InvalidFiltersStringError,
                                      '"x" is not a valid filter slug.'):
            filtershandler.parse('x-10')

    def test_add_filter_duplicate_filter_slug(self):
        filtershandler = listfilter.base.FiltersHandler(urlbuilder=mock.MagicMock())
        filtershandler.add_filter(listfilter.base.AbstractFilter(slug='x'))
        with self.assertRaisesMessage(ValueError,
                                      'Duplicate slug: "x".'):
            filtershandler.add_filter(listfilter.base.AbstractFilter(slug='x'))

    def test_add_filter_invalid_filter_slug(self):
        filtershandler = listfilter.base.FiltersHandler(urlbuilder=mock.MagicMock())
        with self.assertRaisesMessage(ValueError,
                                      'Invalid filter slug: "x-y". Slugs can not contain "-".'):
            filtershandler.add_filter(listfilter.base.AbstractFilter(slug='x-y'))

    def test_parse_empty_string(self):
        filtershandler = listfilter.base.FiltersHandler(urlbuilder=mock.MagicMock())
        filtershandler.parse('')
        self.assertEqual(
            {},
            filtershandler.filtermap)

    def test_parse_none(self):
        filtershandler = listfilter.base.FiltersHandler(urlbuilder=mock.MagicMock())
        filtershandler.parse(None)
        self.assertEqual(
            {},
            filtershandler.filtermap)

    def test_parse_simple_valid_filter_string(self):
        filtershandler = listfilter.base.FiltersHandler(urlbuilder=mock.MagicMock())
        filtershandler.add_filter(MinimalStringFilter())
        filtershandler.parse('s-test')
        self.assertEqual(
            ['test'],
            filtershandler.filtermap['s'].values)

    def test_parse_multivalue_valid_filter_string(self):
        filtershandler = listfilter.base.FiltersHandler(urlbuilder=mock.MagicMock())
        filtershandler.add_filter(MinimalStringFilter())
        filtershandler.parse('s-a,b,c')
        self.assertEqual(
            ['a', 'b', 'c'],
            filtershandler.filtermap['s'].values)

    def test_parse_simple_valid_filter_string_trailing_slash(self):
        filtershandler = listfilter.base.FiltersHandler(urlbuilder=mock.MagicMock())
        filtershandler.add_filter(MinimalStringFilter())
        filtershandler.parse('s-test/')
        self.assertEqual(
            ['test'],
            filtershandler.filtermap['s'].values)

    def test_parse_simple_valid_filter_string_leading_slash(self):
        filtershandler = listfilter.base.FiltersHandler(urlbuilder=mock.MagicMock())
        filtershandler.add_filter(MinimalStringFilter())
        filtershandler.parse('/s-test')
        self.assertEqual(
            ['test'],
            filtershandler.filtermap['s'].values)

    def test_parse_complex_valid_filter_string(self):
        filtershandler = listfilter.base.FiltersHandler(urlbuilder=mock.MagicMock())
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

    def test_build_filters_string(self):
        filtershandler = listfilter.base.FiltersHandler(urlbuilder=mock.MagicMock())
        intfilter = MinimalIntFilter()
        intfilter.set_values(values=['10'])
        stringfilter = MinimalStringFilter()
        stringfilter.set_values(values=['jane', 'joe'])
        filtershandler.add_filter(intfilter)
        filtershandler.add_filter(stringfilter)

        new_stringfilter = stringfilter.copy()
        new_stringfilter.set_values(values=['jack', 'peter'])
        self.assertEqual(
            'i-10/s-jack%2Cpeter',
            filtershandler.build_filters_string(changed_filterobject=new_stringfilter))

    def test_build_filter_url(self):
        def urlbuilder(filters_string):
            return '/the/prefix/{}?a=querystring'.format(filters_string)

        filtershandler = listfilter.base.FiltersHandler(urlbuilder=urlbuilder)
        intfilter = MinimalIntFilter()
        intfilter.set_values(values=['10'])
        stringfilter = MinimalStringFilter()
        stringfilter.set_values(values=['jane', 'joe'])
        filtershandler.add_filter(intfilter)
        filtershandler.add_filter(stringfilter)

        new_stringfilter = stringfilter.copy()
        new_stringfilter.set_values(values=['jack', 'peter'])
        self.assertEqual(
            '/the/prefix/i-10/s-jack%2Cpeter?a=querystring',
            filtershandler.build_filter_url(changed_filterobject=new_stringfilter))

    def test_filter(self):
        class FilterOne(listfilter.base.AbstractFilter):
            def filter(self, queryobject):
                return queryobject.filter(mycharfield='test')

        class FilterTwo(listfilter.base.AbstractFilter):
            def filter(self, queryobject):
                return queryobject.filter(mybooleanfield=True)

        match = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                           mycharfield='test', mybooleanfield=True)
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   mycharfield='no match', mybooleanfield=True)
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   mycharfield='test', mybooleanfield=False)

        filtershandler = listfilter.base.FiltersHandler(urlbuilder=mock.MagicMock())
        filtershandler.add_filter(FilterOne(slug='filterone'))
        filtershandler.add_filter(FilterTwo(slug='filtertwo'))
        queryset = filtershandler.filter(FilterTestModel.objects.all())
        self.assertEqual({match},
                         set(queryset))


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

    def test_copy_include_title(self):
        testfilter = MinimalStringFilter(title='testtitle')
        self.assertEqual('testtitle', testfilter.copy().title)

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
        class SimpleFilter(listfilter.base.AbstractFilter):
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
        filterlist = listfilter.base.AbstractFilterList(
            urlbuilder=lambda filters_string: '/test/{}'.format(filters_string))
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
        filterlist = listfilter.base.AbstractFilterList(
            urlbuilder=lambda filters_string: '/test/{}'.format(filters_string))
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
        filterlist = listfilter.base.AbstractFilterList(
            urlbuilder=lambda filters_string: '/test/{}'.format(filters_string))
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
        filterlist = listfilter.base.AbstractFilterList(
            urlbuilder=lambda filters_string: '/test/{}'.format(filters_string))
        filterlist.append(stringfilter)
        filterlist.append(intfilter)
        stringfilter.set_filterlist(filterlist)
        self.assertEqual(
            '/test/s-b/i-10',
            stringfilter.build_remove_values_url(values=['a']))

    def test_render(self):
        stringfilter = listfilter.base.AbstractFilter(slug='test')
        stringfilter.set_filterlist(mock.MagicMock())
        selector = htmls.S(stringfilter.render())
        self.assertTrue(selector.exists('.django-cradmin-listfilter-filter'))


class TestAbstractFilterList(TestCase):
    def test_append(self):
        filterlist = listfilter.base.AbstractFilterList(urlbuilder=mock.MagicMock())
        testchild = MinimalFilterGroupChild()
        filterlist.append(testchild)
        self.assertEqual([testchild], filterlist.children)
        self.assertEqual(filterlist, testchild.filterlist)

    def test_render(self):
        filterlist = listfilter.base.AbstractFilterList(urlbuilder=mock.MagicMock())
        filterlist.append(MinimalFilterGroupChild())
        filterlist.append(MinimalFilterGroupChild())
        selector = htmls.S(filterlist.render())
        self.assertEqual(2, selector.count('li'))

    def test_set_filters_string_invalid_slug(self):
        filterlist = listfilter.base.AbstractFilterList(urlbuilder=mock.MagicMock())
        stringfilter = MinimalStringFilter()
        filterlist.append(stringfilter)
        with self.assertRaisesMessage(listfilter.base.InvalidFiltersStringError,
                                      '"x" is not a valid filter slug.'):
            filterlist.set_filters_string('x-10')

    def test_set_filters_string(self):
        filterlist = listfilter.base.AbstractFilterList(urlbuilder=mock.MagicMock())
        intfilter = MinimalIntFilter()
        stringfilter = MinimalStringFilter()
        filterlist.append(intfilter)
        filterlist.append(stringfilter)
        filterlist.set_filters_string('i-10/s-test')
        self.assertEqual(['10'], intfilter.values)
        self.assertEqual(['test'], stringfilter.values)

    def test_filter(self):
        class FilterOne(listfilter.base.AbstractFilter):
            def filter(self, queryobject):
                return queryobject.filter(mycharfield='test')

        class FilterTwo(listfilter.base.AbstractFilter):
            def filter(self, queryobject):
                return queryobject.filter(mybooleanfield=True)

        match = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                           mycharfield='test', mybooleanfield=True)
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   mycharfield='no match', mybooleanfield=True)
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   mycharfield='test', mybooleanfield=False)

        filterlist = listfilter.base.AbstractFilterList(urlbuilder=mock.MagicMock())
        filterlist.append(FilterOne(slug='filterone'))
        filterlist.append(FilterTwo(slug='filtertwo'))
        queryset = filterlist.filter(FilterTestModel.objects.all())
        self.assertEqual({match},
                         set(queryset))
