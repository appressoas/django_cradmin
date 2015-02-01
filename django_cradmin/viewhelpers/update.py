from django.utils.translation import ugettext_lazy as _
from django.views.generic import UpdateView as DjangoUpdateView

from django_cradmin.crispylayouts import PrimarySubmit
from django_cradmin.crispylayouts import DefaultSubmit
from .crudbase import CreateUpdateViewMixin


class UpdateView(CreateUpdateViewMixin, DjangoUpdateView):
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

    def get_queryset_for_role(self, role):
        """
        Get a queryset with all objects of :obj:`.model`  that
        the current role can access.
        """
        raise NotImplementedError()

    def get_queryset(self):
        """
        DO NOT override this. Override :meth:`.get_queryset_for_role`
        instead.
        """
        queryset = self.get_queryset_for_role(self.request.cradmin_role)
        return queryset

    def get_success_message(self, object):
        return _('Saved "%(object)s".') % {'object': object}
