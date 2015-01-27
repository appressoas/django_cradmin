from django.shortcuts import get_object_or_404
from django.utils.translation import ugettext_lazy as _
from django import forms
from crispy_forms import layout
from django.views.generic import TemplateView

from django_cradmin.viewhelpers import objecttable
from django_cradmin.viewhelpers import create
from django_cradmin.viewhelpers import update
from django_cradmin.viewhelpers import delete
from django_cradmin.viewhelpers import multiselect
from django_cradmin import crapp
from django_cradmin.acemarkdown.widgets import AceMarkdownWidget
from django_cradmin.crispylayouts import PrimarySubmit
from django_cradmin.apps.cradmin_imagearchive.models import ArchiveImage
from cradmin_demo.webdemo.models import Page
from django_cradmin.widgets.modelchoice import ModelChoiceWidget


class TitleColumn(objecttable.MultiActionColumn):
    modelfield = 'title'

    def get_buttons(self, obj):
        return [
            objecttable.Button(
                label='Edit',
                url=self.reverse_appurl('edit', args=[obj.id])),
            objecttable.PagePreviewButton(
                label='View',
                url=self.reverse_appurl('preview', args=[obj.id])),
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


class ArchiveImagePreviewColumn(objecttable.ImagePreviewColumn):
    modelfield = 'image'

    def render_value(self, obj):
        if obj.image:
            return obj.image.image
        else:
            return None


class IntroColumn(objecttable.TruncatecharsPlainTextColumn):
    modelfield = 'intro'
    maxlength = 40
    allcells_css_classes = ['hidden-xs']



class PagesListView(PagesQuerySetForRoleMixin, objecttable.ObjectTableView):
    model = Page
    enable_previews = True
    columns = [
        ArchiveImagePreviewColumn,
        TitleColumn,
        IntroColumn,
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

    def get_preview_url(self):
        return self.request.cradmin_app.reverse_appurl('preview')

    def _get_image_selectview_url(self):
        return self.request.cradmin_instance.reverse_url('imagearchive', 'singleselect')

    def get_field_layout(self):
        return [
            layout.Div('title', css_class="cradmin-focusfield cradmin-focusfield-lg"),
            layout.Fieldset(
                'Image',
                'image',
            ),
            layout.Div('intro', css_class="cradmin-focusfield"),
            layout.Div('body', css_class="cradmin-focusfield"),
        ]

    def get_form(self, *args, **kwargs):
        form = super(PageCreateUpdateMixin, self).get_form(*args, **kwargs)
        # form.fields['body'].widget = WysiHtmlTextArea(attrs={})
        form.fields['body'].widget = AceMarkdownWidget()
        preview = '<p class="text-muted">(No image selected)</p>'
        if self.object and self.object.image:
            preview = self.object.image.get_preview_html()
        form.fields['image'].widget = ModelChoiceWidget(
            queryset=ArchiveImage.objects.filter_owned_by_role(self.request.cradmin_role),
            preview=preview,
            selectview_url=self._get_image_selectview_url()
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


class PreviewPageView(TemplateView):
    template_name = 'webdemo/pages/preview.django.html'

    def __get_page(self):
        if self.kwargs['pk'] is None:
            return PageCreateView.get_preview_data(self.request)
        else:
            # NOTE: The queryset ensures only admins on the current site gains access.
            site = self.request.cradmin_role
            return get_object_or_404(Page.objects.filter(site=site), pk=self.kwargs['pk'])

    def get_context_data(self, **kwargs):
        context = super(PreviewPageView, self).get_context_data(**kwargs)
        context['page'] = self.__get_page()
        return context


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
            r'^preview/(?P<pk>\d+)?$',
            PreviewPageView.as_view(),
            name="preview"),
        crapp.Url(
            r'^delete/(?P<pk>\d+)$',
            PageDeleteView.as_view(),
            name="delete"),
        crapp.Url(
            r'^multiedit/$',
            PageMultiEditView.as_view(),
            name="multiedit")
    ]
