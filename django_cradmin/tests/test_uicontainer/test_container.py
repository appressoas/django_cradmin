import htmls
from django import test
from django_cradmin import uicontainer


class MinimalContainer(uicontainer.container.AbstractContainerRenderable):
    def get_wrapper_htmltag(self):
        return 'div'


class TestAbstractContainerRenderable(test.TestCase):
    def test_children_as_kwarg(self):
        container = MinimalContainer(children=[MinimalContainer(), MinimalContainer()])
        self.assertEqual(container.get_childcount(), 2)

    def test_children_with_add_child(self):
        container = MinimalContainer()\
            .add_child(MinimalContainer())\
            .add_child(MinimalContainer())
        self.assertEqual(container.get_childcount(), 2)

    def test_children_with_add_children(self):
        container = MinimalContainer()\
            .add_children(MinimalContainer(), MinimalContainer())
        self.assertEqual(container.get_childcount(), 2)

    def test_dom_id_default(self):
        container = MinimalContainer()
        self.assertEqual(container.dom_id, False)

    def test_dom_id_default_overridden(self):
        class MyContainer(MinimalContainer):
            def get_default_dom_id(self):
                return 'a'
        container = MyContainer()
        self.assertEqual(container.dom_id, 'a')

    def test_dom_id_kwarg(self):
        container = MinimalContainer(dom_id='a')
        self.assertEqual(container.dom_id, 'a')

    def test_role_default(self):
        container = MinimalContainer()
        self.assertEqual(container.role, False)

    def test_role_default_overridden(self):
        class MyContainer(MinimalContainer):
            def get_default_role(self):
                return 'a'
        container = MyContainer()
        self.assertEqual(container.role, 'a')

    def test_role_kwarg(self):
        container = MinimalContainer(role='a')
        self.assertEqual(container.role, 'a')

    def test_get_css_classes_list_default(self):
        container = MinimalContainer(role='a')
        self.assertEqual(container.get_css_classes_list(), [])

    def test_get_css_classes_list_override_default(self):
        class MyContainer(MinimalContainer):
            def get_default_css_classes_list(self):
                return ['a', 'b']
        container = MyContainer()
        self.assertEqual(container.get_css_classes_list(), ['a', 'b'])

    def test_get_css_classes_list_css_classes_list_kwarg(self):
        class MyContainer(MinimalContainer):
            def get_default_css_classes_list(self):
                return ['a', 'b']
        container = MyContainer(css_classes_list=['c', 'd'])
        self.assertEqual(container.get_css_classes_list(), ['c', 'd'])

    def test_get_css_classes_list_extra_css_classes_list_kwarg(self):
        class MyContainer(MinimalContainer):
            def get_default_css_classes_list(self):
                return ['a', 'b']
        container = MyContainer(extra_css_classes_list=['c', 'd'])
        self.assertEqual(container.get_css_classes_list(), ['a', 'b', 'c', 'd'])

    def test_get_css_classes_list_css_classes_list_and_extra_css_classes_list_kwarg(self):
        class MyContainer(MinimalContainer):
            def get_default_css_classes_list(self):
                return ['a', 'b']
        container = MyContainer(css_classes_list=['x'], extra_css_classes_list=['c', 'd'])
        self.assertEqual(container.get_css_classes_list(), ['x', 'c', 'd'])

    def test_iter_children(self):
        container = MinimalContainer(children=[
            MinimalContainer(dom_id='a'), MinimalContainer(dom_id='b')])
        children = list(container.iter_children())
        self.assertEqual(children[0].dom_id, 'a')
        self.assertEqual(children[1].dom_id, 'b')

    def test_get_html_element_attributes_default(self):
        container = MinimalContainer()
        self.assertEqual(container.get_html_element_attributes(), {
            'role': False,
            'id': False,
            'class': False,
        })

    def test_get_html_element_attributes_role(self):
        container = MinimalContainer(role='a')
        self.assertEqual(container.get_html_element_attributes()['role'], 'a')

    def test_get_html_element_attributes_dom_id(self):
        container = MinimalContainer(dom_id='a')
        self.assertEqual(container.get_html_element_attributes()['id'], 'a')

    def test_get_html_element_attributes_dom_css_classes(self):
        container = MinimalContainer(css_classes_list=['a', 'b'])
        self.assertEqual(container.get_html_element_attributes()['class'], 'a  b')

    def test_html_element_attributes_string_default(self):
        container = MinimalContainer()
        self.assertEqual(container.html_element_attributes_string, '')

    def test_html_element_attributes_string_role(self):
        container = MinimalContainer(role="a")
        self.assertEqual(container.html_element_attributes_string, ' role="a"')

    def test_html_element_attributes_string_dom_id(self):
        container = MinimalContainer(dom_id="a")
        self.assertEqual(container.html_element_attributes_string, ' id="a"')

    def test_html_element_attributes_string_css_classes(self):
        container = MinimalContainer(css_classes_list=['a'])
        self.assertEqual(container.html_element_attributes_string, ' class="a"')

    def test_html_element_attributes_string_html_element_attributes_kwarg(self):
        container = MinimalContainer(html_element_attributes={'a': '10'})
        self.assertEqual(container.html_element_attributes_string, ' a="10"')

    def test_prepopulate_children_list_default(self):
        container = MinimalContainer()
        self.assertEqual(container.get_childcount(), 0)

    def test_prepopulate_children_list_overridden_no_other_children_added(self):
        class MyContainer(MinimalContainer):
            def prepopulate_children_list(self):
                return [MinimalContainer()]
        container = MyContainer()
        self.assertEqual(container.get_childcount(), 1)

    def test_prepopulate_children_list_overridden_other_children_added(self):
        class MyContainer(MinimalContainer):
            def prepopulate_children_list(self):
                return [MinimalContainer(dom_id='a')]
        container = MyContainer(children=[MinimalContainer(dom_id='b')])
        children = list(container.iter_children())
        self.assertEqual(children[0].dom_id, 'a')
        self.assertEqual(children[1].dom_id, 'b')

    def test_wrapper_element_can_have_children(self):
        container = MinimalContainer()
        self.assertTrue(container.wrapper_element_can_have_children)

    def test_wrapper_element_can_have_children_false_can_not_add_children(self):
        class MyContainer(MinimalContainer):
            @property
            def wrapper_element_can_have_children(self):
                return False
        container = MyContainer()
        with self.assertRaises(uicontainer.container.NotAllowedToAddChildrenError):
            container.add_child(MinimalContainer())

    def test_bootstrap(self):
        container = MinimalContainer()
        self.assertFalse(hasattr(container, 'parent'))
        self.assertFalse(container._is_bootsrapped)
        container.bootstrap()
        self.assertTrue(hasattr(container, 'parent'))
        self.assertTrue(container._is_bootsrapped)

    def test_bootstrap_with_parent(self):
        container = MinimalContainer()
        child = MinimalContainer()
        container.add_child(child)
        container.bootstrap()
        self.assertEqual(child.parent, container)

    def test_bootstrap_already_bootstrapped(self):
        container = MinimalContainer()
        container.bootstrap()
        with self.assertRaises(uicontainer.container.AlreadyBootsrappedError):
            container.bootstrap()

    def test_bootstrap_already_bootstrapped_deep(self):
        container = MinimalContainer()
        child = MinimalContainer()
        container.add_child(child)
        child.bootstrap()
        with self.assertRaises(uicontainer.container.AlreadyBootsrappedError):
            container.bootstrap()

    def test_render_sanity(self):
        container = MinimalContainer().bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.count('div'), 1)

    def test_render_dom_id(self):
        container = MinimalContainer(dom_id='mycontainer').bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('div')['id'], 'mycontainer')

    def test_render_role(self):
        container = MinimalContainer(role='main').bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('div')['role'], 'main')

    def test_render_cssclass(self):
        container = MinimalContainer(css_classes_list=['a']).bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('div')['class'], 'a')

    def test_render_html_element_attributes(self):
        container = MinimalContainer(html_element_attributes={'my-attribute': 'test'}).bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('div')['my-attribute'], 'test')

    def test_render_with_children(self):
        container = MinimalContainer(dom_id='main', children=[
            MinimalContainer(dom_id='child1'),
            MinimalContainer(dom_id='child2'),
        ]).bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.count('div'), 3)
        self.assertTrue(selector.exists('div#main'))
        self.assertTrue(selector.exists('div#main > div#child1'))
        self.assertTrue(selector.exists('div#main > div#child2'))

    def test_render_with_children_deep(self):
        container = MinimalContainer(dom_id='main', children=[
            MinimalContainer(dom_id='child1', children=[
                MinimalContainer(dom_id='child1_1'),
            ]),
            MinimalContainer(dom_id='child2'),
        ]).bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.count('div'), 4)
        self.assertTrue(selector.exists('div#main'))
        self.assertTrue(selector.exists('div#main > div#child1'))
        self.assertTrue(selector.exists('div#main > div#child1 > div#child1_1'))
        self.assertTrue(selector.exists('div#main > div#child2'))

    def test_should_render_false(self):
        class MyContainer(MinimalContainer):
            @property
            def should_render(self):
                return False
        container = MyContainer().bootstrap()
        self.assertEqual(container.render(), '')


class TestDivRenderable(test.TestCase):
    def test_sanity(self):
        container = uicontainer.container.Div().bootstrap()
        selector = htmls.S(container.render())
        self.assertTrue(selector.exists('div'))


class TestSectionRenderable(test.TestCase):
    def test_sanity(self):
        container = uicontainer.container.Section().bootstrap()
        selector = htmls.S(container.render())
        self.assertTrue(selector.exists('section'))


class TestHeaderRenderable(test.TestCase):
    def test_sanity(self):
        container = uicontainer.container.Header().bootstrap()
        selector = htmls.S(container.render())
        self.assertTrue(selector.exists('header'))


class TestMainRenderable(test.TestCase):
    def test_sanity(self):
        container = uicontainer.container.Main().bootstrap()
        selector = htmls.S(container.render())
        self.assertTrue(selector.exists('main'))

    def test_default_role_is_main(self):
        container = uicontainer.container.Main().bootstrap()
        selector = htmls.S(container.render())
        self.assertEqual(selector.one('main')['role'], 'main')
