from django.forms import widgets
from django.template.loader import render_to_string



class ModelChoiceWidget(widgets.TextInput):
    """
    Model choice autocomplete widget.
    """
    template_name = 'django_cradmin/widgets/modelchoice.django.html'
    input_type = 'text'

    def __init__(self, queryset, template_name=None):
        self.queryset = queryset
        if template_name:
            self.template_name = template_name
        super(ModelChoiceWidget, self).__init__()

    def get_object(self, pk):
        return self.queryset.get(pk=pk)

    def render(self, name, value, attrs=None):
        input_html = super(ModelChoiceWidget, self).render(
            name=name, value=value, attrs=attrs)
        preview = ''
        if not value is None:
            preview = self.get_object(pk=value)
        return render_to_string(self.template_name, {
            'input_html': input_html,
            'preview': preview,
            'has_value': value is not None
        })
