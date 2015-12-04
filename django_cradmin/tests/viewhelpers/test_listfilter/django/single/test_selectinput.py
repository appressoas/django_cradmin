from __future__ import unicode_literals

from unittest import mock

from django.test import TestCase
from future import standard_library
import htmls
from model_mommy import mommy
from django_cradmin import datetimeutils

from django_cradmin.tests.viewhelpers.cradmin_viewhelpers_testapp.models import FilterTestModel
from django_cradmin.viewhelpers import listfilter

standard_library.install_aliases()


class TestBase(TestCase):
    def test_render_sanity(self):
        class MySelectFilter(listfilter.django.single.selectinput.AbstractSelectFilter):
            def get_choices(self):
                return [
                    ('', 'Do not apply'),
                    ('first', 'First choice'),
                    ('second', 'Second choice'),
                ]

        testfilter = MySelectFilter(slug='test')
        filterlist = listfilter.base.AbstractFilterList(urlbuilder=mock.MagicMock())
        filterlist.append(testfilter)
        selector = htmls.S(testfilter.render())
        self.assertTrue(selector.exists('#django_cradmin_listfilter_test.django-cradmin-listfilter-filter'))
        self.assertTrue(selector.exists('select#django_cradmin_listfilter_test_select'))
        self.assertEqual(3, selector.count('option'))

    def test_render_option_value_empty(self):
        class MySelectFilter(listfilter.django.single.selectinput.AbstractSelectFilter):
            def get_choices(self):
                return [
                    ('', 'Do not apply'),
                ]

        testfilter = MySelectFilter(slug='test')
        filterlist = listfilter.base.AbstractFilterList(
            urlbuilder=lambda filters_string: '/test/{}'.format(filters_string))
        filterlist.append(testfilter)
        selector = htmls.S(testfilter.render())
        self.assertEqual('/test/', selector.one('option')['value'])

    def test_render_option_value_nonempty(self):
        class MySelectFilter(listfilter.django.single.selectinput.AbstractSelectFilter):
            def get_choices(self):
                return [
                    ('somevalue', 'Test'),
                ]

        testfilter = MySelectFilter(slug='test')
        filterlist = listfilter.base.AbstractFilterList(
            urlbuilder=lambda filters_string: '/test/{}'.format(filters_string))
        filterlist.append(testfilter)
        selector = htmls.S(testfilter.render())
        self.assertEqual('/test/test-somevalue', selector.one('option')['value'])

    def test_render_option_label(self):
        class MySelectFilter(listfilter.django.single.selectinput.AbstractSelectFilter):
            def get_choices(self):
                return [
                    ('somevalue', 'Test'),
                ]

        testfilter = MySelectFilter(slug='test')
        filterlist = listfilter.base.AbstractFilterList(urlbuilder=mock.MagicMock())
        filterlist.append(testfilter)
        selector = htmls.S(testfilter.render())
        self.assertEqual('Test', selector.one('option').alltext_normalized)

    def test_render_option_selected(self):
        class MySelectFilter(listfilter.django.single.selectinput.AbstractSelectFilter):
            def get_choices(self):
                return [
                    ('', 'Do not apply'),
                    ('first', 'First choice'),
                    ('second', 'Second choice'),
                ]

        testfilter = MySelectFilter(slug='test')
        testfilter.set_values(values=['first'])
        filterlist = listfilter.base.AbstractFilterList(urlbuilder=mock.MagicMock())
        filterlist.append(testfilter)
        selector = htmls.S(testfilter.render())
        self.assertEqual(
            'First choice',
            selector.one('option[selected]').alltext_normalized)

    def test_render_option_no_value_select_first(self):
        class MySelectFilter(listfilter.django.single.selectinput.AbstractSelectFilter):
            def get_choices(self):
                return [
                    ('', 'Do not apply'),
                    ('first', 'First choice'),
                    ('second', 'Second choice'),
                ]

        testfilter = MySelectFilter(slug='test')
        testfilter.set_values(values=[])
        filterlist = listfilter.base.AbstractFilterList(urlbuilder=mock.MagicMock())
        filterlist.append(testfilter)
        selector = htmls.S(testfilter.render())
        self.assertEqual(
            'Do not apply',
            selector.one('option[selected]').alltext_normalized)

    def test_render_label_no_title(self):
        class MySelectFilter(listfilter.django.single.selectinput.AbstractSelectFilter):
            def get_choices(self):
                return [
                    ('unused', 'unused'),
                ]

        testfilter = MySelectFilter(slug='test')
        filterlist = listfilter.base.AbstractFilterList(urlbuilder=mock.MagicMock())
        filterlist.append(testfilter)
        selector = htmls.S(testfilter.render())
        self.assertFalse(selector.exists('label'))

    def test_render_label_has_title(self):
        class MySelectFilter(listfilter.django.single.selectinput.AbstractSelectFilter):
            def get_choices(self):
                return [
                    ('unused', 'unused'),
                ]

        testfilter = MySelectFilter(slug='test', title='A title')
        filterlist = listfilter.base.AbstractFilterList(urlbuilder=mock.MagicMock())
        filterlist.append(testfilter)
        selector = htmls.S(testfilter.render())
        self.assertEqual('A title', selector.one('label').alltext_normalized)
        self.assertEqual('django_cradmin_listfilter_test_select', selector.one('label')['for'])

    def test_render_label_get_label_is_screenreader_only_true(self):
        class MySelectFilter(listfilter.django.single.selectinput.AbstractSelectFilter):
            def get_choices(self):
                return [
                    ('unused', 'unused'),
                ]

            def get_label_is_screenreader_only(self):
                return True

        testfilter = MySelectFilter(slug='test', title='A title')
        filterlist = listfilter.base.AbstractFilterList(urlbuilder=mock.MagicMock())
        filterlist.append(testfilter)
        selector = htmls.S(testfilter.render())
        self.assertTrue(selector.exists('label'))
        self.assertTrue(selector.one('label').hasclass('sr-only'))


class TestBoolean(TestCase):
    def test_no_value(self):
        testfilter = listfilter.django.single.selectinput.Boolean(slug='mycharfield')
        testfilter.set_values(values=[])
        withvalue = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                               mycharfield='A testvalue')
        emptyvalue = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                                mycharfield='')
        nullvalue = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                               mycharfield=None)
        self.assertEqual(
            {withvalue, emptyvalue, nullvalue},
            set(testfilter.filter(queryobject=FilterTestModel.objects.all())))

    def test_invalid_value(self):
        testfilter = listfilter.django.single.selectinput.Boolean(slug='mycharfield')
        testfilter.set_values(values=['invalidstuff'])
        withvalue = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                               mycharfield='A testvalue')
        emptyvalue = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                                mycharfield='')
        nullvalue = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                               mycharfield=None)
        self.assertEqual(
            {withvalue, emptyvalue, nullvalue},
            set(testfilter.filter(queryobject=FilterTestModel.objects.all())))

    def test_false_charfield(self):
        testfilter = listfilter.django.single.selectinput.Boolean(slug='mycharfield')
        testfilter.set_values(values=['false'])
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   mycharfield='A testvalue')
        emptyvalue = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                                mycharfield='')
        nullvalue = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                               mycharfield=None)
        self.assertEqual(
            {emptyvalue, nullvalue},
            set(testfilter.filter(queryobject=FilterTestModel.objects.all())))

    def test_true_charfield(self):
        testfilter = listfilter.django.single.selectinput.Boolean(slug='mycharfield')
        testfilter.set_values(values=['true'])
        withvalue = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                               mycharfield='A testvalue')
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   mycharfield='')
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   mycharfield=None)
        self.assertEqual(
            {withvalue},
            set(testfilter.filter(queryobject=FilterTestModel.objects.all())))

    def test_false_booleanfield(self):
        testfilter = listfilter.django.single.selectinput.Boolean(slug='mybooleanfield')
        testfilter.set_values(values=['false'])
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   mybooleanfield=True)
        falsevalue = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                                mybooleanfield=False)
        self.assertEqual(
            {falsevalue},
            set(testfilter.filter(queryobject=FilterTestModel.objects.all())))

    def test_true_booleanfield(self):
        testfilter = listfilter.django.single.selectinput.Boolean(slug='mybooleanfield')
        testfilter.set_values(values=['true'])
        truevalue = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                               mybooleanfield=True)
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   mybooleanfield=False)
        self.assertEqual(
            {truevalue},
            set(testfilter.filter(queryobject=FilterTestModel.objects.all())))


class TestIsNotNull(TestCase):
    def test_false(self):
        testfilter = listfilter.django.single.selectinput.IsNotNull(slug='myintnullfield')
        testfilter.set_values(values=['false'])
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   myintnullfield=10)
        nullvalue = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                               myintnullfield=None)
        self.assertEqual(
            {nullvalue},
            set(testfilter.filter(queryobject=FilterTestModel.objects.all())))

    def test_true(self):
        testfilter = listfilter.django.single.selectinput.IsNotNull(slug='myintnullfield')
        testfilter.set_values(values=['true'])
        withvalue = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                               myintnullfield=10)
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   myintnullfield=None)
        self.assertEqual(
            {withvalue},
            set(testfilter.filter(queryobject=FilterTestModel.objects.all())))

    def test_true_zero(self):
        testfilter = listfilter.django.single.selectinput.IsNotNull(slug='myintnullfield')
        testfilter.set_values(values=['true'])
        withvalue = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                               myintnullfield=0)
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   myintnullfield=None)
        self.assertEqual(
            {withvalue},
            set(testfilter.filter(queryobject=FilterTestModel.objects.all())))


class TestDateTime(TestCase):
    def test_no_value(self):
        testfilter = listfilter.django.single.selectinput.DateTime(slug='mydatetimefield')
        testfilter.set_values(values=[])
        testitem = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel')
        self.assertEqual(
            {testitem},
            set(testfilter.filter(queryobject=FilterTestModel.objects.all())))

    def test_invalid_value(self):
        testfilter = listfilter.django.single.selectinput.DateTime(slug='mydatetimefield')
        testfilter.set_values(values=['invalidstuff'])
        testitem = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel')
        self.assertEqual(
            {testitem},
            set(testfilter.filter(queryobject=FilterTestModel.objects.all())))

    def test_today_nomatch(self):
        testfilter = listfilter.django.single.selectinput.DateTime(slug='mydatetimefield')
        testfilter.set_values(values=['today'])
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   mydatetimefield=datetimeutils.default_timezone_datetime(2015, 1, 1))
        with mock.patch('django_cradmin.viewhelpers.listfilter.django.single.selectinput.timezone.now',
                        lambda: datetimeutils.default_timezone_datetime(2015, 1, 2)):
            self.assertFalse(
                testfilter.filter(queryobject=FilterTestModel.objects.all()).exists())

    def test_today_match(self):
        testfilter = listfilter.django.single.selectinput.DateTime(slug='mydatetimefield')
        testfilter.set_values(values=['today'])
        testitem = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                              mydatetimefield=datetimeutils.default_timezone_datetime(2015, 1, 1))
        with mock.patch('django_cradmin.viewhelpers.listfilter.django.single.selectinput.timezone.now',
                        lambda: datetimeutils.default_timezone_datetime(2015, 1, 1, 12, 30)):
            self.assertEqual(
                {testitem},
                set(testfilter.filter(queryobject=FilterTestModel.objects.all())))

    def test_yesterday_nomatch(self):
        testfilter = listfilter.django.single.selectinput.DateTime(slug='mydatetimefield')
        testfilter.set_values(values=['yesterday'])
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   mydatetimefield=datetimeutils.default_timezone_datetime(2015, 1, 10))
        with mock.patch('django_cradmin.viewhelpers.listfilter.django.single.selectinput.timezone.now',
                        lambda: datetimeutils.default_timezone_datetime(2015, 1, 12)):
            self.assertFalse(
                testfilter.filter(queryobject=FilterTestModel.objects.all()).exists())

    def test_yesterday_match(self):
        testfilter = listfilter.django.single.selectinput.DateTime(slug='mydatetimefield')
        testfilter.set_values(values=['yesterday'])
        testitem = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                              mydatetimefield=datetimeutils.default_timezone_datetime(2015, 1, 10))
        with mock.patch('django_cradmin.viewhelpers.listfilter.django.single.selectinput.timezone.now',
                        lambda: datetimeutils.default_timezone_datetime(2015, 1, 11, 12, 30)):
            self.assertEqual(
                {testitem},
                set(testfilter.filter(queryobject=FilterTestModel.objects.all())))

    def test_last_seven_days_nomatch(self):
        testfilter = listfilter.django.single.selectinput.DateTime(slug='mydatetimefield')
        testfilter.set_values(values=['last_seven_days'])
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   mydatetimefield=datetimeutils.default_timezone_datetime(2015, 1, 2))
        with mock.patch('django_cradmin.viewhelpers.listfilter.django.single.selectinput.timezone.now',
                        lambda: datetimeutils.default_timezone_datetime(2015, 1, 10, 12, 30)):
            self.assertFalse(
                testfilter.filter(queryobject=FilterTestModel.objects.all()).exists())

    def test_last_seven_days_match(self):
        testfilter = listfilter.django.single.selectinput.DateTime(slug='mydatetimefield')
        testfilter.set_values(values=['last_seven_days'])
        testitem = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                              mydatetimefield=datetimeutils.default_timezone_datetime(2015, 1, 3))
        with mock.patch('django_cradmin.viewhelpers.listfilter.django.single.selectinput.timezone.now',
                        lambda: datetimeutils.default_timezone_datetime(2015, 1, 10, 12, 30)):
            self.assertEqual(
                {testitem},
                set(testfilter.filter(queryobject=FilterTestModel.objects.all())))

    def test_this_week_nomatch(self):
        testfilter = listfilter.django.single.selectinput.DateTime(slug='mydatetimefield')
        testfilter.set_values(values=['this_week'])
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   mydatetimefield=datetimeutils.default_timezone_datetime(2015, 11, 29))
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   mydatetimefield=datetimeutils.default_timezone_datetime(2015, 12, 7))
        with mock.patch('django_cradmin.viewhelpers.listfilter.django.single.selectinput.timezone.now',
                        lambda: datetimeutils.default_timezone_datetime(2015, 12, 1, 12, 30)):
            self.assertFalse(
                testfilter.filter(queryobject=FilterTestModel.objects.all()).exists())

    def test_this_week_match(self):
        testfilter = listfilter.django.single.selectinput.DateTime(slug='mydatetimefield')
        testfilter.set_values(values=['this_week'])
        start_of_week = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                                   mydatetimefield=datetimeutils.default_timezone_datetime(2015, 11, 30))
        end_of_week = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                                 mydatetimefield=datetimeutils.default_timezone_datetime(2015, 12, 6, 23))
        with mock.patch('django_cradmin.viewhelpers.listfilter.django.single.selectinput.timezone.now',
                        lambda: datetimeutils.default_timezone_datetime(2015, 12, 1, 12, 30)):
            self.assertEqual(
                {start_of_week, end_of_week},
                set(testfilter.filter(queryobject=FilterTestModel.objects.all())))

    def test_this_month_nomatch(self):
        testfilter = listfilter.django.single.selectinput.DateTime(slug='mydatetimefield')
        testfilter.set_values(values=['this_month'])
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   mydatetimefield=datetimeutils.default_timezone_datetime(2015, 11, 29))
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   mydatetimefield=datetimeutils.default_timezone_datetime(2016, 1, 1))
        with mock.patch('django_cradmin.viewhelpers.listfilter.django.single.selectinput.timezone.now',
                        lambda: datetimeutils.default_timezone_datetime(2015, 12, 7, 12, 30)):
            self.assertFalse(
                testfilter.filter(queryobject=FilterTestModel.objects.all()).exists())

    def test_this_month_match(self):
        testfilter = listfilter.django.single.selectinput.DateTime(slug='mydatetimefield')
        testfilter.set_values(values=['this_month'])
        start_of_month = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                                    mydatetimefield=datetimeutils.default_timezone_datetime(2015, 12, 1))
        middle_of_month = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                                     mydatetimefield=datetimeutils.default_timezone_datetime(2015, 12, 24))
        end_of_month = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                                  mydatetimefield=datetimeutils.default_timezone_datetime(2015, 12, 31, 23))
        with mock.patch('django_cradmin.viewhelpers.listfilter.django.single.selectinput.timezone.now',
                        lambda: datetimeutils.default_timezone_datetime(2015, 12, 7, 12, 30)):
            self.assertEqual(
                {start_of_month, middle_of_month, end_of_month},
                set(testfilter.filter(queryobject=FilterTestModel.objects.all())))

    def test_this_year_nomatch(self):
        testfilter = listfilter.django.single.selectinput.DateTime(slug='mydatetimefield')
        testfilter.set_values(values=['this_year'])
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   mydatetimefield=datetimeutils.default_timezone_datetime(2014, 12, 31))
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   mydatetimefield=datetimeutils.default_timezone_datetime(2016, 1, 1))
        with mock.patch('django_cradmin.viewhelpers.listfilter.django.single.selectinput.timezone.now',
                        lambda: datetimeutils.default_timezone_datetime(2015, 12, 24)):
            self.assertFalse(
                testfilter.filter(queryobject=FilterTestModel.objects.all()).exists())

    def test_this_year_match(self):
        testfilter = listfilter.django.single.selectinput.DateTime(slug='mydatetimefield')
        testfilter.set_values(values=['this_year'])
        start_of_year = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                                   mydatetimefield=datetimeutils.default_timezone_datetime(2015, 1, 1))
        middle_of_year = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                                    mydatetimefield=datetimeutils.default_timezone_datetime(2015, 6, 1))
        end_of_year = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                                 mydatetimefield=datetimeutils.default_timezone_datetime(2015, 12, 31, 23))
        with mock.patch('django_cradmin.viewhelpers.listfilter.django.single.selectinput.timezone.now',
                        lambda: datetimeutils.default_timezone_datetime(2015, 12, 24)):
            self.assertEqual(
                {start_of_year, middle_of_year, end_of_year},
                set(testfilter.filter(queryobject=FilterTestModel.objects.all())))


class TestOrderBy(TestCase):
    def test_invalid_value(self):
        class OrderByFilter(listfilter.django.single.selectinput.AbstractOrderBy):
            def get_ordering_options(self):
                return []

        testfilter = OrderByFilter(slug='orderby')
        testfilter.set_values(values=['invalidstuff'])
        testitem = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel')
        self.assertEqual(
            {testitem},
            set(testfilter.filter(queryobject=FilterTestModel.objects.all())))

    def test_no_value_defaults_to_the_empty_value(self):
        class OrderByFilter(listfilter.django.single.selectinput.AbstractOrderBy):
            def get_ordering_options(self):
                return [
                        ('', {
                            'label': 'mylabel',
                            'order_by': ['mydatetimefield'],
                        }),
                ]

        testfilter = OrderByFilter(slug='orderby')
        testfilter.set_values(values=[])
        testitem2 = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                               mydatetimefield=datetimeutils.default_timezone_datetime(2016, 1, 2))
        testitem1 = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                               mydatetimefield=datetimeutils.default_timezone_datetime(2015, 1, 2))
        self.assertEqual(
            [testitem1, testitem2],
            list(testfilter.filter(queryobject=FilterTestModel.objects.all())))

    def test_nondefault_value(self):
        class OrderByFilter(listfilter.django.single.selectinput.AbstractOrderBy):
            def get_ordering_options(self):
                return [
                        ('', {
                            'label': 'asc',
                            'order_by': ['mydatetimefield'],
                        }),
                        ('desc', {
                            'label': 'desc',
                            'order_by': ['-mydatetimefield'],
                        }),
                ]

        testfilter = OrderByFilter(slug='orderby')
        testfilter.set_values(values=['desc'])
        testitem2 = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                               mydatetimefield=datetimeutils.default_timezone_datetime(2016, 1, 2))
        testitem1 = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                               mydatetimefield=datetimeutils.default_timezone_datetime(2015, 1, 2))
        self.assertEqual(
            [testitem2, testitem1],
            list(testfilter.filter(queryobject=FilterTestModel.objects.all())))
