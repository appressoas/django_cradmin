import htmls
import mock
from django.test import TestCase, RequestFactory
from django.db import models

from django_cradmin.viewhelpers import objecttable
from django_cradmin.django_cradmin_testapp import models as testmodels


class TestColumn(TestCase):
    def setUp(self):
        class TestModel(models.Model):
            testfield = models.CharField(verbose_name=u'Test Value')

            class Meta:
                app_label = 'django_cradmin.viewhelpers_test'

        class TestColSubclass(objecttable.Column):
            modelfield = 'testfield'

            def __init__(self, **kwargs):
                super(TestColSubclass, self).__init__(**kwargs)

        self.model_testobject = TestModel()
        view = mock.MagicMock()
        view.model = self.model_testobject
        self.column_subclass = TestColSubclass(view=view)
        self.column_subclass_noview = TestColSubclass()

    def test_get_header_not_implemented(self):
        test = objecttable.Column()

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
        col = objecttable.Column()

        with self.assertRaises(NotImplementedError):
            col.render_value(None)

    # check that you get an exception when running render_cell without overriding with subclass..
    def test_render_cell_not_implemented(self):
        col = objecttable.Column()

        with self.assertRaises(NotImplementedError):
            col.render_cell(None)


class TestPlainTextColumn(TestCase):
    def setUp(self):
        class TestModel(models.Model):
            testfield = models.CharField(verbose_name=u'Test Value')

            class Meta:
                app_label = 'django_cradmin.viewhelpers_test'

        class TestColSubclass(objecttable.PlainTextColumn):
            modelfield = 'testfield'

            def __init__(self, **kwargs):
                super(TestColSubclass, self).__init__(**kwargs)

        self.model_testobject = TestModel()
        view = mock.MagicMock()
        view.model = self.model_testobject
        self.column_subclass = TestColSubclass(view=view)
        self.column_subclass_noview = TestColSubclass()

    def test_render_cell(self):
        self.model_testobject.testfield = 'test_value'
        self.assertEquals(
            '<span class="objecttable-cellvalue">test_value</span>',
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

        class TestIncompleteColSubclass(objecttable.SingleActionColumn):
            modelfield = 'testfield'

            def __init__(self, **kwargs):
                super(TestIncompleteColSubclass, self).__init__(**kwargs)

        class TestColSubclass(objecttable.SingleActionColumn):
            modelfield = 'testfield'

            def __init__(self, **kwargs):
                super(TestColSubclass, self).__init__(**kwargs)

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
        expected = '<a href="www.example.com/test_value" class="objecttable-cellvalue-link">test_value</a>'
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

        class TestIncompleteColSubclass(objecttable.MultiActionColumn):
            modelfield = 'testfield'

            def __init__(self, **kwargs):
                super(TestIncompleteColSubclass, self).__init__(**kwargs)

        class TestColSubclass(objecttable.MultiActionColumn):
            modelfield = 'testfield'

            def __init__(self, **kwargs):
                super(TestColSubclass, self).__init__(**kwargs)

            def get_buttons(self, obj):
                return [objecttable.Button(label="Btn1", url="www.example.com/btn1"),
                        objecttable.Button(label="Btn2", url="www.example.com/btn2")]

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
        expected = [
            '<p', 'class="objecttable-cellvalue">test_value</p>',
            '<p', 'class="objecttable-cellbuttons">',
            '<a', 'href="www.example.com/btn1"', 'class="btn', 'btn-default', 'btn-sm">', 'Btn1', '</a>',
            '<a', 'href="www.example.com/btn2"', 'class="btn', 'btn-default', 'btn-sm">', 'Btn2', '</a>',
            '</p>'
        ]
        result = self.column_subclass.render_cell(self.model_testobject).split()
        self.assertEquals(result, expected)


class TestButton(TestCase):
    def test_render_with_icon_and_class(self):
        btn = objecttable.Button(
            label="My Btn", url="www.example.com/mybtnurl",
            buttonclass="danger",
            icon="glyphicon glyphicon-shopping-cart")
        expected = [
            '<a', 'href="www.example.com/mybtnurl"', 'class="btn', 'btn-danger', 'btn-sm">',
            '<span', 'class="glyphicon', 'glyphicon-shopping-cart"></span>', 'My', 'Btn', '</a>'
        ]
        result = btn.render().split()
        self.assertEquals(result, expected)

    def test_render_simple(self):
        btn = objecttable.Button(label="My Btn", url="www.example.com/mybtnurl")
        expected = [
            '<a', 'href="www.example.com/mybtnurl"', 'class="btn', 'btn-default', 'btn-sm">',
            'My', 'Btn', '</a>']
        result = btn.render().split()
        self.assertEquals(result, expected)


class TestObjectTableView(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def _mock_request(self, request):
        request.cradmin_role = mock.MagicMock()
        request.cradmin_app = mock.MagicMock()

    def test_paginate_by_singlepage(self):
        testmodels.SomeItem.objects.bulk_create(
            [testmodels.SomeItem(name=unicode(x)) for x in xrange(4)])
        class MyObjectTableView(objecttable.ObjectTableView):
            model = testmodels.SomeItem
            paginate_by = 4

            def get_queryset_for_role(self, role):
                return testmodels.SomeItem.objects.all()

        request = self.factory.get('/test')
        self._mock_request(request)
        response = MyObjectTableView.as_view()(request)
        response.render()
        selector = htmls.S(response.content)
        # selector.one('#django_cradmin_contentwrapper').prettyprint()
        self.assertEqual(selector.count('#objecttableview-table>tbody>tr'), 4)
        self.assertFalse(selector.exists('#django_cradmin_contentwrapper .pager'))

    def test_paginate_by_firstpage(self):
        testmodels.SomeItem.objects.bulk_create(
            [testmodels.SomeItem(name=unicode(x)) for x in xrange(5)])
        class MyObjectTableView(objecttable.ObjectTableView):
            model = testmodels.SomeItem
            paginate_by = 4

            def get_queryset_for_role(self, role):
                return testmodels.SomeItem.objects.all()

        request = self.factory.get('/test')
        self._mock_request(request)
        response = MyObjectTableView.as_view()(request)
        response.render()
        selector = htmls.S(response.content)
        self.assertEqual(selector.count('#objecttableview-table>tbody>tr'), 4)
        self.assertTrue(selector.exists('#django_cradmin_contentwrapper .pager'))
        self.assertTrue(selector.exists('#django_cradmin_contentwrapper .pager .previous.disabled'))
        self.assertTrue(selector.exists('#django_cradmin_contentwrapper .pager .next'))
        self.assertFalse(selector.exists('#django_cradmin_contentwrapper .pager .next.disabled'))

    def test_paginate_by_lastpage(self):
        testmodels.SomeItem.objects.bulk_create(
            [testmodels.SomeItem(name=unicode(x)) for x in xrange(5)])
        class MyObjectTableView(objecttable.ObjectTableView):
            model = testmodels.SomeItem
            paginate_by = 4

            def get_queryset_for_role(self, role):
                return testmodels.SomeItem.objects.all()

        request = self.factory.get('/test', {
            'page': 2
        })
        self._mock_request(request)
        response = MyObjectTableView.as_view()(request)
        response.render()
        selector = htmls.S(response.content)
        self.assertEqual(selector.count('#objecttableview-table>tbody>tr'), 1)
        self.assertTrue(selector.exists('#django_cradmin_contentwrapper .pager'))
        self.assertTrue(selector.exists('#django_cradmin_contentwrapper .pager .previous'))
        self.assertFalse(selector.exists('#django_cradmin_contentwrapper .pager .previous.disabled'))
        self.assertTrue(selector.exists('#django_cradmin_contentwrapper .pager .next.disabled'))

    def test_paginate_by_middlepage(self):
        testmodels.SomeItem.objects.bulk_create(
            [testmodels.SomeItem(name=unicode(x)) for x in xrange(9)])
        class MyObjectTableView(objecttable.ObjectTableView):
            model = testmodels.SomeItem
            paginate_by = 4

            def get_queryset_for_role(self, role):
                return testmodels.SomeItem.objects.all()

        request = self.factory.get('/test', {
            'page': 2
        })
        self._mock_request(request)
        response = MyObjectTableView.as_view()(request)
        response.render()
        selector = htmls.S(response.content)
        # selector.one('#django_cradmin_contentwrapper').prettyprint()
        self.assertEqual(selector.count('#objecttableview-table>tbody>tr'), 4)
        self.assertTrue(selector.exists('#django_cradmin_contentwrapper .pager'))
        self.assertTrue(selector.exists('#django_cradmin_contentwrapper .pager .previous'))
        self.assertTrue(selector.exists('#django_cradmin_contentwrapper .pager .next'))
        self.assertFalse(selector.exists('#django_cradmin_contentwrapper .pager .previous.disabled'))
        self.assertFalse(selector.exists('#django_cradmin_contentwrapper .pager .next.disabled'))
