from django import forms
from django.template.loader import render_to_string


class BulkFileUploadWidget(forms.Widget):
    template_name = 'django_cradmin/apps/cradmin_temporaryfileuploadstore/bulkfileupload-widget.django.html'

    def __init__(self,
                 accept=None,
                 server_accept=None,
                 dropbox_text=None,
                 invalid_filetype_message=None,
                 advanced_fileselectbutton_text=None,
                 simple_fileselectbutton_text=None):
        """
        Parameters:
            accept (str): Comma separated string of filetypes that we should accept.
                Added to the file upload field as the accept attribute.
        """
        self.accept = accept
        self.server_accept = server_accept
        self.dropbox_text = dropbox_text
        self.invalid_filetype_message = invalid_filetype_message
        self.advanced_fileselectbutton_text = advanced_fileselectbutton_text
        self.simple_fileselectbutton_text = simple_fileselectbutton_text
        super(BulkFileUploadWidget, self).__init__(attrs=None)

    def get_template_context_data(self, **context):
        """
        Can be overridden to adjust the template context data.
        """
        context['accept'] = self.accept
        context['server_accept'] = self.server_accept
        context['dropbox_text'] = self.dropbox_text
        context['invalid_filetype_message'] = self.invalid_filetype_message
        context['advanced_fileselectbutton_text'] = self.advanced_fileselectbutton_text
        context['simple_fileselectbutton_text'] = self.simple_fileselectbutton_text
        return context

    def render(self, name, value, attrs=None):
        if value is None:
            value = ''
        return render_to_string(self.template_name, self.get_template_context_data(
            hiddenfieldname=name,
            fieldvalue=value))
