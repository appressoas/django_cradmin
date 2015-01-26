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
        max_file_size=1000000 * getattr(settings, 'CRADMIN_TEMPORARYFILEUPLOADSTORE_MAX_FILE_SIZE_MB', 1000))
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


class FileDeleteForm(forms.Form):
    collectionid = forms.IntegerField(required=True)
    temporaryfileid = forms.IntegerField(required=True)


class UploadTemporaryFilesView(FormView):
    form_class = FileUploadForm
    http_method_names = ['post', 'delete']

    def create_collection(self, collectionid, minutes_to_live):
        collection = TemporaryFileCollection(
            user=self.request.user)
        if minutes_to_live is not None:
            collection.minutes_to_live = minutes_to_live
        collection.full_clean()
        collection.save()
        return collection

    def get_existing_collection(self, collectionid):
        return TemporaryFileCollection.objects.filter(user=self.request.user).get(id=collectionid)

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
        return temporaryfile

    def form_invalid(self, form):
        return self.__invalid_form_response(form)

    def form_valid(self, form):
        collectionid = form.cleaned_data['collectionid']
        minutes_to_live = form.cleaned_data['minutes_to_live']
        try:
            collection = self.create_or_get_collection_id(collectionid, minutes_to_live)
        except TemporaryFileCollection.DoesNotExist:
            return self.__collection_does_not_exist_response(collectionid)
        else:
            uploadedfiles_data = []
            for formfile in form.cleaned_data['file']:
                temporaryfile = self.save_uploaded_file(
                    collection=collection,
                    formfile=formfile,
                    mode=form.cleaned_data['mode'])
                uploadedfiles_data.append({
                    'id': temporaryfile.id,
                    'filename': temporaryfile.filename
                })
            return self.json_response(json.dumps({
                'collectionid': collection.id,
                'temporaryfiles': uploadedfiles_data
            }))

    def json_response(self, data, status=200):
        return HttpResponse(
            data,
            content_type='application/json',
            status=status)

    def __collection_does_not_exist_response(self, collectionid):
        return self.json_response(json.dumps({
            'collectionid': [
                {
                    'message': 'Collection with id={} does not exist.'.format(collectionid),
                    'code': 'doesnotexist'
                }
            ]
        }), status=404)

    def __temporaryfile_does_not_exist_response(self, temporaryfileid):
        return self.json_response(json.dumps({
            'temporaryfileid': [
                {
                    'message': 'Temporary file with id={} does not exist.'.format(temporaryfileid),
                    'code': 'doesnotexist'
                }
            ]
        }), status=404)

    def __invalid_form_response(self, form):
        return self.json_response(form.errors.as_json(), status=400)

    def delete(self, request, *args, **kwargs):
        try:
            requestdata = json.loads(self.request.body)
        except ValueError:
            return self.json_response(json.dumps({
                'errormessage': 'Invalid JSON data in the request body.'
            }), status=400)

        form = FileDeleteForm(requestdata)
        if form.is_valid():
            collectionid = form.cleaned_data['collectionid']
            temporaryfileid = form.cleaned_data['temporaryfileid']
            try:
                collection = self.get_existing_collection(collectionid)
            except TemporaryFileCollection.DoesNotExist:
                return self.__collection_does_not_exist_response(collectionid)
            else:
                try:
                    temporaryfile = collection.files.get(id=temporaryfileid)
                except TemporaryFile.DoesNotExist:
                    return self.__temporaryfile_does_not_exist_response(temporaryfileid)
                else:
                    return self.perform_temporaryfile_delete(temporaryfile)
        else:
            return self.__invalid_form_response(form)

    def perform_temporaryfile_delete(self, temporaryfile):
        temporaryfileid = temporaryfile.id
        temporaryfile.delete_object_and_file()
        return self.json_response(json.dumps({
            'collectionid': temporaryfile.collection_id,
            'temporaryfileid': temporaryfileid
        }))
