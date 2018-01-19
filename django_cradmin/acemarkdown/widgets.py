from __future__ import unicode_literals
import json
from django import forms
from django.template.loader import render_to_string


class AceMarkdownWidget(forms.widgets.Textarea):
    template_name = 'django_cradmin/acemarkdown/widget.django.html'
    directiveconfig = {
        # 'showTextarea': False,
        # 'theme': 'tomorrow'
    }

    @property
    def media(self):
        return forms.Media(
            js=[
                'django_cradmin/dist/vendor/js/ace-editor/ace.js',
            ]
        )

    def get_context(self, name, value, attrs):
        attrs = attrs.copy()
        attrs['textarea django-cradmin-acemarkdown-textarea'] = ''
        if 'required' in attrs:
            attrs['required'] = False
        return {
            'directiveconfig': json.dumps(self.directiveconfig),
            'widget': {
                'name': name,
                'value': value,
                'attrs': attrs
            }
        }
