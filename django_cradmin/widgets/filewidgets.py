from __future__ import unicode_literals
import posixpath
from django import forms
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.safestring import mark_safe


class ImageWidget(forms.ClearableFileInput):
    """
    Clearable image widget.

    Can be made un-clearable (for required fields) using the
    ``clearable`` argument for ``__init__``.
    """
    template_name = 'django_cradmin/filewidgets/imagewidget.django.html'

    #: Comma separated string of filetypes that we should accept.
    #: Added to the file upload field as the accept attribute.
    #: Defaults to ``"image/png,image/jpeg,image/gif"``.
    accept = 'image/*'

    def __init__(self, request, attrs=None, template_name=None, clearable=True,
                 preview_imagetype=None):
        self.request = request
        self.clearable = clearable
        if template_name:
            self.template_name = template_name
        self.preview_imagetype = preview_imagetype
        self.preview_fallback_options = {
            'width': 300,
            'height': 300
        }

        super(ImageWidget, self).__init__(attrs)

    def build_preview_url(self, imagepath):
        if imagepath:
            return self.request.build_absolute_uri(posixpath.join(settings.MEDIA_URL, imagepath))
        else:
            return None

    def render(self, name, value, attrs=None):
        attrs = attrs or {}
        attrs['django-cradmin-image-preview-filefield'] = ''
        if self.accept:
            attrs['accept'] = self.accept
        attrs['cradmin-filefield-value'] = value or ''
        input_html = forms.FileInput.render(self, name, value, attrs)
        imagepath = getattr(value, 'name', None)
        imageurl = self.build_preview_url(imagepath)

        output = render_to_string(self.template_name, {
            'input_html': input_html,
            'imageurl': imageurl,
            'clear_checkbox_name': self.clear_checkbox_name(name),
            'clearable': self.clearable,
            'preview_imagetype': self.preview_imagetype,
            'preview_fallback_options': self.preview_fallback_options,
        })
        return mark_safe(output)


class FileWidget(forms.ClearableFileInput):
    """
    Clearable file widget.

    Can be made un-clearable (for required fields) using the
    ``clearable`` argument for ``__init__``.
    """
    template_name = 'django_cradmin/filewidgets/filewidget.django.html'

    #: Comma separated string of filetypes that we should accept.
    #: Added to the file upload field as the accept attribute.
    #: Defaults to ``None``, which means that all filetypes are allowed.
    #: Example: ``"application/pdf,application/msword,text/plain"``.
    accept = None

    def __init__(self, attrs=None, template_name=None, clearable=True):
        self.clearable = clearable
        if template_name:
            self.template_name = template_name
        super(FileWidget, self).__init__(attrs)

    def render(self, name, value, attrs=None):
        attrs = attrs or {}
        if self.accept:
            attrs['accept'] = self.accept
        attrs['cradmin-filefield-value'] = value or ''
        input_html = forms.FileInput.render(self, name, value, attrs)
        file_path = getattr(value, 'name', None)
        if file_path:
            file_name = posixpath.basename(file_path)
        else:
            file_name = None

        output = render_to_string(self.template_name, {
            'input_html': input_html,
            'file_path': file_path,
            'file_name': file_name,
            'MEDIA_URL': settings.MEDIA_URL,
            'clear_checkbox_name': self.clear_checkbox_name(name),
            'clearable': self.clearable,
        })
        return mark_safe(output)
