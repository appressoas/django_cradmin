import datetime

import htmls
from django import test
from model_mommy import mommy

from django_cradmin import automodelform
from django_cradmin.tests.test_automodelform.cradmin_automodelform_testapp.models import AutoFormTestModel
from django_cradmin import datetimeutils


class TestModelForm(test.TestCase):
    def test_datetime_field_without_default_no_instance(self):
        class MyModelForm(automodelform.ModelForm):
            class Meta:
                model = AutoFormTestModel
                fields = ['datetimefield_without_default']

        selector = htmls.S(MyModelForm().as_ul())
        self.assertEqual(
            '',
            selector.one('input[type="text"][name="datetimefield_without_default"]').get('value', ''))
        self.assertTrue(selector.exists('.django-cradmin-datepicker-triggerbutton'))

    def test_datetime_field_without_default_with_instance(self):
        class MyModelForm(automodelform.ModelForm):
            class Meta:
                model = AutoFormTestModel
                fields = ['datetimefield_without_default']

        autoformtestmodelobject = mommy.make(
                'cradmin_automodelform_testapp.AutoFormTestModel',
                datetimefield_without_default=datetimeutils.default_timezone_datetime(2015, 12, 24, 12, 0, 0))
        selector = htmls.S(MyModelForm(instance=autoformtestmodelobject).as_ul())
        self.assertEqual(
            '2015-12-24 12:00:00',
            selector.one('input[type="text"][name="datetimefield_without_default"]')['value'])
        self.assertTrue(selector.exists('.django-cradmin-datepicker-triggerbutton'))

    def test_datetime_field_with_default_no_instance(self):
        class MyModelForm(automodelform.ModelForm):
            class Meta:
                model = AutoFormTestModel
                fields = ['datetimefield_with_default']

        selector = htmls.S(MyModelForm().as_ul())
        self.assertNotEqual(
            '',
            selector.one('input[type="text"][name="datetimefield_with_default"]')['value'])
        self.assertTrue(selector.exists('.django-cradmin-datepicker-triggerbutton'))

    def test_datetime_field_with_default_with_instance(self):
        class MyModelForm(automodelform.ModelForm):
            class Meta:
                model = AutoFormTestModel
                fields = ['datetimefield_with_default']

        autoformtestmodelobject = mommy.make(
                'cradmin_automodelform_testapp.AutoFormTestModel',
                datetimefield_with_default=datetimeutils.default_timezone_datetime(2015, 12, 24, 12, 0, 0))
        selector = htmls.S(MyModelForm(instance=autoformtestmodelobject).as_ul())
        self.assertEqual(
            '2015-12-24 12:00:00',
            selector.one('input[type="text"][name="datetimefield_with_default"]')['value'])
        self.assertTrue(selector.exists('.django-cradmin-datepicker-triggerbutton'))

    def test_date_field_without_default_no_instance(self):
        class MyModelForm(automodelform.ModelForm):
            class Meta:
                model = AutoFormTestModel
                fields = ['datefield_without_default']

        selector = htmls.S(MyModelForm().as_ul())
        self.assertEqual(
            '',
            selector.one('input[type="text"][name="datefield_without_default"]').get('value', ''))
        self.assertTrue(selector.exists('.django-cradmin-datepicker-triggerbutton'))

    def test_date_field_without_default_with_instance(self):
        class MyModelForm(automodelform.ModelForm):
            class Meta:
                model = AutoFormTestModel
                fields = ['datefield_without_default']

        autoformtestmodelobject = mommy.make(
                'cradmin_automodelform_testapp.AutoFormTestModel',
                datefield_without_default=datetime.date(2015, 12, 24))
        selector = htmls.S(MyModelForm(instance=autoformtestmodelobject).as_ul())
        self.assertEqual(
            '2015-12-24',
            selector.one('input[type="text"][name="datefield_without_default"]')['value'])
        self.assertTrue(selector.exists('.django-cradmin-datepicker-triggerbutton'))

    def test_date_field_with_default_no_instance(self):
        class MyModelForm(automodelform.ModelForm):
            class Meta:
                model = AutoFormTestModel
                fields = ['datefield_with_default']

        selector = htmls.S(MyModelForm().as_ul())
        self.assertNotEqual(
            '',
            selector.one('input[type="text"][name="datefield_with_default"]')['value'])
        self.assertTrue(selector.exists('.django-cradmin-datepicker-triggerbutton'))

    def test_date_field_with_default_with_instance(self):
        class MyModelForm(automodelform.ModelForm):
            class Meta:
                model = AutoFormTestModel
                fields = ['datefield_with_default']

        autoformtestmodelobject = mommy.make(
                'cradmin_automodelform_testapp.AutoFormTestModel',
                datefield_with_default=datetime.date(2015, 12, 24))
        selector = htmls.S(MyModelForm(instance=autoformtestmodelobject).as_ul())
        self.assertEqual(
            '2015-12-24',
            selector.one('input[type="text"][name="datefield_with_default"]')['value'])
        self.assertTrue(selector.exists('.django-cradmin-datepicker-triggerbutton'))
