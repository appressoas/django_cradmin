from django.forms import widgets
from django.forms.utils import flatatt
from django.template import loader
from django.utils.translation import ugettext_lazy as _


class DatePickerWidget(widgets.DateInput):
    """
    A Widget using AngularJS ui-bootstrap's `ui.bootstrap.datepicker` for selecting a date
    """
    template_name = 'django_cradmin/widgets/datepicker.django.html'

    def __init__(self, attrs=None, format=None, placeholder=_('yyyy-mm-dd')):
        if attrs is None:
            attrs = {}
        if placeholder:
            attrs['placeholder'] = placeholder
        super(DatePickerWidget, self).__init__(attrs=attrs, format=format)

    def render(self, name, value, attrs=None):
        if value is None:
            value = ''
        final_attrs = self.build_attrs(attrs, type=self.input_type, name=name)
        return loader.render_to_string(self.template_name, {
            'dateformat': 'yyyy-MM-dd',
            'datevalue': value,
            'fieldid': attrs.get('id', 'id_{}'.format(name)),
            'fieldname': name,
            'show_date': True,
            'attrs': flatatt(final_attrs)
        })


class TimePickerWidget(widgets.TimeInput):
    """
    Time picker widget that is wrapped in a div with the
    ``django-cradmin-timepicker`` css class.
    """
    template_name = 'django_cradmin/widgets/timepicker.django.html'

    def __init__(self, attrs=None, format=None, placeholder=_('hh:mm')):
        if attrs is None:
            attrs = {}
        if placeholder:
            attrs['placeholder'] = placeholder
        super(TimePickerWidget, self).__init__(attrs=attrs, format=format)

    def render(self, name, value, attrs=None):
        inputfield = super(TimePickerWidget, self).render(name, value, attrs)
        return loader.render_to_string(self.template_name, {
            'inputfield': inputfield,
            'fieldname': name
        })


class DateTimePickerWidget(widgets.MultiWidget):
    """
    A Widget using AngularJS ui-bootstrap's `ui.bootstrap.datepicker` for selecting a date and
    `ui.bootstrap.timepicker` for selecting a time, then combining them in a single datetime
    """

    def __init__(self, attrs=None,
                 datewidget_placeholder=_('yyyy-mm-dd'),
                 timewidget_placeholder=_('hh:mm')):
        _widgets = [
            DatePickerWidget(attrs=attrs, placeholder=datewidget_placeholder),
            TimePickerWidget(attrs=attrs, placeholder=timewidget_placeholder)
        ]
        super(DateTimePickerWidget, self).__init__(_widgets, attrs)

    def decompress(self, value):
        return [value, value]

    def format_output(self, rendered_widgets):
        return u'<div class="django-cradmin-datetimepicker">{}</div>'.format(
            u''.join(rendered_widgets))

    def value_from_datadict(self, data, files, name):
        timevalue = data.get('{}_1'.format(name), '')
        datevalue = data.get('{}_0'.format(name), '')
        datetimevalue = '{} {}'.format(datevalue, timevalue)
        return datetimevalue
