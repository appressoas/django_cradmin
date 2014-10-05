import urllib
import urlparse
from django.utils.translation import ugettext_lazy as _
from django.views.generic import CreateView as DjangoCreateView

from django_cradmin.crispylayouts import PrimarySubmit
from django_cradmin.crispylayouts import DefaultSubmit
from .crudbase import CreateUpdateViewMixin


class CreateView(CreateUpdateViewMixin, DjangoCreateView):
    template_name = 'django_cradmin/viewhelpers/create.django.html'

    #: If this is ``True`` (default), we go into foreignkey select mode
    #: if ``foreignkey_select_mode=1`` is in the querystring.
    #:
    #: Foreignkey select mode:
    #:
    #: - replaces the normal save buttons with a ``submit-use`` button.
    #: - removes the menu (sets the ``cradmin_hide_menu`` template context variable to ``True``).
    #: - add a ``foreignkey_selected_value=<selected pk>`` to the querystring of the success url.
    allow_foreignkey_select = True

    submit_use_label = _('Create and select')
    submit_save_label = _('Create')
    submit_save_and_continue_edititing_label = _('Create and continue editing')

    def get_buttons(self):
        if self._foreignkey_select_mode():
            buttons = [
                PrimarySubmit('submit-use', _('Create and select')),
            ]
        else:
            buttons = [
                PrimarySubmit('submit-save', self.submit_save_label),
                DefaultSubmit('submit-save-and-continue-editing', self.submit_save_and_continue_edititing_label),
            ]
        preview_url = self.get_preview_url()
        if preview_url:
            buttons.append(DefaultSubmit('submit-preview', _('Preview')))
        return buttons

    def get_default_save_success_url(self):
        url = super(CreateView, self).get_default_save_success_url()
        if self._foreignkey_select_mode():
            url = urllib.unquote_plus(url)
            urllist = list(urlparse.urlsplit(url))
            querystring = urllist[3]
            querydict = urlparse.parse_qs(querystring)
            querydict['foreignkey_selected_value'] = [unicode(self.object.pk)]
            urllist[3] = urllib.urlencode(querydict, doseq=True)
            url = urlparse.urlunsplit(urllist)
        return url

    def get_formhelper(self):
        helper = super(CreateView, self).get_formhelper()
        helper.form_id = 'django_cradmin_createform'
        return helper

    def _foreignkey_select_mode(self):
        return self.allow_foreignkey_select and self.request.GET.get('foreignkey_select_mode') == '1'

    def get_context_data(self, **kwargs):
        context = super(CreateView, self).get_context_data(**kwargs)
        context['cradmin_hide_menu'] = self._foreignkey_select_mode()
        return context
