import datetime
from django import forms
from django.contrib import messages

from django_cradmin import crapp
from django_cradmin import uicontainer
from django_cradmin import viewhelpers


class SimpleForm(forms.Form):
    name = forms.CharField(required=False)
    birth_date = forms.DateField(required=False)
    disabled_datetime = forms.DateTimeField(required=False)
    my_time_field = forms.TimeField(required=False)
    demo_type = forms.ChoiceField(required=False)


class SimpleUiContainerView(viewhelpers.formview.WithinRoleFormView):
    form_class = SimpleForm

    def get_pagetitle(self):
        return 'Simple uicontainer demo'

    def get_initial(self):
        return {
            'birth_date': datetime.date(2016, 3, 1),
            'disabled_datetime': datetime.datetime(2019, 12, 24, 18, 20),
            'my_time_field': datetime.time(2, 9),
        }

    def get_form_renderable(self):
        demo_form = self.get_form()
        demo_form.fields['demo_type'].choices = [(1, 'Foo'), (2, 'Bar')]
        return uicontainer.form.Form(
            form=demo_form,
            children=[
                uicontainer.layout.AdminuiPageSectionTight(
                    children=[
                        uicontainer.fieldwrapper.FieldWrapper(fieldname='name'),
                        uicontainer.fieldwrapper.FieldWrapper(
                            fieldname='demo_type',
                            field_renderable=uicontainer.field.Select()
                        ),
                        uicontainer.fieldwrapper.FieldWrapper(
                            fieldname='birth_date',
                            field_renderable=uicontainer.field.Date()),
                        uicontainer.fieldwrapper.FieldWrapper(
                            fieldname='disabled_datetime',
                            field_renderable=uicontainer.field.DateTime()
                        ),
                        uicontainer.fieldwrapper.FieldWrapper(
                            fieldname='my_time_field',
                            field_renderable=uicontainer.field.Time()
                        ),
                        uicontainer.button.SubmitPrimary(text='Submit form'),
                    ]
                )
            ]
        ).bootstrap()

    def get_javascriptregistry_component_ids(self):
        return ['django_cradmin_javascript']

    def form_valid(self, form):
        messages.success(self.request,
                         'Submitted data: {!r}'.format(form.cleaned_data))
        return self.render_to_response(self.get_context_data(form=form))


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            SimpleUiContainerView.as_view(),
            name=crapp.INDEXVIEW_NAME),
    ]