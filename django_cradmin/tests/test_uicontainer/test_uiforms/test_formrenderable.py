from __future__ import unicode_literals

import htmls
import mock
from django import forms
from django import test
from django_cradmin import uicontainer


class MinimalForm(forms.Form):
    name = forms.CharField()


class TestFormRenderable(test.TestCase):
    def ttest_example(self):
        class ExampleForm(forms.Form):
            name = forms.CharField()
            age = forms.IntegerField()
            created_by = forms.CharField()
            user_type = forms.ChoiceField(
                choices=[
                    ('a', 'A'),
                    ('b', 'B'),
                ],
                initial='b'
            )

        form = ExampleForm()
        formrenderable = uicontainer.uiforms.form.FormRenderable(
            form=form,
            children=[
                uicontainer.uiforms.fieldwrapper.FieldWrapperRenderable(fieldname='name'),
                uicontainer.uiforms.fieldwrapper.FieldWrapperRenderable(fieldname='age'),
                uicontainer.uiforms.fieldwrapper.FieldWrapperRenderable(fieldname='user_type'),
                uicontainer.container.Main(
                    children=[
                        uicontainer.uiforms.fieldwrapper.FieldWrapperRenderable(fieldname='created_by'),
                        uicontainer.uiforms.fieldset.FieldSetRenderable(
                            title='Metadata',
                            children=[
                                uicontainer.uiforms.fieldwrapper.FieldWrapperRenderable(fieldname='created_by')
                            ]
                        )
                    ],
                    css_classes_list=['stuff']
                )
            ]
        ).bootstrap()
        htmls.S(formrenderable.render(request=mock.MagicMock())).prettyprint()

    def test_get_default_method(self):
        formrenderable = uicontainer.uiforms.form.FormRenderable(form=MinimalForm())
        self.assertEqual(formrenderable.get_default_method(), 'POST')

    def test_method_default(self):
        formrenderable = uicontainer.uiforms.form.FormRenderable(form=MinimalForm())
        self.assertEqual(formrenderable.method, 'POST')

    def test_method_override_default(self):
        class MyFormRenderable(uicontainer.uiforms.form.FormRenderable):
            def get_default_method(self):
                return 'GET'
        formrenderable = MyFormRenderable(form=MinimalForm())
        self.assertEqual(formrenderable.method, 'GET')

    def test_method_overridden_with_kwarg(self):
        formrenderable = uicontainer.uiforms.form.FormRenderable(form=MinimalForm(), method='GET')
        self.assertEqual(formrenderable.method, 'GET')

    def test_action_is_redirect_to_self_default(self):
        formrenderable = uicontainer.uiforms.form.FormRenderable(form=MinimalForm())
        self.assertEqual(formrenderable.action_is_redirect_to_self(), True)

    def test_action_is_redirect_to_self_action_kwarg_none(self):
        formrenderable = uicontainer.uiforms.form.FormRenderable(form=MinimalForm(), action=None)
        self.assertEqual(formrenderable.action_is_redirect_to_self(), True)

    def test_action_is_redirect_to_self_action_kwarg_not_none(self):
        formrenderable = uicontainer.uiforms.form.FormRenderable(form=MinimalForm(), action='/test/submit')
        self.assertEqual(formrenderable.action_is_redirect_to_self(), False)

    def test_get_html_element_attributes_method(self):
        formrenderable = uicontainer.uiforms.form.FormRenderable(form=MinimalForm(), method='GET')
        self.assertEqual(formrenderable.get_html_element_attributes()['method'], 'GET')

    def test_get_html_element_attributes_action_default(self):
        formrenderable = uicontainer.uiforms.form.FormRenderable(form=MinimalForm())
        # Not included by default - it is rendered by the template by default because
        # the default uses request.get_full_path()
        self.assertNotIn('action', formrenderable.get_html_element_attributes())

    def test_get_html_element_attributes_action_kwarg(self):
        formrenderable = uicontainer.uiforms.form.FormRenderable(form=MinimalForm(), action='/test/submit')
        self.assertEqual(formrenderable.get_html_element_attributes()['action'], '/test/submit')

    def test_register_field_wrapper_renderable(self):
        mock_field_wrapper_renderable = mock.MagicMock()
        mock_field_wrapper_renderable.fieldname = 'test'
        formrenderable = uicontainer.uiforms.form.FormRenderable(form=MinimalForm())
        formrenderable.register_field_wrapper_renderable(field_wrapper_renderable=mock_field_wrapper_renderable)
        self.assertEqual(formrenderable._fieldrenderable_map['test'], mock_field_wrapper_renderable)

    def test_get_field_wrapper_renderable(self):
        mock_field_wrapper_renderable = mock.MagicMock()
        mock_field_wrapper_renderable.fieldname = 'test'
        formrenderable = uicontainer.uiforms.form.FormRenderable(form=MinimalForm())
        formrenderable.register_field_wrapper_renderable(field_wrapper_renderable=mock_field_wrapper_renderable)
        self.assertEqual(formrenderable.get_field_wrapper_renderable('test'), mock_field_wrapper_renderable)

    def test_iter_field_wrapper_renderables(self):
        mock_field_wrapper_renderable1 = mock.MagicMock()
        mock_field_wrapper_renderable1.fieldname = 'test1'
        mock_field_wrapper_renderable2 = mock.MagicMock()
        mock_field_wrapper_renderable2.fieldname = 'test2'
        formrenderable = uicontainer.uiforms.form.FormRenderable(form=MinimalForm())
        formrenderable.register_field_wrapper_renderable(field_wrapper_renderable=mock_field_wrapper_renderable1)
        formrenderable.register_field_wrapper_renderable(field_wrapper_renderable=mock_field_wrapper_renderable2)
        field_wrapper_renderables = list(formrenderable.iter_field_wrapper_renderables())
        self.assertIn(mock_field_wrapper_renderable1, field_wrapper_renderables)
        self.assertIn(mock_field_wrapper_renderable2, field_wrapper_renderables)

    def __make_mockrequest(self):
        mockrequest = mock.MagicMock()

        def getitem(me, key):
            return {
                'get_full_path': '/request-full-path'
            }.get(key, None)

        mockrequest.__getitem__ = getitem
        return mockrequest

    def test_render_wrappertag(self):
        formrenderable = uicontainer.uiforms.form.FormRenderable(form=MinimalForm()).bootstrap()
        selector = htmls.S(formrenderable.render(request=self.__make_mockrequest()))
        self.assertTrue(selector.exists('form'))

    def test_render_action_default(self):
        formrenderable = uicontainer.uiforms.form.FormRenderable(form=MinimalForm()).bootstrap()
        selector = htmls.S(formrenderable.render(request=self.__make_mockrequest()))
        self.assertEqual(selector.one('form')['action'], '/request-full-path')

    def test_render_action_kwarg_false(self):
        formrenderable = uicontainer.uiforms.form.FormRenderable(
            form=MinimalForm(), action=False).bootstrap()
        selector = htmls.S(formrenderable.render(request=self.__make_mockrequest()))
        self.assertFalse(selector.one('form').hasattribute('action'))

    def test_render_action_kwarg_string(self):
        formrenderable = uicontainer.uiforms.form.FormRenderable(
            form=MinimalForm(), action='/overridden').bootstrap()
        selector = htmls.S(formrenderable.render(request=self.__make_mockrequest()))
        self.assertEqual(selector.one('form')['action'], '/overridden')
