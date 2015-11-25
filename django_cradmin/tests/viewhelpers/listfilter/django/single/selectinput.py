from __future__ import unicode_literals

from django.test import TestCase
from future import standard_library
import htmls
from model_mommy import mommy
from unittest import mock
from django_cradmin.tests.viewhelpers.cradmin_viewhelpers_testapp.models import FilterTestModel

from django_cradmin.viewhelpers import listfilter
standard_library.install_aliases()


class TestBase(TestCase):
    def test_render_sanity(self):
        class MySelectFilter(listfilter.django.single.selectinput.Base):
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
        self.assertTrue(selector.exists('#django-cradmin-listfilter-test.django-cradmin-listfilter-filter'))
        self.assertTrue(selector.exists('select#django-cradmin-listfilter-test-select'))
        self.assertEqual(3, selector.count('option'))

    def test_render_option_value_empty(self):
        class MySelectFilter(listfilter.django.single.selectinput.Base):
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
        class MySelectFilter(listfilter.django.single.selectinput.Base):
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
        class MySelectFilter(listfilter.django.single.selectinput.Base):
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
        class MySelectFilter(listfilter.django.single.selectinput.Base):
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
        class MySelectFilter(listfilter.django.single.selectinput.Base):
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
        class MySelectFilter(listfilter.django.single.selectinput.Base):
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
        class MySelectFilter(listfilter.django.single.selectinput.Base):
            def get_choices(self):
                return [
                    ('unused', 'unused'),
                ]

        testfilter = MySelectFilter(slug='test', title='A title')
        filterlist = listfilter.base.AbstractFilterList(urlbuilder=mock.MagicMock())
        filterlist.append(testfilter)
        selector = htmls.S(testfilter.render())
        self.assertEqual('A title', selector.one('label').alltext_normalized)
        self.assertEqual('django-cradmin-listfilter-test-select', selector.one('label')['for'])


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
            set(testfilter.add_to_queryobject(queryobject=FilterTestModel.objects.all())))

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
            set(testfilter.add_to_queryobject(queryobject=FilterTestModel.objects.all())))

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
            set(testfilter.add_to_queryobject(queryobject=FilterTestModel.objects.all())))

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
            set(testfilter.add_to_queryobject(queryobject=FilterTestModel.objects.all())))

    def test_false_booleanfield(self):
        testfilter = listfilter.django.single.selectinput.Boolean(slug='mybooleanfield')
        testfilter.set_values(values=['false'])
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   mybooleanfield=True)
        falsevalue = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                                mybooleanfield=False)
        self.assertEqual(
            {falsevalue},
            set(testfilter.add_to_queryobject(queryobject=FilterTestModel.objects.all())))

    def test_true_booleanfield(self):
        testfilter = listfilter.django.single.selectinput.Boolean(slug='mybooleanfield')
        testfilter.set_values(values=['true'])
        truevalue = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                               mybooleanfield=True)
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   mybooleanfield=False)
        self.assertEqual(
            {truevalue},
            set(testfilter.add_to_queryobject(queryobject=FilterTestModel.objects.all())))
