from django import forms
from django import test
from django_cradmin import uicontainer

from . import formtest_mixins


class TestField(test.TestCase, formtest_mixins.SingleFormRenderableHelperMixin):
    def test_hiddenwidget_sanity(self):
        selector = self.single_field_formrenderable_htmls(
            field=forms.CharField(widget=forms.HiddenInput()))
        self.assertEqual('hidden', selector.one('input[name="testfield"]')['type'])

    def test_placeholder_default(self):
        selector = self.single_field_formrenderable_htmls(
            field=forms.CharField())
        self.assertFalse(selector.one('input[name="testfield"]').hasattribute('placeholder'))

    def test_placeholder_kwarg_false(self):
        selector = self.single_field_formrenderable_htmls(
            field=forms.CharField(),
            fieldwrapper=uicontainer.fieldwrapper.FieldWrapper(
                fieldname='testfield',
                field_renderable=uicontainer.field.Field(placeholder=False)
            ))
        self.assertFalse(selector.one('input[name="testfield"]').hasattribute('placeholder'))

    def test_placeholder_kwarg_string(self):
        selector = self.single_field_formrenderable_htmls(
            field=forms.CharField(),
            fieldwrapper=uicontainer.fieldwrapper.FieldWrapper(
                fieldname='testfield',
                field_renderable=uicontainer.field.Field(placeholder='Type something')
            ))
        self.assertEqual(
            selector.one('input[name="testfield"]')['placeholder'],
            'Type something'
        )

    def test_autofocus_default(self):
        selector = self.single_field_formrenderable_htmls(
            field=forms.CharField())
        self.assertFalse(selector.one('input[name="testfield"]').hasattribute('autofocus'))

    def test_autofocus_kwarg_false(self):
        selector = self.single_field_formrenderable_htmls(
            field=forms.CharField(),
            fieldwrapper=uicontainer.fieldwrapper.FieldWrapper(
                fieldname='testfield',
                field_renderable=uicontainer.field.Field(autofocus=False)
            ))
        self.assertFalse(selector.one('input[name="testfield"]').hasattribute('autofocus'))

    def test_autofocus_kwarg_true(self):
        selector = self.single_field_formrenderable_htmls(
            field=forms.CharField(),
            fieldwrapper=uicontainer.fieldwrapper.FieldWrapper(
                fieldname='testfield',
                field_renderable=uicontainer.field.Field(autofocus=True)
            ))
        self.assertTrue(selector.one('input[name="testfield"]').hasattribute('autofocus'))

    #
    # CharField
    #

    def test_charfield_name(self):
        selector = self.single_field_formrenderable_htmls(field=forms.CharField())
        self.assertTrue(selector.exists('input[name="testfield"]'))

    def test_charfield_id(self):
        selector = self.single_field_formrenderable_htmls(field=forms.CharField())
        self.assertEqual('id_testfield', selector.one('input[name="testfield"]')['id'])

    def test_charfield_type(self):
        selector = self.single_field_formrenderable_htmls(field=forms.CharField())
        self.assertEqual('text', selector.one('input[name="testfield"]')['type'])

    def test_charfield_required(self):
        selector = self.single_field_formrenderable_htmls(field=forms.CharField())
        self.assertTrue(selector.one('input[name="testfield"]').hasattribute('required'))

    def test_charfield_not_required(self):
        selector = self.single_field_formrenderable_htmls(field=forms.CharField(required=False))
        self.assertFalse(selector.one('input[name="testfield"]').hasattribute('required'))

    def test_charfield_widget_attrs(self):
        selector = self.single_field_formrenderable_htmls(field=forms.CharField(
            widget=forms.TextInput(
                attrs={'my-attribute': '10'}
            )
        ))
        self.assertEqual('10', selector.one('input[name="testfield"]')['my-attribute'])

    def test_charfield_initial(self):
        selector = self.single_field_formrenderable_htmls(field=forms.CharField(initial='testinitial'))
        self.assertEqual('testinitial', selector.one('input[name="testfield"]')['value'])

    def test_charfield_value_from_form(self):
        selector = self.single_field_formrenderable_htmls(
            field=forms.CharField(), formvalue='testvalue')
        self.assertEqual('testvalue', selector.one('input[name="testfield"]')['value'])

    #
    # IntegerField
    #

    def test_integerfield_name(self):
        selector = self.single_field_formrenderable_htmls(field=forms.IntegerField())
        self.assertTrue(selector.exists('input[name="testfield"]'))

    def test_integerfield_id(self):
        selector = self.single_field_formrenderable_htmls(field=forms.IntegerField())
        self.assertEqual('id_testfield', selector.one('input[name="testfield"]')['id'])

    def test_integerfield_type(self):
        selector = self.single_field_formrenderable_htmls(field=forms.IntegerField())
        self.assertEqual('number', selector.one('input[name="testfield"]')['type'])

    def test_integerfield_required(self):
        selector = self.single_field_formrenderable_htmls(field=forms.IntegerField())
        self.assertTrue(selector.one('input[name="testfield"]').hasattribute('required'))

    def test_integerfield_not_required(self):
        selector = self.single_field_formrenderable_htmls(field=forms.IntegerField(required=False))
        self.assertFalse(selector.one('input[name="testfield"]').hasattribute('required'))

    def test_integerfield_widget_attrs(self):
        selector = self.single_field_formrenderable_htmls(field=forms.IntegerField(
            widget=forms.TextInput(
                attrs={'my-attribute': '10'}
            )
        ))
        self.assertEqual('10', selector.one('input[name="testfield"]')['my-attribute'])

    def test_integerfield_initial(self):
        selector = self.single_field_formrenderable_htmls(field=forms.CharField(initial=10))
        self.assertEqual('10', selector.one('input[name="testfield"]')['value'])

    def test_integerfield_value_from_form(self):
        selector = self.single_field_formrenderable_htmls(
            field=forms.CharField(), formvalue=20)
        self.assertEqual('20', selector.one('input[name="testfield"]')['value'])

    #
    # Textarea
    #

    def test_textarea_name(self):
        selector = self.single_field_formrenderable_htmls(field=forms.CharField(widget=forms.Textarea()))
        self.assertTrue(selector.exists('textarea[name="testfield"]'))

    def test_textarea_id(self):
        selector = self.single_field_formrenderable_htmls(field=forms.CharField(widget=forms.Textarea()))
        self.assertEqual('id_testfield', selector.one('textarea[name="testfield"]')['id'])

    def test_textarea_required(self):
        selector = self.single_field_formrenderable_htmls(field=forms.CharField(widget=forms.Textarea()))
        self.assertTrue(selector.one('textarea[name="testfield"]').hasattribute('required'))

    def test_textarea_not_required(self):
        selector = self.single_field_formrenderable_htmls(
            field=forms.CharField(required=False, widget=forms.Textarea()))
        self.assertFalse(selector.one('textarea[name="testfield"]').hasattribute('required'))

    def test_textarea_widget_attrs(self):
        selector = self.single_field_formrenderable_htmls(field=forms.CharField(
            widget=forms.Textarea(
                attrs={'my-attribute': '10'}
            )
        ))
        self.assertEqual('10', selector.one('textarea[name="testfield"]')['my-attribute'])

    def test_textarea_initial(self):
        selector = self.single_field_formrenderable_htmls(
            field=forms.CharField(initial='testinitial', widget=forms.Textarea()))
        self.assertEqual('testinitial', selector.one('textarea[name="testfield"]').alltext)

    def test_textarea_value_from_form(self):
        selector = self.single_field_formrenderable_htmls(
            field=forms.CharField(widget=forms.Textarea()), formvalue='testvalue')
        self.assertEqual('testvalue', selector.one('textarea[name="testfield"]').alltext)

    #
    # BooleanField
    #

    def test_booleanfield_name(self):
        selector = self.single_field_formrenderable_htmls(field=forms.BooleanField())
        self.assertTrue(selector.exists('input[name="testfield"]'))

    def test_booleanfield_id(self):
        selector = self.single_field_formrenderable_htmls(field=forms.BooleanField())
        self.assertEqual('id_testfield', selector.one('input[name="testfield"]')['id'])

    def test_booleanfield_type(self):
        selector = self.single_field_formrenderable_htmls(field=forms.BooleanField())
        self.assertEqual('checkbox', selector.one('input[name="testfield"]')['type'])

    def test_booleanfield_required(self):
        selector = self.single_field_formrenderable_htmls(field=forms.BooleanField())
        self.assertTrue(selector.one('input[name="testfield"]').hasattribute('required'))

    def test_booleanfield_not_required(self):
        selector = self.single_field_formrenderable_htmls(field=forms.BooleanField(required=False))
        self.assertFalse(selector.one('input[name="testfield"]').hasattribute('required'))

    def test_booleanfield_widget_attrs(self):
        selector = self.single_field_formrenderable_htmls(field=forms.BooleanField(
            widget=forms.TextInput(
                attrs={'my-attribute': '10'}
            )
        ))
        self.assertEqual('10', selector.one('input[name="testfield"]')['my-attribute'])

    def test_booleanfield_initial_true(self):
        selector = self.single_field_formrenderable_htmls(field=forms.BooleanField(initial=True))
        self.assertTrue(selector.one('input[name="testfield"]').hasattribute('checked'))

    def test_booleanfield_initial_false(self):
        selector = self.single_field_formrenderable_htmls(field=forms.BooleanField(initial=False))
        self.assertFalse(selector.one('input[name="testfield"]').hasattribute('checked'))

    def test_booleanfield_value_from_form_true(self):
        selector = self.single_field_formrenderable_htmls(
            field=forms.BooleanField(), formvalue=True)
        self.assertTrue(selector.one('input[name="testfield"]').hasattribute('checked'))

    def test_booleanfield_value_from_form_false(self):
        selector = self.single_field_formrenderable_htmls(
            field=forms.BooleanField(), formvalue=False)
        self.assertFalse(selector.one('input[name="testfield"]').hasattribute('checked'))

    #
    # ChoiceField select
    #

    def test_choicefield_select_name(self):
        selector = self.single_field_formrenderable_htmls(field=forms.ChoiceField(choices=[('a', 'A')]))
        self.assertTrue(selector.exists('select[name="testfield"]'))

    def test_choicefield_select_id(self):
        selector = self.single_field_formrenderable_htmls(field=forms.ChoiceField(choices=[('a', 'A')]))
        self.assertEqual('id_testfield', selector.one('select[name="testfield"]')['id'])

    def test_choicefield_select_required(self):
        selector = self.single_field_formrenderable_htmls(field=forms.ChoiceField(choices=[('a', 'A')]))
        self.assertTrue(selector.one('select[name="testfield"]').hasattribute('required'))

    def test_choicefield_select_not_required(self):
        selector = self.single_field_formrenderable_htmls(
            field=forms.ChoiceField(choices=[('a', 'A')], required=False))
        self.assertFalse(selector.one('select[name="testfield"]').hasattribute('required'))

    def test_choicefield_select_widget_attrs(self):
        selector = self.single_field_formrenderable_htmls(
            field=forms.ChoiceField(
                choices=[('a', 'A')],
                widget=forms.Select(
                    attrs={'my-attribute': '10'}
                )))
        self.assertEqual('10', selector.one('select[name="testfield"]')['my-attribute'])

    def test_choicefield_select_initial(self):
        selector = self.single_field_formrenderable_htmls(
            field=forms.ChoiceField(choices=[('a', 'A'), ('b', 'B')],
                                    initial='b'))
        self.assertTrue(selector.one('select[name="testfield"] option[value="b"]').hasattribute('selected'))
        self.assertFalse(selector.one('select[name="testfield"] option[value="a"]').hasattribute('selected'))

    def test_choicefield_select_value_from_form(self):
        selector = self.single_field_formrenderable_htmls(
            field=forms.ChoiceField(choices=[('a', 'A'), ('b', 'B')]),
            formvalue='b')
        self.assertTrue(selector.one('select[name="testfield"] option[value="b"]').hasattribute('selected'))
        self.assertFalse(selector.one('select[name="testfield"] option[value="a"]').hasattribute('selected'))

    #
    # Unsupported
    #

    def test_choicefield_radio_not_implemented(self):
        with self.assertRaises(NotImplementedError):
            self.single_field_formrenderable_htmls(
                field=forms.ChoiceField(choices=[('a', 'A')], widget=forms.RadioSelect()))

    def test_multichoicefield_checkbox_not_implemented(self):
        with self.assertRaises(NotImplementedError):
            self.single_field_formrenderable_htmls(
                field=forms.MultipleChoiceField(choices=[('a', 'A')], widget=forms.CheckboxSelectMultiple()))


class TestHiddenField(test.TestCase, formtest_mixins.SingleFormRenderableHelperMixin):
    def single_field_formrenderable_fieldwrapper_factory(self):
        return uicontainer.fieldwrapper.FieldWrapper(
            fieldname='testfield',
            field_renderable=uicontainer.field.HiddenField())

    def test_charfield_type(self):
        selector = self.single_field_formrenderable_htmls(field=forms.CharField())
        self.assertEqual('hidden', selector.one('input[name="testfield"]')['type'])

    def test_integerfield_type(self):
        selector = self.single_field_formrenderable_htmls(field=forms.IntegerField())
        self.assertEqual('hidden', selector.one('input[name="testfield"]')['type'])

    def test_textarea_type(self):
        selector = self.single_field_formrenderable_htmls(
            field=forms.CharField(initial='testinitial', widget=forms.Textarea()))
        self.assertEqual('hidden', selector.one('input[name="testfield"]')['type'])

    def test_booleanfield_type(self):
        selector = self.single_field_formrenderable_htmls(field=forms.BooleanField())
        self.assertEqual('hidden', selector.one('input[name="testfield"]')['type'])

    def test_choicefield_type(self):
        selector = self.single_field_formrenderable_htmls(
            field=forms.ChoiceField(choices=[('a', 'A')]))
        self.assertEqual('hidden', selector.one('input[name="testfield"]')['type'])
