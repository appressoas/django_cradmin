from django.utils.translation import ugettext_lazy as _
from django.views.generic import UpdateView as DjangoUpdateView

from django_cradmin.crispylayouts import PrimarySubmit
from django_cradmin.crispylayouts import DefaultSubmit
from .crudbase import CreateUpdateViewMixin
from django_cradmin.viewhelpers.mixins import QuerysetForRoleMixin


class UpdateView(QuerysetForRoleMixin, CreateUpdateViewMixin, DjangoUpdateView):
    template_name = 'django_cradmin/viewhelpers/update.django.html'

    def get_buttons(self):
        buttons = [
            PrimarySubmit('submit-save', _('Save')),
            DefaultSubmit('submit-save-and-continue-editing', _('Save and continue editing')),
        ]
        preview_url = self.get_preview_url()
        if preview_url:
            buttons.append(DefaultSubmit('submit-preview', _('Preview')))
        return buttons

    def get_formhelper(self):
        helper = super(UpdateView, self).get_formhelper()
        helper.form_id = 'django_cradmin_updateform'
        return helper

    def get_success_message(self, object):
        return _('Saved "%(object)s".') % {'object': object}


class UpdateRoleView(UpdateView):
    """
    Extends :class:`.UpdateView` to streamline editing the current role
    object.

    Just like :class:`.UpdateView`, but with the get_object and
    get_queryset_for_role methods implemented to edit the current role
    object.
    """
    def get_object(self, queryset=None):
        return self.get_queryset_for_role(self.request.cradmin_role).get()

    def get_queryset_for_role(self, role):
        return self.model.objects.filter(pk=role.pk)
