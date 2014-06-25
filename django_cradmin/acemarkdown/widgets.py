from django import forms
from django.template.loader import render_to_string


class AceMarkdownWidget(forms.widgets.Textarea):
    template_name = 'django_cradmin/acemarkdown/widget.django.html'

    def render(self, name, value, attrs=None):
        attrs = attrs.copy()
        attrs['textarea django-cradmin-acemarkdown-textarea'] = ''
        textarea = super(AceMarkdownWidget, self).render(name, value, attrs)
        return render_to_string(
            self.template_name, {
                'textarea': textarea
            }
        )
