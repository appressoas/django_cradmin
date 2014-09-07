from django.utils.translation import ugettext_lazy as _
from django import forms
from crispy_forms import layout
from django_cradmin.apps.cradmin_imagearchive.models import ArchiveImage

from django_cradmin.viewhelpers import objecttable
from django_cradmin.viewhelpers import create
from django_cradmin.viewhelpers import update
from django_cradmin.viewhelpers import delete
from django_cradmin.viewhelpers import multiselect
from django_cradmin import crapp
# from django_cradmin.wysihtml5.widgets import WysiHtmlTextArea
from django_cradmin.acemarkdown.widgets import AceMarkdownWidget
from django_cradmin.crispylayouts import PrimarySubmit

from cradmin_demo.webdemo.models import Page
from django_cradmin.widgets.modelchoice import ModelChoiceWidget


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


class PagesQuerySetForRoleMixin(object):
    """
    Used by listing, update and delete view to ensure
    that only pages that the current role has access to
    is available.
    """
    def get_queryset_for_role(self, site):
        return Page.objects.filter(site=site)


class PagesListView(PagesQuerySetForRoleMixin, objecttable.ObjectTableView):
    model = Page
    columns = [
        TitleColumn,
        'intro'
    ]
    searchfields = ['title', 'intro']

    def get_buttons(self):
        app = self.request.cradmin_app
        return [
            objecttable.Button(_('Create'), url=app.reverse_appurl('create')),
        ]

    def get_multiselect_actions(self):
        app = self.request.cradmin_app
        return [
            objecttable.MultiSelectAction(
                label=_('Edit'),
                url=app.reverse_appurl('multiedit')
            ),
        ]


class PageCreateUpdateMixin(object):
    model = Page
    roleid_field = 'site'
    external_select_fields = ['image']

    def get_external_select_url(self, fieldname):
        if fieldname == 'image':
            return self.request.cradmin_instance.reverse_url('imagearchive', 'singleselect')
        else:
            raise ValueError()

    def get_field_layout(self):
        return [
            layout.Fieldset(
                'Advanced',
                layout.Div('image')
            ),
            layout.Div('title', css_class="cradmin-focusfield cradmin-focusfield-lg"),
            layout.Div('intro', css_class="cradmin-focusfield"),
            layout.Div('body', css_class="cradmin-focusfield"),
        ]

    def get_form(self, *args, **kwargs):
        form = super(PageCreateUpdateMixin, self).get_form(*args, **kwargs)
        # form.fields['body'].widget = WysiHtmlTextArea(attrs={})
        form.fields['body'].widget = AceMarkdownWidget()
        form.fields['image'].widget = ModelChoiceWidget(
            queryset=ArchiveImage.objects.filter_owned_by_role(self.request.cradmin_role)
        )
        return form


class PageCreateView(PageCreateUpdateMixin, create.CreateView):
    """
    View used to create new pages.
    """


class PageUpdateView(PagesQuerySetForRoleMixin, PageCreateUpdateMixin, update.UpdateView):
    """
    View used to create edit existing pages.
    """


class PageDeleteView(PagesQuerySetForRoleMixin, delete.DeleteView):
    """
    View used to delete existing pages.
    """


class PageMultiEditForm(forms.Form):
    new_body = forms.CharField(
        label="New value for the page body",
        required=True, widget=forms.Textarea)


class PageMultiEditView(PagesQuerySetForRoleMixin, multiselect.MultiSelectFormView):
    form_class = PageMultiEditForm
    model = Page

    def get_buttons(self):
        return [
            PrimarySubmit('submit-save', _('Update text for selected pages'))
        ]

    def get_field_layout(self):
        return [
            layout.Div('new_body', css_class="cradmin-focusfield cradmin-focusfield-screenheight"),
        ]

    def form_valid(self, form):
        self.selected_objects.update(body=form.cleaned_data['new_body'])
        return self.success_redirect_response()

    def get_initial(self):
        return {
            'new_body': 'Write something here...'
        }


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            PagesListView.as_view(),
            name=crapp.INDEXVIEW_NAME),
        crapp.Url(
            r'^create$',
            PageCreateView.as_view(),
            name="create"),
        crapp.Url(
            r'^edit/(?P<pk>\d+)$',
            PageUpdateView.as_view(),
            name="edit"),
        crapp.Url(
            r'^delete/(?P<pk>\d+)$',
            PageDeleteView.as_view(),
            name="delete"),
        crapp.Url(
            r'^multiedit/$',
            PageMultiEditView.as_view(),
            name="multiedit")
    ]
