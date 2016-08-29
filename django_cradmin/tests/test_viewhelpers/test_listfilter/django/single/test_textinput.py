from __future__ import unicode_literals

from django.test import TestCase
from future import standard_library
from model_mommy import mommy

from django_cradmin.tests.test_viewhelpers.cradmin_viewhelpers_testapp.models import FilterTestModel
from django_cradmin.viewhelpers import listfilter

standard_library.install_aliases()


class TestSearch(TestCase):
    def test_no_value(self):
        testfilter = listfilter.django.single.textinput.Search(
            slug='mycharfield',
            modelfields=['mycharfield', 'mytextfield'])
        testfilter.set_values(values=[])
        withvalue1 = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                                mycharfield='A testvalue')
        withvalue2 = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                                mytextfield='Another testvalue')
        emptyvalue = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                                mycharfield='')
        nullvalue = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                               mycharfield=None)
        self.assertEqual(
            {withvalue1, withvalue2, emptyvalue, nullvalue},
            set(testfilter.filter(queryobject=FilterTestModel.objects.all())))

    def test_matching_single(self):
        testfilter = listfilter.django.single.textinput.Search(
            slug='mycharfield',
            modelfields=['mycharfield', 'mytextfield'])
        testfilter.set_values(values=['Another'])
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   mycharfield='A testvalue')
        withvalue2 = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                                mytextfield='Another testvalue')
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   mycharfield='')
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   mycharfield=None)
        self.assertEqual(
            {withvalue2},
            set(testfilter.filter(queryobject=FilterTestModel.objects.all())))

    def test_matching_multiple(self):
        testfilter = listfilter.django.single.textinput.Search(
            slug='mycharfield',
            modelfields=['mycharfield', 'mytextfield'])
        testfilter.set_values(values=['testvalue'])
        withvalue1 = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                                mycharfield='A testvalue')
        withvalue2 = mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                                mytextfield='Another testvalue')
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   mycharfield='')
        mommy.make('cradmin_viewhelpers_testapp.FilterTestModel',
                   mycharfield=None)
        self.assertEqual(
            {withvalue1, withvalue2},
            set(testfilter.filter(queryobject=FilterTestModel.objects.all())))
