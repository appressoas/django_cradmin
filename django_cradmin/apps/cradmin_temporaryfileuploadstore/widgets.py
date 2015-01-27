from django import forms
from django.template.loader import render_to_string


class BulkFileUploadWidget(forms.Widget):
    template_name = 'django_cradmin/apps/cradmin_temporaryfileuploadstore/bulkfileupload-widget.django.html'

    def __init__(self, accept=None):
        """
        Parameters:
            accept (str): Comma separated string of filetypes that we should accept.
                Added to the file upload field as the accept attribute.
        """
        self.accept = accept
        super(BulkFileUploadWidget, self).__init__(attrs=None)

    def get_template_context_data(self, **context):
        """
        Can be overridden to adjust the template context data.
        """
        context['accept'] = self.accept
        return context

    def render(self, name, value, attrs=None):
        if value is None:
            value = ''
        return render_to_string(self.template_name, self.get_template_context_data(
            fieldname=name,
            fieldvalue=value))
