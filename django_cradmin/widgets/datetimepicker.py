import datetime
from django.forms import widgets
from django.forms.utils import flatatt
from django.template import loader
from django.utils.translation import ugettext_lazy as _

from django_cradmin.widgets.selectwidgets import WrappedSelect


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
    A Widget using :class:`.DatePickerWidget`
    for selecting a date and :class:`.TimePickerWidget`
    for selecting time.
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
        timevalue = data.get('{}_1'.format(name), '').strip()
        datevalue = data.get('{}_0'.format(name), '').strip()
        values = []
        if datevalue:
            values.append(datevalue)
        if timevalue:
            values.append(timevalue)
        datetimevalue = ' '.join(values)
        if datetimevalue:
            return datetimevalue
        else:
            return None


class SplitTimePickerWidget(widgets.MultiWidget):
    """
    Time picker widget that shows a select button is wrapped in a div with the
    ``django-cradmin-split-timepicker``.
    """

    def __init__(self, attrs=None,
                 hour_choices=None, minute_choices=None,
                 empty_hour_label=None, empty_minute_label=None):
        hour_choices = hour_choices or self.get_hour_choices(empty_hour_label)
        minute_choices = minute_choices or self.get_minute_choices(empty_minute_label)
        _widgets = [
            WrappedSelect(attrs=attrs, choices=hour_choices,
                          wrapper_css_class='django-cradmin-split-timepicker-hour'),
            WrappedSelect(attrs=attrs, choices=minute_choices,
                          wrapper_css_class='django-cradmin-split-timepicker-minute'),
        ]
        super(SplitTimePickerWidget, self).__init__(_widgets, attrs)

    def format_hour_label(self, number):
        return '{:02}'.format(number)

    def format_minute_label(self, number):
        return '{:02}'.format(number)

    def format_hour_choice(self, number):
        return number, self.format_hour_label(number)

    def format_minute_choice(self, number):
        return number, self.format_minute_label(number)

    def get_hour_values(self):
        return range(0, 25)

    def get_minute_values(self):
        minutevalues = list(range(0, 60, 5))
        minutevalues.append(59)
        return minutevalues

    def get_hour_choices(self, emptylabel):
        choices = list(map(self.format_hour_choice, self.get_hour_values()))
        if emptylabel is not None:
            choices.insert(0, (None, emptylabel))
        return choices

    def get_minute_choices(self, emptylabel):
        choices = list(map(self.format_minute_choice, self.get_minute_values()))
        if emptylabel is not None:
            choices.insert(0, (None, emptylabel))
        return choices

    def decompress(self, value):
        if value and isinstance(value, datetime.datetime):
            return [value.hour, value.minute]
        else:
            return [None, None]

    def format_output(self, rendered_widgets):
        return u'<div class="django-cradmin-split-timepicker">{}</div>'.format(
            u''.join(rendered_widgets))

    def value_from_datadict(self, data, files, name):
        hourvalue = data.get('{}_0'.format(name), '').strip()
        minutevalue = data.get('{}_1'.format(name), '').strip()
        values = []
        if hourvalue:
            values.append(hourvalue)
        if minutevalue:
            values.append(minutevalue)
        datetimevalue = ':'.join(values)
        if datetimevalue:
            return datetimevalue
        else:
            return None


class DateSplitTimePickerWidget(widgets.MultiWidget):
    """
    A Widget using :class:`.DatePickerWidget`
    for selecting a date and :class:`.SplitTimePickerWidget`
    for selecting time.
    """
    date_widget_class = DatePickerWidget
    time_widget_class = SplitTimePickerWidget

    def __init__(self, attrs=None,
                 datewidget_placeholder=_('yyyy-mm-dd'),
                 empty_hour_label=None,
                 empty_minute_label=None,
                 extra_css_class=None):
        self.extra_css_class = extra_css_class
        _widgets = [
            self.date_widget_class(attrs=attrs, placeholder=datewidget_placeholder),
            self.time_widget_class(attrs=attrs,
                                   empty_hour_label=empty_hour_label,
                                   empty_minute_label=empty_minute_label)
        ]
        super(DateSplitTimePickerWidget, self).__init__(_widgets, attrs)

    def decompress(self, value):
        return [value, value]

    def get_css_class(self):
        css_classes = ['django-cradmin-datetimepicker-split-time']
        if self.extra_css_class:
            css_classes.append(self.extra_css_class)
        return ' '.join(css_classes)

    def format_output(self, rendered_widgets):
        return u'<div class="{}">{}</div>'.format(
            self.get_css_class(),
            u''.join(rendered_widgets))

    def value_from_datadict(self, data, files, name):
        datevalue = data.get('{}_0'.format(name), '').strip()
        hourvalue = data.get('{}_1_0'.format(name), '').strip()
        minutevalue = data.get('{}_1_1'.format(name), '').strip()

        values = []
        timevalues = []
        if datevalue:
            values.append(datevalue)
        if hourvalue:
            timevalues.append(hourvalue)
        if minutevalue:
            timevalues.append(minutevalue)
        timevalues = ':'.join(timevalues)
        if timevalues:
            values.append(timevalues)
        datetimevalue = ' '.join(values)
        if datetimevalue:
            return datetimevalue
        else:
            return None
