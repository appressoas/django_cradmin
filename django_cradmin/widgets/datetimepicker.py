from __future__ import unicode_literals
import datetime
from django.forms import widgets
from django.template import loader
from django.utils.translation import ugettext_lazy as _
import json
from builtins import str
from django_cradmin.templatetags.cradmin_icon_tags import cradmin_icon

from django_cradmin.widgets.selectwidgets import WrappedSelect


class DatePickerWidget(widgets.TextInput):
    """
    A Widget for selecting a date.
    """
    template_name = 'django_cradmin/widgets/datepicker.django.html'
    default_buttonlabel = _('Change date')
    default_buttonlabel_novalue = _('Select a date')
    default_usebuttonlabel = _('Use')
    default_close_iconkey = 'x'
    # default_year_emptyvalue = _('Year')
    # default_month_emptyvalue = _('Month')
    # default_day_emptyvalue = _('Day')
    # default_hour_emptyvalue = _('Hour')
    # default_minute_emptyvalue = _('Minute')

    def __init__(self, *args, **kwargs):
        self.no_value_preview_text = kwargs.pop('no_value_preview_text', '')
        self.buttonlabel = kwargs.pop('buttonlabel', self.default_buttonlabel)
        self.buttonlabel_novalue = kwargs.pop('buttonlabel_novalue', self.default_buttonlabel_novalue)
        self.usebuttonlabel = kwargs.pop('usebuttonlabel', self.default_usebuttonlabel)
        self.close_iconkey = kwargs.pop('close_iconkey', self.default_close_iconkey)
        # self.year_emptyvalue = kwargs.pop('year_emptyvalue', self.default_year_emptyvalue)
        # self.month_emptyvalue = kwargs.pop('month_emptyvalue', self.default_month_emptyvalue)
        # self.day_emptyvalue = kwargs.pop('day_emptyvalue', self.default_day_emptyvalue)
        # self.hour_emptyvalue = kwargs.pop('hour_emptyvalue', self.default_hour_emptyvalue)
        # self.minute_emptyvalue = kwargs.pop('minute_emptyvalue', self.default_minute_emptyvalue)

        super(DatePickerWidget, self).__init__(*args, **kwargs)

    def get_datepicker_config(self, fieldid, triggerbuttonid, previewid):
        return {
            'destinationfieldid': fieldid,
            'previewid': previewid,
            'triggerbuttonid': triggerbuttonid,
            'no_value_preview_text': str(self.no_value_preview_text),
            'buttonlabel': str(self.buttonlabel),
            'buttonlabel_novalue': str(self.buttonlabel_novalue),
            'usebuttonlabel': str(self.usebuttonlabel),
            'include_time': False,
            'close_icon': cradmin_icon(self.close_iconkey),
            # 'year_emptyvalue': str(self.year_emptyvalue),
            # 'month_emptyvalue': str(self.month_emptyvalue),
            # 'day_emptyvalue': str(self.day_emptyvalue),
            # 'hour_emptyvalue': str(self.hour_emptyvalue),
            # 'minute_emptyvalue': str(self.minute_emptyvalue),
        }

    def render(self, name, value, attrs=None):
        rendered_field = super(DatePickerWidget, self).render(name, value, attrs)
        fieldid = attrs.get('id', 'id_{}'.format(name))
        triggerbuttonid = '{}_triggerbutton'.format(fieldid)
        previewid = '{}_preview'.format(fieldid)

        return loader.render_to_string(self.template_name, {
            'field': rendered_field,
            'datepicker_config': json.dumps(self.get_datepicker_config(
                fieldid=fieldid,
                triggerbuttonid=triggerbuttonid,
                previewid=previewid)),
            'triggerbuttonid': triggerbuttonid,
            'previewid': previewid,
        })


class BetterDateTimePickerWidget(DatePickerWidget):
    """
    A Widget for selecting a date and time.
    """
    default_buttonlabel = _('Change date/time')
    default_buttonlabel_novalue = _('Select a date/time')

    def get_datepicker_config(self, *args, **kwargs):
        config = super(BetterDateTimePickerWidget, self).get_datepicker_config(*args, **kwargs)
        config.update({
            'include_time': True
        })
        return config


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
        """
        Parameters:
            datewidget_placeholder: The placeholder for the datewidget.
            timewidget_placeholder: The placeholder for the time widget.
        """
        _widgets = [
            DatePickerWidget(attrs=attrs),
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
        """
        Parameters:
            datewidget_placeholder: The placeholder for the datewidget.
            empty_hour_label: Set this to something other than ``None`` if you
                want to allow empty values. Adds this text for the ``None`` value
                as the first option in the select.
            empty_minute_label: Set this to something other than ``None`` if you
                want to allow empty values. Adds this text for the ``None`` value
                as the first option in the select.
        """
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
        return range(0, 24)

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

    By default, the widget is max 270px wide, but you can make it 100% of
    its container via the ``extra_css_class`` parameter documented below.

    If you need to customize the date or time widget,
    override :obj:`~.DateSplitTimePickerWidget.date_widget_class`
    or :obj:`~.DateSplitTimePickerWidget.time_widget_class`.
    """

    #: The widget class to use for the date picker.
    date_widget_class = DatePickerWidget

    #: The widget class to use for the time picker.
    time_widget_class = SplitTimePickerWidget

    def __init__(self, attrs=None,
                 datewidget_placeholder=_('yyyy-mm-dd'),
                 empty_hour_label=None,
                 empty_minute_label=None,
                 extra_css_class=None):
        """
        Parameters:
            datewidget_placeholder: The placeholder for the datewidget.
            empty_hour_label: See :class:`.SplitTimePickerWidget`.
            empty_minute_label: See :class:`.SplitTimePickerWidget`.
            extra_css_class: Add extra css class for the widget.
                Set this to ``"django-cradmin-datetimepicker-split-time-fluid"``
                if you want the widget to use 100% width of its container.
        """
        self.extra_css_class = extra_css_class
        _widgets = [
            self.date_widget_class(attrs=attrs),
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
