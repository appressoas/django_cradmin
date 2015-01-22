from django.utils.translation import ugettext_lazy as _
from django.forms import formset_factory
from django.views.generic import TemplateView
from django_cradmin import crapp


class BulkFileUploadView(TemplateView):
    template_name = 'django_cradmin/viewhelpers/bulkfileupload.django.html'

    #: Get the view name for the listing page.
    #: You can set this, or implement :meth:`.get_listing_url`.
    #: Defaults to :obj:`django_cradmin.crapp.INDEXVIEW_NAME`.
    listing_viewname = crapp.INDEXVIEW_NAME

    #: The form class used in the file upload form set.
    form_class = None

    #: See :meth:`.get_submit_button_label`.
    submit_button_label = _('Upload files')

    def get_pagetitle(self):
        """
        Get the page title/heading. Must be overridden in subclasses.
        """
        raise NotImplementedError()

    def get_submit_button_label(self):
        """
        Get the submit button label.
        """
        return self.submit_button_label

    def get_form_class(self):
        return self.form_class

    def formset_factory(self, form_class):
        return formset_factory(form_class, extra=3)

    def get_formset_prefix(self):
        return 'multifile_formset'

    def get_minumum_files(self):
        return 1

    def create_formset(self):
        multifileformsetclass = self.formset_factory(self.get_form_class())
        kwargs = {
            'prefix': self.get_formset_prefix()
        }
        if self.request.method == 'POST':
            kwargs.update(
                data=self.request.POST,
                files=self.request.FILES)
        return multifileformsetclass(**kwargs)

    def post(self, *args, **kwargs):
        multifile_formset = self.create_formset()
        if multifile_formset.is_valid():
            uploadedfiles = [data['file'] for data in multifile_formset.cleaned_data if 'file' in data]
            if len(uploadedfiles) < self.get_minumum_files():
                return self.render_to_response(self.get_context_data(
                    no_files_selected=True,
                    multifile_formset=multifile_formset))
            else:
                return self.formset_valid(uploadedfiles)
        else:
            raise Exception('Getting here should not be possible.')

    def formset_valid(self, uploadedfiles):
        """
        Called when the formset is validated. Must be overridden in subclasses.
        """
        raise NotImplementedError()

    def get_listing_url(self):
        """
        Get the URL of the listing view.

        Defaults to :obj:`.listing_viewname`.
        """
        return self.request.cradmin_app.reverse_appurl(self.listing_viewname)

    def get_success_url(self):
        if 'success_url' in self.request.GET:
            return self.request.GET['success_url']
        else:
            return self.get_listing_url()

    def get_context_data(self, **kwargs):
        context = super(BulkFileUploadView, self).get_context_data(**kwargs)
        if 'multifile_formset' not in context:
            context['multifile_formset'] = self.create_formset()
        context['pagetitle'] = self.get_pagetitle()
        context['submit_button_label'] = self.get_submit_button_label()
        context['formset_prefix'] = self.get_formset_prefix()
        return context
