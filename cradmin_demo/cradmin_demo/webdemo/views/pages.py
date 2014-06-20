from django.utils.translation import ugettext_lazy as _
from django.template.defaultfilters import truncatechars
from django import forms
from django_cradmin.viewhelpers import objecttable
from django_cradmin.viewhelpers import create
from django_cradmin.viewhelpers import update
from django_cradmin.viewhelpers import delete
from django_cradmin import crapp
from django_cradmin.wysihtml5.widgets import WysiHtmlTextArea
from crispy_forms import layout

from cradmin_demo.webdemo.models import Page

class TitleColumn(objecttable.MultiActionColumn):
    modelfield = 'title'

    def get_buttons(self, obj):
        return [
            objecttable.Button(
                label='Edit',
                url=self.reverse_appurl('edit', args=[obj.id])),
            objecttable.Button(
                label='Delete',
                url=self.reverse_appurl('delete', args=[obj.id]),
                buttonclass="danger"),
        ]


class PagesListView(objecttable.ObjectTableView):
    model = Page
    columns = [
        TitleColumn
    ]

    def get_queryset_for_role(self, obj):
        return self.model.objects.all()

    def get_buttons(self):
        app = self.request.cradmin_app
        return [
            objecttable.Button(_('Create'), url=app.reverse_appurl('create')),
        ]

class PageCreateUpdateMixin(object):
    model = Page
    roleid_field = 'site'

    def get_field_layout(self):
        return [
            layout.Div('title', css_class="cradmin-focusfield cradmin-focusfield-lg"),
            layout.Div('body', css_class="cradmin-focusfield")
        ]

    def get_form(self, *args, **kwargs):
        form = super(PageCreateUpdateMixin, self).get_form(*args, **kwargs)
        form.fields['body'].widget = WysiHtmlTextArea(attrs={})
        return form


class PageCreateView(PageCreateUpdateMixin, create.CreateView):
    """
    View used to create new products.
    """

class PageUpdateView(PageCreateUpdateMixin, update.UpdateView):
    """
    View used to create edit existing products.
    """

class PageDeleteView(delete.DeleteView):
    """
    View used to delete existing products.
    """
    model = Page

class App(crapp.App):
    appurls = [
        crapp.Url(r'^$',
            PagesListView.as_view(),
            name=crapp.INDEXVIEW_NAME),
        crapp.Url(r'^create$',
            PageCreateView.as_view(),
            name="create"),
        crapp.Url(r'^edit/(?P<pk>\d+)$',
            PageUpdateView.as_view(),
            name="edit"),
        crapp.Url(r'^delete/(?P<pk>\d+)$',
            PageDeleteView.as_view(),
            name="delete")
    ]
