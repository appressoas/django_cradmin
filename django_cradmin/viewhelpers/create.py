from django.utils.translation import ugettext_lazy as _
from django.views.generic import CreateView as DjangoCreateView

from django_cradmin.crispylayouts import PrimarySubmit
from django_cradmin.crispylayouts import DefaultSubmit
from .crudbase import CreateUpdateViewMixin


class CreateView(CreateUpdateViewMixin, DjangoCreateView):
    template_name = 'django_cradmin/viewhelpers/create.django.html'

    def get_buttons(self):
        buttons = [
            PrimarySubmit('submit-save', _('Create')),
            DefaultSubmit('submit-save-and-continue-editing', _('Create and continue editing')),
        ]
        preview_url = self.get_preview_url()
        if preview_url:
            buttons.append(DefaultSubmit('submit-preview', _('Preview')))
        return buttons

    def get_formhelper(self):
        helper = super(CreateView, self).get_formhelper()
        helper.form_id = 'django_cradmin_createform'
        return helper
