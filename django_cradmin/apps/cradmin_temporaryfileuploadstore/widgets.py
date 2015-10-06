from __future__ import unicode_literals
import json
from xml.sax.saxutils import quoteattr
from django import forms
from django.core.urlresolvers import reverse
from django.template.loader import render_to_string


class BulkFileUploadWidget(forms.Widget):
    template_name = 'django_cradmin/apps/cradmin_temporaryfileuploadstore/bulkfileupload-widget.django.html'

    def __init__(self,
                 accept=None,
                 apiparameters=None,
                 dropbox_text=None,
                 invalid_filetype_message=None,
                 advanced_fileselectbutton_text=None,
                 simple_fileselectbutton_text=None):
        """
        Parameters:
            accept (str): Comma separated string of filetypes that we should accept.
                Added to the file upload field as the accept attribute.
                Note that this is not validated serverside - use the accept attribute
                of ``apiparameters`` to do that.
            apiparameters (dict): Dict of API parameters. Here you can
                put values for the ``minutes_to_live``, ``accept``, ``max_filename_length``
                and ``unique_filenames`` attributes of
                :class:`django_cradmin.apps.cradmin_temporaryfileuploadstore.models.TemporaryFileCollection`.

                Example::

                    apiparameters = {
                        'minutes_to_live': 10,
                        'accept': 'application/pdf,text/plain,image/*',
                        'unique_filenames': True
                    }
        """
        self.accept = accept
        self.apiparameters = apiparameters or {}
        self.dropbox_text = dropbox_text
        self.invalid_filetype_message = invalid_filetype_message
        self.advanced_fileselectbutton_text = advanced_fileselectbutton_text
        self.simple_fileselectbutton_text = simple_fileselectbutton_text
        super(BulkFileUploadWidget, self).__init__(attrs=None)

    def get_apiurl(self):
        return reverse('cradmin_temporary_file_upload_api')

    def get_template_context_data(self, **context):
        """
        Can be overridden to adjust the template context data.
        """
        context['accept'] = self.accept
        context['dropbox_text'] = self.dropbox_text
        context['invalid_filetype_message'] = self.invalid_filetype_message
        context['advanced_fileselectbutton_text'] = self.advanced_fileselectbutton_text
        context['simple_fileselectbutton_text'] = self.simple_fileselectbutton_text
        context['apiparameters'] = quoteattr(json.dumps(self.apiparameters))
        context['apiurl'] = self.get_apiurl()
        return context

    def render(self, name, value, attrs=None):
        if value is None:
            value = ''
        return render_to_string(self.template_name, self.get_template_context_data(
            hiddenfieldname=name,
            fieldvalue=value))


class SingleFileUploadWidget(BulkFileUploadWidget):
    def __init__(self, *args, **kwargs):
        super(SingleFileUploadWidget, self).__init__(*args, **kwargs)
        self.apiparameters['singlemode'] = True

    def get_template_context_data(self, **context):
        context = super(SingleFileUploadWidget, self).get_template_context_data(**context)
        context['singlemode'] = True
        return context
