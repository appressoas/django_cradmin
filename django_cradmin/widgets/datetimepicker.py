from django.forms import widgets
from django.template import loader
import datetime
import time


class DatePickerWidget(widgets.DateInput):
    """
    A Widget using AngularJS ui-bootstrap's `ui.bootstrap.datepicker` for selecting a date
    """
    template_name = 'django_cradmin/widgets/datepicker.django.html'

    def render(self, name, value, attrs=None):
        if value is None:
            value = ''
        print("DatePickerWidget, render, value: {}".format(value))
        return loader.render_to_string(self.template_name, {
            'dateformat': 'yyyy-MM-dd',
            'datevalue': value,
            'fieldid': attrs.get('id', 'id_{}'.format(name)),
            'fieldname': name,
            'show_date': True
        })


class TimePickerWidget(widgets.TimeInput):
    """
    A Widget using AngularJS ui-bootstrap's `ui.bootstrap.timepicker` for selecting a time
    """
    template_name = 'django_cradmin/widgets/timepicker.django.html'

    def render(self, name, value, attrs=None):
        if value is None:
            value = ''
        print("TimePickerWidget, render, value: {}".format(value))
        return loader.render_to_string(self.template_name, {
            'timevalue': value,
            'fieldid': attrs.get('id', 'id_{}'.format(name)),
            'fieldname': name,
            'hour_step': attrs.get('hour_step', 1),
            'minute_step': attrs.get('hour_step', 15),
            'show_time': True
        })



class DateTimePickerWidget(widgets.MultiWidget):
    """
    A Widget using AngularJS ui-bootstrap's `ui.bootstrap.datepicker` for selecting a date and
    `ui.bootstrap.timepicker` for selecting a time, then combining them in a single datetime
    """

    def __init__(self, attrs=None):
        _widgets = [
            DatePickerWidget(attrs=attrs),
            TimePickerWidget(attrs=attrs)
        ]
        super(DateTimePickerWidget, self).__init__(_widgets, attrs)

    def decompress(self, value):
        return [value, value]

    def format_output(self, rendered_widgets):
        return ''.join(rendered_widgets)

    def value_from_datadict(self, data, files, name):

        print(data)
        timevalue = data.get('{}_1'.format(name), '')
        datevalue = data.get('{}_0'.format(name), '')

        datetimevalue = '{} {}'.format(datevalue, timevalue)
        print(datetimevalue)

        # return time.strptime(datetimevalue, "%Y-%m-%d %H:%M")
        return datetimevalue

