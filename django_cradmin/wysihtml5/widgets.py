from __future__ import unicode_literals
from django import forms


class WysiHtmlTextArea(forms.widgets.Textarea):
    template = ''  # TODO: make a template..

    def render(self, name, value, attrs=None):
        baseVal = super(WysiHtmlTextArea, self).render(name, value, attrs)

        # return render_to_string(template, {'textarea': baseVal}) #TODO: implement this instead on the above
        return u'<div django_cradmin_wysihtml>{}</div>'.format(baseVal)
