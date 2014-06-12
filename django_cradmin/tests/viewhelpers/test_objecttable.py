import mock
from django.test import TestCase
from django.db import models

from django_cradmin.viewhelpers.objecttable import Column, PlainTextColumn, SingleActionColumn, \
                                                   MultiActionColumn, Button

class TestColumn(TestCase):
    def setUp(self):
        class TestModel(models.Model):
            testfield = models.CharField(verbose_name=u'Test Value')
            class Meta:
                app_label = 'django_cradmin.viewhelpers_test'

        class TestColSubclass(Column):
            modelfield = 'testfield'
            def __init__(self, **kwargs):
                super(TestColSubclass,self).__init__(**kwargs)

        self.model_testobject = TestModel()
        view = mock.MagicMock()
        view.model = self.model_testobject
        self.column_subclass = TestColSubclass(view=view)
        self.column_subclass_noview = TestColSubclass()

    def test_get_header_not_implemented(self):
        test = Column()

        with self.assertRaises(NotImplementedError):
            test.get_header()

    def test_get_header_no_view(self):
        with self.assertRaises(AttributeError):
            self.column_subclass_noview.get_header()

    def test_get_header(self):
        self.assertEqual("Test Value", self.column_subclass.get_header())

    def test_render_value(self):
        self.model_testobject.testfield = u'test_value'
        self.assertEqual("test_value", self.column_subclass.render_value(self.model_testobject))

    # check that you get an exception when running render_value without having modelfield..
    def test_render_value_not_implemented(self):
        col = Column()

        with self.assertRaises(NotImplementedError):
            col.render_value(None)

    # check that you get an exception when running render_cell without overriding with subclass..
    def test_render_cell_not_implemented(self):
        col = Column()

        with self.assertRaises(NotImplementedError):
            col.render_cell(None)

class TestPlainTextColumn(TestCase):
    def setUp(self):
        class TestModel(models.Model):
            testfield = models.CharField(verbose_name=u'Test Value')
            class Meta:
                app_label = 'django_cradmin.viewhelpers_test'

        class TestColSubclass(PlainTextColumn):
            modelfield = 'testfield'
            def __init__(self, **kwargs):
                super(TestColSubclass,self).__init__(**kwargs)

        self.model_testobject = TestModel()
        view = mock.MagicMock()
        view.model = self.model_testobject
        self.column_subclass = TestColSubclass(view=view)
        self.column_subclass_noview = TestColSubclass()

    def test_render_cell(self):
        self.model_testobject.testfield = 'test_value'
        self.assertEquals('test_value', 
            self.column_subclass.render_cell(self.model_testobject).strip()) 

class TestSingleActionColumn(TestCase):
    def setUp(self):
        class TestModel(models.Model):
            testfield = models.CharField(verbose_name=u'Test Value')
            class Meta:
                app_label = 'django_cradmin.viewhelpers_test'

            def __unicode__(self):
                print 'running __unicode__!'
                return self.testfield.verbose_name

            def __str__(self):
                print 'running __str__!'
                return self.testfield.verbose_name

        class TestIncompleteColSubclass(SingleActionColumn):
            modelfield = 'testfield'
            def __init__(self, **kwargs):
                super(TestIncompleteColSubclass,self).__init__(**kwargs)

        class TestColSubclass(SingleActionColumn):
            modelfield = 'testfield'
            def __init__(self, **kwargs):
                super(TestColSubclass,self).__init__(**kwargs)

            def get_actionurl(self, obj):
                return 'www.example.com/{}'.format(obj.testfield)

        self.model_testobject = TestModel(testfield="test_value")
        view = mock.MagicMock()
        view.model = self.model_testobject
        self.column_subclass = TestColSubclass(view=view)
        self.column_subclass_incomplete = TestIncompleteColSubclass(view=view)

    def test_get_actionurl_ExceptionRaised(self):
        with self.assertRaises(NotImplementedError):
            self.column_subclass_incomplete.get_actionurl(self.model_testobject)

    def test_render_cell_ExceptionRaised(self):
        with self.assertRaises(NotImplementedError):
            self.column_subclass_incomplete.render_cell(self.model_testobject)

    def test_render_cell(self):
        expected = '<a href="www.example.com/test_value">test_value</a>'
        self.assertEquals(self.column_subclass.render_cell(self.model_testobject), expected)


class TestMultiActionColumn(TestCase):
    def setUp(self):
        class TestModel(models.Model):
            testfield = models.CharField(verbose_name=u'Test Value')
            class Meta:
                app_label = 'django_cradmin.viewhelpers_test'

            def __unicode__(self):
                print 'running __unicode__!'
                return self.testfield.verbose_name

            def __str__(self):
                print 'running __str__!'
                return self.testfield.verbose_name

        class TestIncompleteColSubclass(MultiActionColumn):
            modelfield = 'testfield'
            def __init__(self, **kwargs):
                super(TestIncompleteColSubclass,self).__init__(**kwargs)

        class TestColSubclass(MultiActionColumn):
            modelfield = 'testfield'
            def __init__(self, **kwargs):
                super(TestColSubclass,self).__init__(**kwargs)

            def get_buttons(self, obj):
                return [Button(label="Btn1", url="www.example.com/btn1"), 
                        Button(label="Btn2", url="www.example.com/btn2")]

        self.model_testobject = TestModel(testfield="test_value")
        view = mock.MagicMock()
        view.model = self.model_testobject
        self.column_subclass = TestColSubclass(view=view)
        self.column_subclass_incomplete = TestIncompleteColSubclass(view=view)


    def test_get_buttons_ExceptionRaised(self):
        with self.assertRaises(NotImplementedError):
            self.column_subclass_incomplete.get_buttons(self.model_testobject)

    def test_render_cell_ExceptionRaised(self):
        with self.assertRaises(NotImplementedError):
            self.column_subclass_incomplete.render_cell(self.model_testobject)

    def test_render_cell(self):
        expected = ['<p>test_value</p>','<p>',
        '<a','href="www.example.com/btn1"','class="btn','btn-default', 'btn-sm">', 'Btn1', '</a>',
        '<a','href="www.example.com/btn2"','class="btn','btn-default', 'btn-sm">', 'Btn2', '</a>',
        '</p>']

        result = self.column_subclass.render_cell(self.model_testobject).split()
        self.assertEquals(result, expected)


class TestButton(TestCase):
    def test_render_with_icon_and_class(self):
        btn = Button(label="My Btn", url="www.example.com/mybtnurl", buttonclass="danger", 
            icon="glyphicon glyphicon-shopping-cart")

        expected = ['<a', 'href="www.example.com/mybtnurl"', 'class="btn', 'btn-danger', 'btn-sm">',
        '<i', 'class="glyphicon', 'glyphicon-shopping-cart"></i>', 'My', 'Btn', '</a>']

        result = btn.render().split()
        self.assertEquals(result, expected)

    def test_render_simple(self):
        btn = Button(label="My Btn", url="www.example.com/mybtnurl")

        expected = ['<a', 'href="www.example.com/mybtnurl"', 'class="btn', 'btn-default', 'btn-sm">',
        'My', 'Btn', '</a>']

        result = btn.render().split()
        self.assertEquals(result, expected)
