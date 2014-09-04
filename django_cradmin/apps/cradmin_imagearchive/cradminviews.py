from django.contrib.contenttypes.models import ContentType
from django.utils.translation import ugettext_lazy as _
from crispy_forms import layout

from django_cradmin.viewhelpers import objecttable
from django_cradmin.viewhelpers import create
from django_cradmin.viewhelpers import update
from django_cradmin.viewhelpers import delete
from django_cradmin import crapp

from django_cradmin.apps.cradmin_imagearchive.models import ArchiveImage



class NameColumn(objecttable.MultiActionColumn):
    modelfield = 'name'

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


class ArchiveImagesQuerySetForRoleMixin(object):
    """
    Used by listing, update and delete view to ensure
    that only pages that the current role has access to
    is available.
    """
    def get_queryset_for_role(self, role):
        return ArchiveImage.objects.filter(
            object_id=role.id,
            content_type=ContentType.objects.get_for_model(role.__class__))


class ArchiveImagesListView(ArchiveImagesQuerySetForRoleMixin, objecttable.ObjectTableView):
    model = ArchiveImage
    columns = [
        NameColumn,
        'description'
    ]
    searchfields = ['name', 'description', 'extension']

    def get_buttons(self):
        app = self.request.cradmin_app
        return [
            objecttable.Button(_('Create'), url=app.reverse_appurl('create')),
        ]


class ArchiveImageCreateUpdateMixin(object):
    model = ArchiveImage
    # roleid_field = 'role'

    def get_field_layout(self):
        return [
            layout.Div('name', css_class="cradmin-focusfield cradmin-focusfield-lg"),
            layout.Div('image', css_class="cradmin-focusfield"),
            layout.Div('description', css_class="cradmin-focusfield"),
            layout.Div('content_type'),
            layout.Div('object_id'),
        ]

    def get_form(self, *args, **kwargs):
        form = super(ArchiveImageCreateUpdateMixin, self).get_form(*args, **kwargs)
        # form.fields['body'].widget = WysiHtmlTextArea(attrs={})
        return form


class ArchiveImageCreateView(ArchiveImageCreateUpdateMixin, create.CreateView):
    """
    View used to create new pages.
    """
    def save_object(self, form):
        archiveimage = form.save(commit=False)
        image = archiveimage.image
        archiveimage.image = None
        archiveimage.save()
        archiveimage.image = image
        archiveimage.save()
        return archiveimage


class ArchiveImageUpdateView(ArchiveImagesQuerySetForRoleMixin, ArchiveImageCreateUpdateMixin, update.UpdateView):
    """
    View used to create edit existing pages.
    """


class ArchiveImageDeleteView(ArchiveImagesQuerySetForRoleMixin, delete.DeleteView):
    """
    View used to delete existing pages.
    """


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            ArchiveImagesListView.as_view(),
            name=crapp.INDEXVIEW_NAME),
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
