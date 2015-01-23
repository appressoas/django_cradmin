from django.conf import settings
from django.http import HttpResponse
from django.views.generic import FormView

# from django.utils.translation import ugettext_lazy as _
from django import forms
from multiupload.fields import MultiFileField


class FileUploadForm(forms.Form):
    # files = MultiFileField(
    #     max_file_size=1000000 * getattr(settings, 'CRADMIN_TEMPORARYFILEUPLOADSTORE_MAX_FILE_SIZE_MB', 100))
    file = forms.FileField()


class UploadTemporaryFilesView(FormView):
    form_class = FileUploadForm
    http_method_names = ['post']

    # def post(self, request, *args, **kwargs):

    def form_valid(self, form):
        print form.cleaned_data
        # for uploadedfile in form.cleaned_data['file']:
        #     print uploadedfile
        return HttpResponse('OK')
