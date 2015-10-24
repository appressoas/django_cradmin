from __future__ import unicode_literals
from builtins import object
import logging

from django import http
from django.contrib import messages
from django.core.files.base import ContentFile
from django.utils.translation import ugettext_lazy as _
from crispy_forms import layout
from django import forms
from django.views.generic.edit import FormMixin

from django_cradmin.apps.cradmin_temporaryfileuploadstore.models import TemporaryFileCollection
from django_cradmin.apps.cradmin_temporaryfileuploadstore.widgets import BulkFileUploadWidget, SingleFileUploadWidget
from django_cradmin.utils import crhumanize
from django_cradmin.viewhelpers import objecttable
from django_cradmin.viewhelpers import crudbase
from django_cradmin.viewhelpers import update
from django_cradmin.viewhelpers import create
from django_cradmin.viewhelpers import delete
from django_cradmin.viewhelpers import formbase
from django_cradmin import crapp
from django_cradmin import crsettings
from django_cradmin.apps.cradmin_imagearchive.models import ArchiveImage

logger = logging.getLogger(__name__)


class DescriptionColumn(objecttable.MultiActionColumn):
    modelfield = 'description'

    def render_value(self, obj):
        return obj.screenreader_text

    def get_buttons(self, obj):
        edit_description_label = _('Set a description')
        if obj.description:
            edit_description_label = _('Edit description')
        return [
            objecttable.Button(
                label=edit_description_label,
                url=self.reverse_appurl('edit', args=[obj.id])),
            objecttable.Button(
                label=_('Delete'),
                url=self.reverse_appurl('delete', args=[obj.id]),
                buttonclass="btn btn-danger btn-sm"),
        ]


class DescriptionSelectColumn(objecttable.UseThisActionColumn):
    modelfield = 'description'

    def render_value(self, obj):
        return obj.screenreader_text

    def get_buttons(self, obj):
        return [
            objecttable.UseThisButton(
                view=self.view,
                label=_('Use this'),
                obj=obj)
        ]


class ImageColumn(objecttable.ImagePreviewColumn):
    modelfield = 'image'
    column_width = None

    preview_fallbackoptions = {
        'width': 100,
        'height': 65,
    }

    def get_column_width(self):
        if self.column_width:
            return self.column_width
        else:
            width = crsettings.get_setting('DJANGO_CRADMIN_IMAGEARCHIVE_LISTING_IMAGEWIDTH', 100)
            return '{}px'.format(width)

    def get_preview_imagetype(self):
        imagetype_from_settings = crsettings.get_setting('DJANGO_CRADMIN_IMAGEARCHIVE_LISTING_IMAGETYPE')
        if self.preview_imagetype:
            return self.preview_imagetype
        elif imagetype_from_settings:
            return imagetype_from_settings
        else:
            return None

    def get_header(self):
        return _('Preview')


class ArchiveImagesQuerySetForRoleMixin(object):
    """
    Used by listing, update and delete view to ensure
    that only images that the current role has access to
    is available.
    """
    def get_queryset_for_role(self, role):
        return ArchiveImage.objects.filter_owned_by_role(role)\
            .order_by('-created_datetime')


def get_bulkupload_apiparameters():
    apiparameters = {
        'accept': 'image/png,image/jpeg,image/gif',
    }
    max_filesize_bytes = crsettings.get_setting('DJANGO_CRADMIN_IMAGEARCHIVE_MAX_FILESIZE', None)
    if max_filesize_bytes is not None:
        apiparameters['max_filesize_bytes'] = crhumanize.dehumanize_readable_filesize(max_filesize_bytes)
    return apiparameters


class BulkAddForm(forms.Form):
    filecollectionid = forms.IntegerField(
        required=True,
        widget=BulkFileUploadWidget(
            autosubmit=True,
            accept='image/*',
            # accept='image/png,image/jpeg,image/gif',  # NOTE: Does not work with the fileselector in firefox
            apiparameters=get_bulkupload_apiparameters(),
            dropbox_text=_('Upload images by dragging and dropping them here'),
            invalid_filetype_message=_('Invalid filetype. You can only upload images.'),
            advanced_fileselectbutton_text=_('... or select images'),
            simple_fileselectbutton_text=_('Select images ...')
        ),
        label=_('Upload at least one image'),
        error_messages={
            'required': _('You must upload at least one image.')
        })


class SingleAddForm(forms.Form):
    filecollectionid = forms.IntegerField(
        required=True,
        widget=SingleFileUploadWidget(
            autosubmit=True,
            accept='image/*',
            apiparameters=get_bulkupload_apiparameters(),
            dropbox_text=_('Upload an image by dragging and dropping it here'),
            advanced_fileselectbutton_text=_('... or select an image'),
            invalid_filetype_message=_('Invalid filetype. You can only upload images.'),
            simple_fileselectbutton_text=_('Select an image ...')
        ),
        label=_('Upload an image'),
        error_messages={
            'required': _('You must upload an image.')
        })

    def clean(self):
        cleaned_data = super(SingleAddForm, self).clean()
        filecollectionid = cleaned_data.get('filecollectionid', None)
        if filecollectionid is not None:
            collection = TemporaryFileCollection.objects.get(id=filecollectionid)
            filecount = collection.files.count()
            if filecount < 1:
                raise forms.ValidationError({
                    'filecollectionid': _('You must upload an image.')
                })
            elif filecount > 1:
                raise forms.ValidationError({
                    'filecollectionid': _('You must upload exactly one image.')
                })


class AddImageOverlayButton(objecttable.NonSubmitButton):
    def get_html_attributes(self):
        attributes = super(AddImageOverlayButton, self).get_html_attributes()
        attributes['django-cradmin-bulkfileupload-show-overlay'] = 'filecollectionid'
        return attributes


class BaseImagesListView(ArchiveImagesQuerySetForRoleMixin, objecttable.ObjectTableView,
                         formbase.FormViewMixin, FormMixin):
    searchfields = ['name', 'description', 'file_extension']
    hide_column_headers = True
    model = ArchiveImage
    paginate_by = 15

    form_id = 'django_cradmin_imagearchive_bulkadd_form'
    extra_form_css_classes = ['django-cradmin-form-noasterisk', 'django-cradmin-bulkfileupload-form-overlay']
    template_name = 'django_cradmin/apps/cradmin_imagearchive/listview.django.html'

    def get_form_attributes(self):
        return {
            'django-cradmin-bulkfileupload-form': '',
            'django-cradmin-bulkfileupload-form-overlay': 'true',
            'django-cradmin-bulkfileupload-form-open-overlay-on-window-dragdrop': 'true'
        }

    def get_field_layout(self):
        return [
            layout.Div(
                'filecollectionid',
                # css_class="cradmin-globalfields"),
                css_class="cradmin-focusfield"),
        ]

    def get_buttons(self):
        return [
            AddImageOverlayButton(label=_('Add image'), buttonclass='btn btn-primary')
        ]

    def get_button_layout(self):
        # Overridden because get_buttons from formbase.FormView and
        # objecttable.ObjectTableView both use get_buttons().
        return []

    def get_formhelper(self):
        formhelper = super(BaseImagesListView, self).get_formhelper()
        formhelper.form_show_labels = False
        return formhelper

    def upload_file_to_archive(self, temporaryfile):
        archiveimage = ArchiveImage(
            role=self.request.cradmin_role,
            name=temporaryfile.filename)
        archiveimage.file_size = temporaryfile.file.size
        archiveimage.clean()
        archiveimage.save()
        archiveimage.image.save(temporaryfile.filename, ContentFile(temporaryfile.file.read()))
        archiveimage.full_clean()
        return archiveimage

    def upload_files_to_archive(self, temporaryfilecollection):
        uploaded_archiveimages = []
        for temporaryfile in temporaryfilecollection.files.all():
            uploaded_archiveimage = self.upload_file_to_archive(temporaryfile)
            uploaded_archiveimages.append(uploaded_archiveimage)
        return uploaded_archiveimages

    def get_collectionqueryset(self):
        return TemporaryFileCollection.objects\
            .filter_for_user(self.request.user)\
            .prefetch_related('files')

    def get_success_message(self, temporaryfilecollection):
        """
        Override this to provide a success message.

        The ``temporaryfilecollection`` is the TemporaryFileCollection that was just uploaded.

        Used by :meth:`.add_success_messages`.
        """
        filenames = [u'"{}"'.format(temporaryfile.filename) for temporaryfile in temporaryfilecollection.files.all()]
        return _(u'Uploaded %(what)s.') % {
            'what': u','.join(filenames)
        }

    def add_success_messages(self, temporaryfilecollection):
        """
        Add success messages on successful upload.

        The ``temporaryfilecollection`` is the TemporaryFileCollection that was just uploaded.

        Defaults to add :meth:`.get_success_message` as a django messages
        success message if :meth:`.get_success_message` returns anything.

        You can override this to add multiple messages or to show messages in some other way.
        """
        success_message = self.get_success_message(temporaryfilecollection)
        if success_message:
            messages.success(self.request, success_message)

    def form_valid(self, form):
        collectionid = form.cleaned_data['filecollectionid']
        try:
            temporaryfilecollection = self.get_collectionqueryset().get(id=collectionid)
        except TemporaryFileCollection.DoesNotExist:
            return http.HttpResponseNotFound()
        else:
            # We use ``uploaded_archiveimages`` in :meth:`.ArchiveImagesSingleSelectView.get_success_url`
            self.uploaded_archiveimages = self.upload_files_to_archive(temporaryfilecollection)
            self.add_success_messages(temporaryfilecollection)
            temporaryfilecollection.clear_files_and_delete()
            return http.HttpResponseRedirect(self.get_success_url())

    def form_invalid(self, form):
        self.object_list = self.get_queryset()
        return super(BaseImagesListView, self).form_invalid(form)

    def post(self, request, *args, **kwargs):
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        if form.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)

    def get_context_data(self, **kwargs):
        context = super(BaseImagesListView, self).get_context_data(**kwargs)
        self.add_context_data(context)
        if 'form' not in context:
            form_class = self.get_form_class()
            form = self.get_form(form_class)
            context['form'] = form
        return context


class ArchiveImagesListView(BaseImagesListView):
    """
    The list view in the image achive app.
    """
    columns = [
        ImageColumn,
        DescriptionColumn,
    ]
    form_class = BulkAddForm

    # def get_button_layout(self):
    #     return [
    #         layout.Div(PrimarySubmit('save', _('Upload images')),
    #                    css_class="django_cradmin_submitrow")
    #     ]


class ArchiveImagesSingleSelectView(BaseImagesListView):
    """
    Used when selecting a single archive image as a foreign key.
    """
    columns = [
        ImageColumn,
        DescriptionSelectColumn,
    ]
    hide_menu = True
    form_class = SingleAddForm
    listing_viewname = 'singleselect'

    def make_foreignkey_preview_for(self, obj):
        archiveimage = obj
        return archiveimage.get_preview_html(request=self.request)

    # def get_button_layout(self):
    #     return [
    #         layout.Div(PrimarySubmit('save', _('Upload image')),
    #                    css_class="django_cradmin_submitrow")
    #     ]

    def get_success_url(self):
        url = self.request.build_absolute_uri()
        uploaded_archiveimage = self.uploaded_archiveimages[0]
        url = create.CreateView.add_foreignkey_selected_value_to_url_querystring(url, uploaded_archiveimage.pk)
        return url


class ArchiveImageUpdateView(crudbase.OnlySaveButtonMixin,
                             ArchiveImagesQuerySetForRoleMixin,
                             update.UpdateView):
    """
    View used to create edit existing images.
    """
    model = ArchiveImage
    fields = ['description']
    roleid_field = 'role'

    def get_field_layout(self):
        return [
            layout.Div(
                layout.Field('description', css_class='cradmin-textarea-small'),
                css_class='cradmin-globalfields'
            )
        ]


class ArchiveImageDeleteView(ArchiveImagesQuerySetForRoleMixin, delete.DeleteView):
    """
    View used to delete existing images.
    """


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            ArchiveImagesListView.as_view(),
            name=crapp.INDEXVIEW_NAME),
        crapp.Url(
            r'^singleselect$',
            ArchiveImagesSingleSelectView.as_view(),
            name='singleselect'),
        crapp.Url(
            r'^edit/(?P<pk>\d+)$',
            ArchiveImageUpdateView.as_view(),
            name="edit"),
        crapp.Url(
            r'^delete/(?P<pk>\d+)$',
            ArchiveImageDeleteView.as_view(),
            name="delete")
    ]
