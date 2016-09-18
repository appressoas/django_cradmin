from django.views.generic import FormView as DjangoFormView
from django_cradmin import javascriptregistry

from . import formviewmixin


class FormView(javascriptregistry.viewmixin.WithinRoleViewMixin,
               formviewmixin.FormViewMixin,
               DjangoFormView):
    """
    A :class:`django.views.generic.edit.FormView` with :class:`.FormViewMixin`.

    Examples:

        Minimalistic example::

            from django import forms
            from django.http import HttpResponseRedirect
            from django_cradmin.crispylayouts import PrimarySubmit

            class MyForm(forms.Form):
                first_name = forms.CharField(max_length=50)
                last_name = forms.CharField(max_length=50)

            class MyFormView(FormView):
                template_name = 'myapp/myview.django.html'
                form_class = MyForm

                def get_field_layout(self):
                    return [
                        'first_name',
                        'last_name',
                    ]

                def get_buttons(self):
                    return [
                        PrimarySubmit('save', 'Save'),
                    ]

                def form_valid(self, form):
                    # ... do something with the form ...
                    return HttpResponseRedirect('/some/view')
    """
    template_name = 'django_cradmin/viewhelpers/formview_base.django.html'

    def get_context_data(self, context):
        super(FormView, self).get_context_data(context=context)
        self.add_formview_mixin_context_data(context=context)
        self.add_javascriptregistry_component_ids_to_context(context=context)
