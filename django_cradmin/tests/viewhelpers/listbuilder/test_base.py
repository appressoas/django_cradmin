from django.template import RequestContext
from django.test import TestCase, RequestFactory
import htmls
from django_cradmin.viewhelpers import listbuilder


class MinimalRenderable(listbuilder.base.AbstractRenderable):
    template_name = 'cradmin_viewhelpers_testapp/listbuilder/minimal-renderable.django.html'


class TestAbstractRenderable(TestCase):
    def test_get_template_name_no_template_name(self):
        with self.assertRaises(NotImplementedError):
            listbuilder.base.AbstractRenderable().get_template_name()

    def test_get_template_name_has_template_name(self):
        MinimalRenderable().get_template_name()  # NotImplementedError not raised

    def test_get_context_data(self):
        renderable = listbuilder.base.AbstractRenderable()
        self.assertEqual({'me': renderable}, renderable.get_context_data())

    def test_get_template_context_object_without_request(self):
        renderable = listbuilder.base.AbstractRenderable()
        self.assertEqual({'me': renderable}, renderable.get_template_context_object())

    def test_get_template_context_object_with_request(self):
        renderable = listbuilder.base.AbstractRenderable()
        request = RequestFactory().get('')
        context_object = renderable.get_template_context_object(request)
        self.assertTrue(isinstance(context_object, RequestContext))
        self.assertEqual(renderable, context_object['me'])

    def test_render(self):
        self.assertEqual('Test', MinimalRenderable().render().strip())


class TestAbstractItemRenderer(TestCase):
    def test_without_valuealias(self):
        itemrenderer = listbuilder.base.AbstractItemRenderer(value='testvalue')
        self.assertEqual('testvalue', itemrenderer.value)

    def test_with_valuealias(self):
        class MyItemRenderer(listbuilder.base.AbstractItemRenderer):
            valuealias = 'myvalue'

        itemrenderer = MyItemRenderer(value='testvalue')
        self.assertEqual('testvalue', itemrenderer.value)
        self.assertEqual('testvalue', itemrenderer.myvalue)


class TestItemValueRenderer(TestCase):
    def test_render(self):
        rendered = listbuilder.base.ItemValueRenderer(value='testvalue').render()
        selector = htmls.S(rendered)
        self.assertEqual('testvalue',
                         selector.one('.django-cradmin-listbuilder-itemvalue').alltext_normalized)


class TestItemFrameRenderer(TestCase):
    def test_render(self):
        rendered = listbuilder.base.ItemFrameRenderer(
            inneritem=listbuilder.base.ItemValueRenderer(value='testvalue')).render()
        selector = htmls.S(rendered)
        self.assertTrue(selector.exists('.django-cradmin-listbuilder-itemframe'))
        self.assertEqual('testvalue',
                         selector.one('.django-cradmin-listbuilder-itemvalue').alltext_normalized)


class TestList(TestCase):
    def test_append(self):
        testlist = listbuilder.base.List()
        renderable = MinimalRenderable()
        testlist.append(renderable)
        self.assertEqual([renderable], testlist.renderable_list)

    def test_extend(self):
        testlist = listbuilder.base.List()
        renderable1 = MinimalRenderable()
        renderable2 = MinimalRenderable()
        testlist.extend([renderable1, renderable2])
        self.assertEqual([renderable1, renderable2], testlist.renderable_list)

    def test_extend_with_values_without_frame_renderer_class(self):
        testlist = listbuilder.base.List()
        testlist.extend_with_values(['testvalue1', 'testvalue2'],
                                    value_renderer_class=listbuilder.base.ItemValueRenderer)
        self.assertEqual('testvalue1', testlist.renderable_list[0].value)
        self.assertEqual('testvalue2', testlist.renderable_list[1].value)
        self.assertTrue(isinstance(testlist.renderable_list[0], listbuilder.base.ItemValueRenderer))
        self.assertTrue(isinstance(testlist.renderable_list[1], listbuilder.base.ItemValueRenderer))

    def test_extend_with_values_with_frame_renderer_class(self):
        testlist = listbuilder.base.List()
        testlist.extend_with_values(['testvalue1', 'testvalue2'],
                                    value_renderer_class=listbuilder.base.ItemValueRenderer,
                                    frame_renderer_class=listbuilder.base.ItemFrameRenderer)
        self.assertEqual('testvalue1', testlist.renderable_list[0].value)
        self.assertEqual('testvalue2', testlist.renderable_list[1].value)
        self.assertTrue(isinstance(testlist.renderable_list[0], listbuilder.base.ItemFrameRenderer))
        self.assertTrue(isinstance(testlist.renderable_list[1], listbuilder.base.ItemFrameRenderer))

    def test_from_value_iterable_without_frame_renderer_class(self):
        testlist = listbuilder.base.List.from_value_iterable(
            ['testvalue1', 'testvalue2'],
            value_renderer_class=listbuilder.base.ItemValueRenderer)
        self.assertEqual('testvalue1', testlist.renderable_list[0].value)
        self.assertEqual('testvalue2', testlist.renderable_list[1].value)
        self.assertTrue(isinstance(testlist.renderable_list[0], listbuilder.base.ItemValueRenderer))
        self.assertTrue(isinstance(testlist.renderable_list[1], listbuilder.base.ItemValueRenderer))

    def test_from_value_iterable_with_frame_renderer_class(self):
        testlist = listbuilder.base.List.from_value_iterable(
            ['testvalue1', 'testvalue2'],
            value_renderer_class=listbuilder.base.ItemValueRenderer,
            frame_renderer_class=listbuilder.base.ItemFrameRenderer)
        self.assertEqual('testvalue1', testlist.renderable_list[0].value)
        self.assertEqual('testvalue2', testlist.renderable_list[1].value)
        self.assertTrue(isinstance(testlist.renderable_list[0], listbuilder.base.ItemFrameRenderer))
        self.assertTrue(isinstance(testlist.renderable_list[1], listbuilder.base.ItemFrameRenderer))

    def test_render(self):
        testlist = listbuilder.base.List()
        testlist.append(listbuilder.base.ItemValueRenderer(value='testvalue1'))
        testlist.append(listbuilder.base.ItemValueRenderer(value='testvalue2'))
        selector = htmls.S(testlist.render())
        self.assertEqual(2, selector.count('li'))
        self.assertEqual('testvalue1', selector.list('li')[0].alltext_normalized)
        self.assertEqual('testvalue2', selector.list('li')[1].alltext_normalized)
