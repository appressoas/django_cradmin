from __future__ import unicode_literals
from builtins import object
import logging
from django import http
from django.contrib import messages
from django.core.files.base import ContentFile
from django.utils.translation import ugettext_lazy as _
from crispy_forms import layout
from django import forms
import os
from django_cradmin.apps.cradmin_temporaryfileuploadstore.crispylayouts import BulkFileUploadSubmit
from django_cradmin.apps.cradmin_temporaryfileuploadstore.models import TemporaryFileCollection
from django_cradmin.apps.cradmin_temporaryfileuploadstore.widgets import BulkFileUploadWidget, SingleFileUploadWidget
from django_cradmin.templatetags.cradmin_icon_tags import cradmin_icon

from django_cradmin.viewhelpers import objecttable
from django_cradmin.viewhelpers import crudbase
from django_cradmin.viewhelpers import create
from django_cradmin.viewhelpers import update
from django_cradmin.viewhelpers import delete
from django_cradmin.viewhelpers import formbase
from django_cradmin import crapp
from django_cradmin import crsettings
from django_cradmin.apps.cradmin_imagearchive.models import ArchiveImage
from django_cradmin.widgets import filewidgets


logger = logging.getLogger(__name__)


class DescriptionColumn(objecttable.MultiActionColumn):
    modelfield = 'description'

    def render_value(self, obj):
        return obj.screenreader_text

    def get_buttons(self, obj):
        return [
            objecttable.Button(
                label=_('Edit'),
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


class ArchiveImagesListView(ArchiveImagesQuerySetForRoleMixin, objecttable.ObjectTableView):
    model = ArchiveImage
    columns = [
        ImageColumn,
        DescriptionColumn,
    ]
    searchfields = ['name', 'description', 'file_extension']
    hide_column_headers = True

    def get_buttons(self):
        app = self.request.cradmin_app
        return [
            objecttable.Button(label=_('Add image'),
                               url=app.reverse_appurl('create'),
                               buttonclass='btn btn-primary'),
            objecttable.Button(label=_('Bulk upload'),
                               url=app.reverse_appurl('bulkadd'),
                               buttonclass='btn btn-default'),
        ]


class ArchiveImagesSingleSelectView(ArchiveImagesQuerySetForRoleMixin, objecttable.ObjectTableView):
    model = ArchiveImage
    columns = [
        ImageColumn,
        DescriptionSelectColumn,
    ]
    searchfields = ['name', 'description', 'file_extension']
    hide_menu = True
    # paginate_by = 10
    hide_column_headers = True

    def make_foreignkey_preview_for(self, obj):
        archiveimage = obj
        return archiveimage.get_preview_html(request=self.request)

    def get_buttons(self):
        app = self.request.cradmin_app
        return [
            objecttable.ForeignKeySelectButton(
                label=_('Add image'),
                buttonclass='btn btn-primary',
                request=self.request,
                url=app.reverse_appurl('create')),
        ]


class ArchiveImageCreateUpdateMixin(object):
    model = ArchiveImage
    roleid_field = 'role'
    form_attributes = {
        'django-cradmin-bulkfileupload-form': ''
    }
    form_id = 'django_cradmin_imagearchive_bulkadd_form'
    extra_form_css_classes = ['django-cradmin-form-noasterisk']

    def get_preview_imagetype(self):
        """
        Get the ``imagetype`` to use with
        :func:`~django_cradmin.templatetags.cradmin_image_tags.cradmin_create_archiveimage_tag`.
        to generate the preview.
        """
        return crsettings.get_setting('DJANGO_CRADMIN_IMAGEARCHIVE_PREVIEW_IMAGETYPE')

    def get_form_class(self):
        form_class = super(ArchiveImageCreateUpdateMixin, self).get_form_class()

        class ArchiveImageForm(form_class):
            filecollectionid = forms.IntegerField(
                required=False,
                widget=SingleFileUploadWidget(
                    accept='image/*',
                    apiparameters={
                        'accept': 'image/png,image/jpeg,image/gif'
                    },
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
                cleaned_data = super(ArchiveImageForm, self).clean()
                filecollectionid = cleaned_data.get('filecollectionid', None)
                if filecollectionid is not None:
                    collection = TemporaryFileCollection.objects.get(id=filecollectionid)
                    if collection.files.count() < 1:
                        raise forms.ValidationError({
                            'filecollectionid': _('You must upload an image.')
                        })

        return ArchiveImageForm

    def get_form(self, form_class=None):
        form = super(ArchiveImageCreateUpdateMixin, self).get_form(form_class=form_class)
        return form

    def get_collectionqueryset(self):
        return TemporaryFileCollection.objects\
            .filter_for_user(self.request.user)\
            .prefetch_related('files')

    def save_object_with_new_imagefile(self, form):
        collectionid = form.cleaned_data['filecollectionid']
        try:
            temporaryfilecollection = self.get_collectionqueryset().get(id=collectionid)
        except TemporaryFileCollection.DoesNotExist:
            return http.HttpResponseNotFound()
        else:
            temporaryfile = temporaryfilecollection.files.first()
            archiveimage = super(ArchiveImageCreateUpdateMixin, self).save_object(form, commit=False)
            archiveimage.file_size = temporaryfile.file.size
            archiveimage.name = os.path.splitext(temporaryfile.filename)[0]
            archiveimage.clean()
            archiveimage.save()
            archiveimage.image.save(temporaryfile.filename, ContentFile(temporaryfile.file.read()))
            archiveimage.full_clean()
            temporaryfilecollection.clear_files_and_delete()
            return archiveimage


class ArchiveImageCreateView(crudbase.OnlySaveButtonMixin,
                             ArchiveImageCreateUpdateMixin,
                             create.CreateView):
    """
    View used to create new images.
    """
    fields = ['description']

    submit_use_label = _('Upload and select')
    submit_save_label = _('Upload image')
    submit_save_and_continue_edititing_label = _('Upload and continue editing')

    def get_field_layout(self):
        return [
            layout.Div(
                'filecollectionid',
                layout.Field('description', css_class='cradmin-textarea-small'),
                css_class='cradmin-globalfields'
            )
        ]

    def get_form(self, form_class=None):
        form = super(ArchiveImageCreateView, self).get_form(form_class=form_class)
        form.fields['filecollectionid'].required = True
        return form

    def save_object(self, form, commit=True):
        return self.save_object_with_new_imagefile(form)

    def get_success_message(self, object):
        what = u'"{}"'.format(object)
        return _(u'Uploaded %(what)s.') % {'what': what}


class ArchiveImageUpdateView(crudbase.OnlySaveButtonMixin,
                             ArchiveImagesQuerySetForRoleMixin,
                             update.UpdateView):
    """
    View used to create edit existing images.
    """
    model = ArchiveImage
    fields = ['name', 'description']
    roleid_field = 'role'

    def get_field_layout(self):
        return [
            layout.Div(
                layout.Field('name'),
                layout.Field('description', css_class='cradmin-textarea-small'),
                css_class='cradmin-globalfields'
            )
        ]


class ArchiveImageDeleteView(ArchiveImagesQuerySetForRoleMixin, delete.DeleteView):
    """
    View used to delete existing images.
    """


class BulkAddForm(forms.Form):
    filecollectionid = forms.IntegerField(
        required=True,
        widget=BulkFileUploadWidget(
            accept='image/*',
            # accept='image/png,image/jpeg,image/gif',  # NOTE: Does not work with the fileselector in firefox
            apiparameters={
                'accept': 'image/png,image/jpeg,image/gif'
            },
            dropbox_text=_('Upload images by dragging and dropping them here'),
            invalid_filetype_message=_('Invalid filetype. You can only upload images.'),
            advanced_fileselectbutton_text=_('... or select images'),
            simple_fileselectbutton_text=_('Select images ...')
        ),
        label=_('Upload at least one image'),
        help_text=_(
            'Upload as many images as you like. '
            'You can edit the name and description of the images after they have been uploaded.'),
        error_messages={
            'required': _('You must upload at least one file.')
        })


class ArchiveImageBulkAddView(formbase.FormView):
    form_class = BulkAddForm
    form_attributes = {
        'django-cradmin-bulkfileupload-form': ''
    }
    form_id = 'django_cradmin_imagearchive_bulkadd_form'
    extra_form_css_classes = ['django-cradmin-form-noasterisk']

    def get_pagetitle(self):
        return _('Bulk upload archive images')

    def get_buttons(self):
        return [
            BulkFileUploadSubmit(
                'submit', _('Add to the image archive'),
                uploading_text=_('Uploading images'),
                uploading_icon_cssclass=cradmin_icon('loadspinner')),
        ]

    def get_field_layout(self):
        return [
            layout.Div(
                'filecollectionid',
                # css_class="cradmin-globalfields"),
                css_class="cradmin-focusfield"),
        ]

    def get_formhelper(self):
        formhelper = super(ArchiveImageBulkAddView, self).get_formhelper()
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

    def upload_files_to_archive(self, temporaryfilecollection):
        for temporaryfile in temporaryfilecollection.files.all():
            self.upload_file_to_archive(temporaryfile)

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
            self.upload_files_to_archive(temporaryfilecollection)
            self.add_success_messages(temporaryfilecollection)
            temporaryfilecollection.clear_files_and_delete()
            return http.HttpResponseRedirect(self.get_success_url())


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
            r'^create$',
            ArchiveImageCreateView.as_view(),
            name="create"),
        crapp.Url(
            r'^edit/(?P<pk>\d+)$',
            ArchiveImageUpdateView.as_view(),
            name="edit"),
        crapp.Url(
            r'^delete/(?P<pk>\d+)$',
            ArchiveImageDeleteView.as_view(),
            name="delete"),
        crapp.Url(
            r'bulkadd$',
            ArchiveImageBulkAddView.as_view(),
            name='bulkadd'
        )
    ]
