from django import forms

class WysiHtmlTextArea(forms.widgets.Textarea):
    template = '' #TODO: make a template..

    def render(self, name, value, attrs=None):
        baseVal = super(WysiHtmlTextArea, self).render(name, value, attrs)

        return u'<div django_cradmin_wysihtml>{}</div>'.format(baseVal)
        #return render_to_string(template, {'textarea': baseVal}) #TODO: implement this instead on the above
