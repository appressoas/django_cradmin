import urllib
from django.utils.translation import ugettext_lazy as _
from crispy_forms import layout

from django_cradmin.viewhelpers import objecttable
from django_cradmin.viewhelpers import create
from django_cradmin.viewhelpers import update
from django_cradmin.viewhelpers import delete
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


class NameSelectColumn(objecttable.MultiActionColumn):
    modelfield = 'name'

    def get_buttons(self, obj):
        fieldname = self.view.request.GET['select_fieldname']
        # current_value = self.view.request.GET['select_current_value']
        redirect_url = self.view.request.GET['select_redirect_url']
        select_url = '{}?{}'.format(redirect_url, urllib.urlencode({
            'selected_fieldname': fieldname,
            'selected_value': obj.pk
        }))
        return [
            objecttable.Button(
                label=_('Use this'),
                url=select_url)
        ]



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
        'description'
    ]
    searchfields = ['name', 'description', 'file_extension']

    def get_buttons(self):
        app = self.request.cradmin_app
        return [
            objecttable.Button(_('Add image'), url=app.reverse_appurl('create')),
        ]


class ArchiveImagesSingleSelectView(ArchiveImagesQuerySetForRoleMixin, objecttable.ObjectTableView):
    model = ArchiveImage
    columns = [
        ImageColumn,
        NameSelectColumn,
        'description'
    ]
    searchfields = ['name', 'description', 'file_extension']

    def get_buttons(self):
        app = self.request.cradmin_app
        return [
            objecttable.Button(_('Add image'), url=app.reverse_appurl('create')),
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
    fields = ['image', 'description']

    def get_field_layout(self):
        return [
            layout.Div('image', css_class="cradmin-focusfield"),
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
    ]
