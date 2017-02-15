from django import forms
from django.contrib import messages
from django.shortcuts import redirect
from django.urls import reverse

from django_cradmin import uicontainer
from django_cradmin.demo.cradmin_javascript_demos.models import FictionalFigureCollection
from django_cradmin.viewhelpers import formview
from django_cradmin.viewhelpers import generic


class Overview(generic.StandaloneBaseTemplateView):
    template_name = 'cradmin_javascript_demos/overview.django.html'


class TabsDemo(generic.StandaloneBaseTemplateView):
    template_name = 'cradmin_javascript_demos/tabs-demo.django.html'

    def get_javascriptregistry_component_ids(self):
        return ['django_cradmin_javascript']


class DataListWidgetsDemo(generic.StandaloneBaseTemplateView):
    template_name = 'cradmin_javascript_demos/data-list-widgets-demo.django.html'

    def get_javascriptregistry_component_ids(self):
        return ['django_cradmin_javascript']


class JavascriptDemoView(generic.StandaloneBaseTemplateView):
    template_name = None

    def get_javascriptregistry_component_ids(self):
        return ['django_cradmin_javascript']


class DemoForm(forms.ModelForm):
    class Meta:
        model = FictionalFigureCollection
        fields = [
            'name',
            'primary_fictional_figure',
            'promoted_fictional_figures'
        ]


class DataListWidgetsUicontainerDemo(formview.StandaloneFormView):
    form_class = DemoForm

    def get_pagetitle(self):
        return 'Data list widgets uicontainer demo'

    def get_fictional_figures_api_url(self):
        return reverse('cradmin_javascript_demos_api:fictional-figures-list')

    def get_form_field_renderables(self):
        return [
            uicontainer.fieldwrapper.FieldWrapper(
                fieldname='name'
            ),
            uicontainer.fieldwrapper.FieldWrapper(
                fieldname='primary_fictional_figure',
                field_renderable=uicontainer.foreignkeyfield.Dropdown(
                    api_url=self.get_fictional_figures_api_url()
                )
            ),
            uicontainer.fieldwrapper.FieldWrapper(
                fieldname='promoted_fictional_figures',
                field_renderable=uicontainer.manytomanyfield.Dropdown(
                    api_url=self.get_fictional_figures_api_url()
                )
            ),
        ]

    def get_form_renderable(self):
        return uicontainer.form.Form(
            form=self.get_form(),
            children=[
                uicontainer.layout.AdminuiPageSection(
                    children=[
                        uicontainer.layout.Container(
                            children=self.get_form_field_renderables()
                        )
                    ]
                ),
                uicontainer.layout.AdminuiPageSection(
                    children=[
                        uicontainer.layout.Container(
                            children=[
                                uicontainer.button.SubmitPrimary(text='Create')
                            ]
                        )
                    ]
                )
            ]
        ).bootstrap()

    def get_javascriptregistry_component_ids(self):
        return ['django_cradmin_javascript']

    def form_valid(self, form):
        form.save()
        return super(DataListWidgetsUicontainerDemo, self).form_valid(form)

    def get_success_url(self):
        return self.request.path


class AutoSubmitFormAfterCountdownDemoView(generic.StandaloneBaseTemplateView):
    template_name = 'cradmin_javascript_demos/auto-submit-form-after-countdown.django.html'

    def get_context_data(self, **kwargs):
        context = super(AutoSubmitFormAfterCountdownDemoView, self).get_context_data(**kwargs)
        context['timeout_seconds'] = 3
        return context

    def get_javascriptregistry_component_ids(self):
        return ['django_cradmin_javascript']

    def post(self, *args, **kwargs):
        messages.info(self.request, 'Submitted form!')
        return redirect(self.request.path)


class PrintOnClickDemoView(generic.StandaloneBaseTemplateView):
    template_name = 'cradmin_javascript_demos/print-on-click.django.html'

    def get_javascriptregistry_component_ids(self):
        return ['django_cradmin_javascript']
