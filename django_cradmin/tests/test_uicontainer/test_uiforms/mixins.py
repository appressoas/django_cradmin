from __future__ import unicode_literals

import htmls
import mock
from django import forms
from django_cradmin import uicontainer


class SingleFormRenderableHelperMixin(object):
    def single_field_formclass_factory(self, field):
        class TestForm(forms.Form):
            testfield = field
        return TestForm

    def single_field_formrenderable_factory(self, field, formvalue=None):
        form_class = self.single_field_formclass_factory(field=field)
        data = None
        if formvalue:
            data = {'testfield': formvalue}
        form = form_class(data=data)
        formrenderable = uicontainer.uiforms.form.FormRenderable(
            form=form,
            children=[uicontainer.uiforms.fieldwrapper.FieldWrapperRenderable(fieldname='testfield')]
        ).bootstrap()
        return formrenderable

    def single_field_formrenderable_htmls(self, **kwargs):
        formrenderable = self.single_field_formrenderable_factory(**kwargs)
        return htmls.S(formrenderable.render(request=mock.MagicMock()))


