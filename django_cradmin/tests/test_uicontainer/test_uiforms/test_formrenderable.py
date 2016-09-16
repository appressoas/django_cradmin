from __future__ import unicode_literals

import htmls
import mock
from django import forms
from django import test
from django_cradmin import uicontainer


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


class TestFormRenderable(test.TestCase):
    def ttest_example(self):
        form = ExampleForm()
        formrenderable = uicontainer.uiforms.form.FormRenderable(
            form=form,
            children=[
                # uicontainer.uiforms.field.FieldWrapperRenderable(fieldname='name'),
                uicontainer.uiforms.field.FieldWrapperRenderable(fieldname='age'),
                # uicontainer.uiforms.field.FieldWrapperRenderable(fieldname='user_type'),
                # uicontainer.container.MainRenderable(
                #     children=[
                #         uicontainer.uiforms.field.FieldWrapperRenderable(fieldname='created_by'),
                #         uicontainer.uiforms.fieldset.FieldSetRenderable(
                #             title='Metadata',
                #             children=[
                #                 uicontainer.uiforms.field.FieldWrapperRenderable(fieldname='created_by')
                #             ]
                #         )
                #     ],
                #     css_classes_list=['stuff']
                # )
            ]
        ).bootstrap()
        htmls.S(formrenderable.render(request=mock.MagicMock())).prettyprint()
