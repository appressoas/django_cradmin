from django import forms

from django_cradmin import crapp
from django_cradmin import uicontainer
from django_cradmin import viewhelpers


class SimpleForm(forms.Form):
    name = forms.CharField()


class CustomCharField(uicontainer.uiforms.base.FieldRenderable):
    pass


class SimpleUiContainerView(viewhelpers.generic.StandaloneBaseTemplateView):
    template_name = 'uicontainerdemo/simple/simpleuicontainerview.django.html'

    def __get_form(self):
        form = SimpleForm()
        return form

    def __get_container(self):
        container = uicontainer.uiforms.base.FormRenderable(
            form=self.__get_form())
        container.add_fieldrenderer(CustomCharField(fieldname='name'))
        return container

    def get_context_data(self, **kwargs):
        context = super(SimpleUiContainerView, self).get_context_data(**kwargs)
        context['container'] = self.__get_container()
        return context


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            SimpleUiContainerView.as_view(),
            name=crapp.INDEXVIEW_NAME),
    ]
