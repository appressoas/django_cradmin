from django import forms
from django.views.generic import TemplateView

from django_cradmin import crapp
from django_cradmin import uicontainer


class SimpleForm(forms.Form):
    name = forms.CharField()


class CustomCharField(uicontainer.uiforms.base.FieldRenderable):
    pass


class SimpleUiContainerView(TemplateView):
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
        return {
            'container': self.__get_container()
        }


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            SimpleUiContainerView.as_view(),
            name=crapp.INDEXVIEW_NAME),
    ]
