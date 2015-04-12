from __future__ import unicode_literals
from django_cradmin.crispylayouts import CradminSubmitButton


class BulkFileUploadSubmit(CradminSubmitButton):
    template = 'django_cradmin/apps/cradmin_temporaryfileuploadstore/bulkfileupload-submit.django.html'
    extra_button_attributes = {
        'django-cradmin-bulkfileupload-submit': ''
    }

    def __init__(self, name, value, uploading_text=None, uploading_icon_cssclass=None, **kwargs):
        self.uploading_text = uploading_text or value
        self.uploading_icon_cssclass = uploading_icon_cssclass
        super(BulkFileUploadSubmit, self).__init__(
            name, value, **kwargs)
