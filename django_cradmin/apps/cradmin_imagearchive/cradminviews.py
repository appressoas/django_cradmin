from django import http
from django.contrib import messages
from django.utils.translation import ugettext_lazy as _
from crispy_forms import layout
from django import forms
from django_cradmin.apps.cradmin_temporaryfileuploadstore.crispylayouts import BulkFileUploadSubmit
from django_cradmin.apps.cradmin_temporaryfileuploadstore.models import TemporaryFileCollection
from django_cradmin.apps.cradmin_temporaryfileuploadstore.widgets import BulkFileUploadWidget

from django_cradmin.viewhelpers import objecttable
from django_cradmin.viewhelpers import create
from django_cradmin.viewhelpers import update
from django_cradmin.viewhelpers import delete
from django_cradmin.viewhelpers import formbase
from django_cradmin import crapp
from django_cradmin.apps.cradmin_imagearchive.models import ArchiveImage
from django_cradmin.widgets import filewidgets


class NameColumn(objecttable.MultiActionColumn):
    modelfield = 'name'

    def get_buttons(self, obj):
        return [
            objecttable.Button(
                label=_('Edit'),
                url=self.reverse_appurl('edit', args=[obj.id])),
            objecttable.Button(
                label=_('Delete'),
                url=self.reverse_appurl('delete', args=[obj.id]),
                buttonclass="danger"),
        ]


class NameSelectColumn(objecttable.UseThisActionColumn):
    modelfield = 'name'

    def get_buttons(self, obj):
        return [
            objecttable.UseThisButton(
                view=self.view,
                label=_('Use this'),
                obj=obj)
        ]


class DescriptionColumn(objecttable.TruncatecharsPlainTextColumn):
    modelfield = 'description'
    maxlength = 80
    allcells_css_classes = ['hidden-xs']


class ImageColumn(objecttable.ImagePreviewColumn):
    modelfield = 'image'
    preview_width = 100
    preview_height = 70
    column_width = '100px'

    def get_header(self):
        return _('Preview')


class ArchiveImagesQuerySetForRoleMixin(object):
    """
    Used by listing, update and delete view to ensure
    that only images that the current role has access to
    is available.
    """
    def get_queryset_for_role(self, role):
        return ArchiveImage.objects.filter_owned_by_role(role)


class ArchiveImagesListView(ArchiveImagesQuerySetForRoleMixin, objecttable.ObjectTableView):
    model = ArchiveImage
    columns = [
        ImageColumn,
        NameColumn,
        DescriptionColumn,
    ]
    searchfields = ['name', 'description', 'file_extension']

    def get_buttons(self):
        app = self.request.cradmin_app
        return [
            objecttable.Button(_('Add image'), url=app.reverse_appurl('create')),
            objecttable.Button(_('Bulk upload'), url=app.reverse_appurl('bulkadd')),
        ]


class ArchiveImagesSingleSelectView(ArchiveImagesQuerySetForRoleMixin, objecttable.ObjectTableView):
    model = ArchiveImage
    columns = [
        ImageColumn,
        NameSelectColumn,
        'description'
    ]
    searchfields = ['name', 'description', 'file_extension']
    hide_menu = True
    # paginate_by = 10

    def make_foreignkey_preview_for(self, obj):
        return obj.get_preview_html()

    def get_buttons(self):
        app = self.request.cradmin_app
        return [
            objecttable.ForeignKeySelectButton(
                _('Add image'),
                request=self.request,
                url=app.reverse_appurl('create')),
        ]


class ArchiveImageCreateUpdateMixin(object):
    model = ArchiveImage
    roleid_field = 'role'

    def get_form(self, *args, **kwargs):
        form = super(ArchiveImageCreateUpdateMixin, self).get_form(*args, **kwargs)
        form.fields['image'].widget = filewidgets.ImageWidget(
            preview_width=300, preview_height=300, clearable=False)
        return form


class ArchiveImageCreateView(ArchiveImageCreateUpdateMixin, create.CreateView):
    """
    View used to create new images.
    """
    fields = ['image', 'name', 'description']

    submit_use_label = _('Upload and select')
    submit_save_label = _('Upload image')
    submit_save_and_continue_edititing_label = _('Upload and continue editing')

    def get_field_layout(self):
        return [
            layout.Div('image', css_class="cradmin-focusfield"),
            layout.Div('name', css_class="cradmin-focusfield cradmin-focusfield-lg"),
            layout.Div('description', css_class="cradmin-focusfield"),
        ]

    def save_object(self, form, commit=True):
        archiveimage = super(ArchiveImageCreateView, self).save_object(form, commit=False)
        image = archiveimage.image
        archiveimage.image = None
        archiveimage.save()
        archiveimage.image = image
        archiveimage.save()
        return archiveimage

    def get_success_message(self, object):
        return _(u'Uploaded "%(what)s".') % {'what': object}


class ArchiveImageUpdateView(ArchiveImagesQuerySetForRoleMixin, ArchiveImageCreateUpdateMixin, update.UpdateView):
    """
    View used to create edit existing images.
    """
    def get_field_layout(self):
        return [
            layout.Div('image', css_class="cradmin-focusfield"),
            layout.Div('name', css_class="cradmin-focusfield cradmin-focusfield-lg"),
            layout.Div('description', css_class="cradmin-focusfield"),
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
    template_name = 'django_cradmin/apps/cradmin_imagearchive/bulkadd.django.html'
    form_class = BulkAddForm
    form_attributes = {
        'django-cradmin-bulkfileupload-form': ''
    }
    form_id = 'django_cradmin_imagearchive_bulkadd_form'
    extra_form_css_classes = ['django-cradmin-form-noasterisk']

    def get_buttons(self):
        return [
            BulkFileUploadSubmit(
                'submit', _('Add to the image archive'),
                uploading_text=_('Uploading images'),
                uploading_icon_cssclass='fa fa-spinner fa-spin'),
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
        archiveimage.clean()
        archiveimage.save()
        archiveimage.image.save(temporaryfile.filename, temporaryfile.file)
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
        return _(u'Uploaded %(what)s') % {
            'what': u','.join(filenames)
        }

    def add_success_messages(self, temporaryfilecollection):
        """
        Called after the form has been saved, and after :meth:`.form_saved` has been called.

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
