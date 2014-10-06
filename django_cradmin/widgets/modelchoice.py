import urllib
from django.utils.translation import ugettext_lazy as _
from django.forms import widgets
from django.template.loader import render_to_string


class ModelChoiceWidget(widgets.TextInput):
    """
    Model choice widget that uses an iframe popup to enable users
    to select their foreign key value.
    """
    #: The template used to render the widget.
    template_name = 'django_cradmin/widgets/modelchoice.django.html'

    #: The HTMP input element type. Defaults to ``hidden``, but
    #: you can change it to something like ``text`` (mostly useful for debugging).
    input_type = 'hidden'

    #: The default select-button text. You can override this in a subclass,
    #: or use the ``selectbutton_text``-argument for the constructor to
    #: change the button text.
    default_selectbutton_text = _('Select ...')

    def __init__(self, queryset, selectview_url, preview='',
                 selectbutton_text=None):
        self.queryset = queryset
        self.preview = preview
        self.selectview_url = selectview_url
        self.selectbutton_text = selectbutton_text or self.default_selectbutton_text
        super(ModelChoiceWidget, self).__init__()

    # def get_object(self, pk):
    #     return self.queryset.get(pk=pk)

    def _make_selectview_url(self, fieldid, current_value):
        return '{}?{}'.format(
            self.selectview_url, urllib.urlencode({
                'foreignkey_select_current_value': current_value,
            }))

    def render(self, name, value, attrs=None):
        if value is None:
            value = ''
        fieldid = attrs['id']
        return render_to_string(self.template_name, {
            'preview': self.preview,
            'fieldname': name,
            'fieldid': fieldid,
            'fieldvalue': value,
            'selectview_url': self._make_selectview_url(fieldid, value),
            'selectbutton_text': self.selectbutton_text,
            'input_type': self.input_type,
        })
