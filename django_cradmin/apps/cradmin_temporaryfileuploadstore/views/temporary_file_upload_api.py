import json
from django.conf import settings
from django.http import HttpResponse
from django.views.generic import FormView

# from django.utils.translation import ugettext_lazy as _
from django import forms
from multiupload.fields import MultiFileField
from django_cradmin.apps.cradmin_temporaryfileuploadstore.models import TemporaryFileCollection, TemporaryFile


class FileUploadForm(forms.Form):
    file = MultiFileField(
        max_file_size=1000000 * getattr(settings, 'CRADMIN_TEMPORARYFILEUPLOADSTORE_MAX_FILE_SIZE_MB', 100))
    # file = forms.FileField()
    collectionid = forms.IntegerField(
        required=False)
    minutes_to_live = forms.IntegerField(
        min_value=1,
        required=False)
    mode = forms.ChoiceField(
        required=False,
        choices=[
            (None, 'Multifile'),
            ('singlefile', 'Single file')
        ]
    )


class UploadTemporaryFilesView(FormView):
    form_class = FileUploadForm
    http_method_names = ['post']

    # def post(self, request, *args, **kwargs):

    def create_collection(self, collectionid, minutes_to_live):
        collection = TemporaryFileCollection(
            user=self.request.user)
        if minutes_to_live is not None:
            collection.minutes_to_live = minutes_to_live
        collection.full_clean()
        collection.save()
        return collection

    def get_existing_collection(self, collectionid):
        return TemporaryFileCollection.objects.get(id=collectionid)

    def create_or_get_collection_id(self, collectionid, minutes_to_live):
        if collectionid is None:
            return self.create_collection(collectionid, minutes_to_live)
        else:
            return self.get_existing_collection(collectionid)

    def save_uploaded_file(self, collection, formfile, mode):
        if mode == 'singlefile':
            collection.clear_files()
        temporaryfile = TemporaryFile(collection=collection, filename=formfile.name)
        temporaryfile.file.save(formfile.name, formfile)

    def form_invalid(self, form):
        return self.json_response(form.errors.as_json(), status=400)

    def form_valid(self, form):
        print
        print "*" * 70
        print
        print form.cleaned_data
        print
        print "*" * 70
        print

        collectionid = form.cleaned_data['collectionid']
        minutes_to_live = form.cleaned_data['minutes_to_live']
        try:
            collection = self.create_or_get_collection_id(collectionid, minutes_to_live)
        except TemporaryFileCollection.DoesNotExist:
            return self.json_response(json.dumps({
                'collectionid': [
                    {
                        'message': 'The collection with id={} does not exist.'.format(collectionid),
                        'code': 'doesnotexist'
                    }
                ]
            }), status=400)
        else:
            for formfile in form.cleaned_data['file']:
                self.save_uploaded_file(
                    collection=collection,
                    formfile=formfile,
                    mode=form.cleaned_data['mode'])
            return self.json_response(json.dumps({
                'collectionid': collection.id
            }))

    def json_response(self, data, status=200):
        return HttpResponse(
            data,
            content_type='application/json',
            status=status)
