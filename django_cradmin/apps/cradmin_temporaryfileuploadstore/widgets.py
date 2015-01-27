from django import forms
from django.template.loader import render_to_string


class BulkFileUploadWidget(forms.Widget):
    template_name = 'django_cradmin/apps/cradmin_temporaryfileuploadstore/bulkfileupload-widget.django.html'

    def get_template_context_data(self, **kwargs):
        """
        Can be overridden to adjust the template context data.
        """
        return kwargs

    def render(self, name, value, attrs=None):
        if value is None:
            value = ''
        return render_to_string(self.template_name, self.get_template_context_data(
            fieldname=name,
            fieldvalue=value,
            widgetattrs=attrs))
