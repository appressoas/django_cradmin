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
    accept = 'image/png,image/jpeg,image/gif'

    def __init__(self, attrs=None, template_name=None, clearable=True,
                 preview_width=300, preview_height=200, preview_format='auto'):
        self.clearable = clearable
        if template_name:
            self.template_name = template_name
        self.preview_width = preview_width
        self.preview_height = preview_height
        self.preview_format = preview_format
        super(ImageWidget, self).__init__(attrs)

    def render(self, name, value, attrs=None):
        attrs = attrs or {}
        attrs['django-cradmin-image-preview-filefield'] = ''
        if self.accept:
            attrs['accept'] = self.accept
        input_html = forms.FileInput.render(self, name, value, attrs)
        output = render_to_string(self.template_name, {
            'input_html': input_html,
            'image_path': getattr(value, 'name', None),
            'MEDIA_URL': settings.MEDIA_URL,
            'clear_checkbox_name': self.clear_checkbox_name(name),
            'clearable': self.clearable,
            'preview_width': self.preview_width,
            'preview_height': self.preview_height,
            'preview_format': self.preview_format
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
