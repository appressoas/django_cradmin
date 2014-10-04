import urllib
from django.forms import widgets
from django.template.loader import render_to_string


class ModelChoiceWidget(widgets.TextInput):
    """
    Model choice autocomplete widget.
    """
    template_name = 'django_cradmin/widgets/modelchoice.django.html'
    input_type = 'text'

    def __init__(self, queryset, selectview_url, template_name=None):
        self.queryset = queryset
        self.selectview_url = selectview_url
        if template_name:
            self.template_name = template_name
        super(ModelChoiceWidget, self).__init__()

    def get_object(self, pk):
        return self.queryset.get(pk=pk)

    def _make_selectview_url(self, fieldid, current_value):
        return '{}?{}'.format(
            self.selectview_url, urllib.urlencode({
                'select_fieldid': fieldid,
                'select_current_value': current_value,
            }))

    def render(self, name, value, attrs=None):
        preview = ''
        if value is not None:
            preview = self.get_object(pk=value)
        fieldid = attrs['id']
        return render_to_string(self.template_name, {
            'preview': preview,
            'fieldname': name,
            'fieldid': fieldid,
            'fieldvalue': value,
            'selectview_url': self._make_selectview_url(fieldid, value)
        })
