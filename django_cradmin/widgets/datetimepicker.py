from __future__ import unicode_literals
import datetime
from django.forms import widgets
from django.template import loader
from django.utils.translation import ugettext_lazy as _
import json
from builtins import str
from xml.sax import saxutils
from django_cradmin.templatetags.cradmin_icon_tags import cradmin_icon

from django_cradmin.widgets.selectwidgets import WrappedSelect


class DatePickerWidget(widgets.TextInput):
    """
    A Widget for selecting a date.
    """
    template_name = 'django_cradmin/widgets/datepicker.django.html'

    #: The momentjs formatting string to use to format the value
    #: of the hidden field where the actually posted value is
    #: set.
    #:
    #: You normally do not need to override this, since ISO format
    #: should work for all use cases, and the user will never see
    #: this value (it is stored in a hidden field).
    #:
    #: See the docs for the ``format()`` function in the
    #: `momentjs docs <http://momentjs.com/>`_ for the possible
    #: formatting strings.
    destinationfield_momentjs_format = 'YYYY-MM-DD'

    #: The label of the button used to trigger the date selector
    #: when the field has a value.
    #:
    #: Can be overridden via the ``default_buttonlabel``
    #: keyword argument for ``__init__``.
    default_buttonlabel = _('Change date')

    #: The label of the button used to trigger the date selector
    #: when the field has no value.
    #:
    #: Can be overridden via the ``buttonlabel_novalue``
    #: keyword argument for ``__init__``.
    default_buttonlabel_novalue = _('Select a date')

    #: The label for the _Use_ buttons (both in the mobile view and on the
    #: time picker page on desktop/table).
    #:
    #: Can be overridden via the ``usebuttonlabel``
    #: keyword argument for ``__init__``.
    default_usebuttonlabel = _('Use')

    #: The iconkey for :func:`.django_cradmin.templatetags.cradmin_icon_tags`
    #: to use for the close button (the X in the top right corner).
    #:
    #: Can be overridden via the ``back_close_iconkey``
    #: keyword argument for ``__init__``.
    default_close_iconkey = 'x'

    #: The iconkey for :func:`.django_cradmin.templatetags.cradmin_icon_tags`
    #: to use for the back arrow button for navigating from the time select
    #: page back to the date picker page.
    #:
    #: Can be overridden via the ``back_iconkey``
    #: keyword argument for ``__init__``.
    default_back_iconkey = 'close-overlay-right-to-left'

    #: The momentjs formatting string to use to format the preview of the
    #: selected date on the second page of the
    #:
    #: See the docs for the ``format()`` function in the
    #: `momentjs docs <http://momentjs.com/>`_ for the possible
    #: formatting strings.
    #:
    #: Can be overridden via the ``timeselector_datepreview_momentjs_format``
    #: keyword argument for ``__init__``.
    default_timeselector_datepreview_momentjs_format = 'LL'

    #: The text shown in the date picker table to indicate the selected date.
    #: You can set this to an empty string if you do not want to show this
    #: label.
    default_selected_day_label_text = _('selected')

    #: The text shown in the date picker table cell for "Today".
    #: You can set this to an empty string if you do not want to show this
    #: label.
    default_today_label_text = _('today')

    #: See :meth:`~.DatePickerWidget.get_preview_angularjs_template`.
    default_preview_angularjs_template = "{{ momentObject.format('LL') }}"

    #: The
    close_screenreader_text = _('Close date picker without changing the value')
    year_screenreader_text = _('Select year')
    month_screenreader_text = _('Select month')
    day_screenreader_text = _('Select day')
    hour_screenreader_text = _('Select hour')
    minute_screenreader_text = _('Select minute')
    usebutton_arialabel_prefix = _('Confirm that you want to select')
    back_to_datepicker_screenreader_text = _('Return to date picker')
    dateselector_table_screenreader_caption = _('Select date. Navigate with the arrow keys or tab, '
                                                'jump up to the month selector with the page up key '
                                                'and back to this table with the page down key.')
    usebutton_arialabel_momentjs_format = 'LL'

    # default_year_emptyvalue = _('Year')
    # default_month_emptyvalue = _('Month')
    # default_day_emptyvalue = _('Day')
    # default_hour_emptyvalue = _('Hour')
    # default_minute_emptyvalue = _('Minute')

    def __init__(self, *args, **kwargs):
        """
        Parameters:
            buttonlabel: See :obj:`.DatePickerWidget.default_buttonlabel`.
            buttonlabel_novalue: See :obj:`.DatePickerWidget.default_buttonlabel_novalue`.
            usebuttonlabel: See :obj:`.DatePickerWidget.default_usebuttonlabel`.
            close_iconkey: See :obj:`.DatePickerWidget.default_close_iconkey`.
            back_iconkey: See :obj:`.DatePickerWidget.default_back_iconkey`.
            today_label_text: See :obj:`.DatePickerWidget.default_today_label_text`.
            selected_day_label_text: See :obj:`.DatePickerWidget.default_selected_day_label_text`.
            timeselector_datepreview_momentjs_format: See
                :obj:`.DatePickerWidget.default_timeselector_datepreview_momentjs_format`.
            no_value_preview_text: See :obj:`.DatePickerWidget.default_no_value_preview_text`.
            preview_angularjs_template: See :obj:`.DatePickerWidget.default_preview_angularjs_template`.
        """
        self.buttonlabel = kwargs.pop('buttonlabel', self.default_buttonlabel)
        self.buttonlabel_novalue = kwargs.pop('buttonlabel_novalue', self.default_buttonlabel_novalue)
        self.today_label_text = kwargs.pop('today_label_text', self.default_today_label_text)
        self.selected_day_label_text = kwargs.pop('selected_day_label_text', self.default_selected_day_label_text)
        self.usebuttonlabel = kwargs.pop('usebuttonlabel', self.default_usebuttonlabel)
        self.close_iconkey = kwargs.pop('close_iconkey', self.default_close_iconkey)
        self.back_iconkey = kwargs.pop('back_iconkey', self.default_back_iconkey)
        self.timeselector_datepreview_momentjs_format = kwargs.pop(
            'timeselector_datepreview_momentjs_format',
            self.default_timeselector_datepreview_momentjs_format)
        self.no_value_preview_text = kwargs.pop('no_value_preview_text', '')
        self.preview_angularjs_template = kwargs.pop('preview_angularjs_template',
                                                     self.default_preview_angularjs_template)
        # self.year_emptyvalue = kwargs.pop('year_emptyvalue', self.default_year_emptyvalue)
        # self.month_emptyvalue = kwargs.pop('month_emptyvalue', self.default_month_emptyvalue)
        # self.day_emptyvalue = kwargs.pop('day_emptyvalue', self.default_day_emptyvalue)
        # self.hour_emptyvalue = kwargs.pop('hour_emptyvalue', self.default_hour_emptyvalue)
        # self.minute_emptyvalue = kwargs.pop('minute_emptyvalue', self.default_minute_emptyvalue)

        super(DatePickerWidget, self).__init__(*args, **kwargs)

    def get_datepicker_config(self, fieldid, triggerbuttonid, previewid,
                              previewtemplateid):
        """
        Get the configuration for the ``django-cradmin-datetime-selector`` AngularJS directive.

        This is encoded as json, so all values must be JSON-encodable.
        This means that you need to ensure any lazy translation string is
        wrapped with ``str`` (or ``unicode`` for python2).

        You should normally not need to override this, since everything is
        configurable via ``__init__`` kwargs or class attributes.
        """
        return {
            'destinationfieldid': fieldid,
            'previewid': previewid,
            'previewtemplateid': previewtemplateid,
            'triggerbuttonid': triggerbuttonid,
            'no_value_preview_text': str(self.no_value_preview_text),
            'buttonlabel': str(self.buttonlabel),
            'buttonlabel_novalue': str(self.buttonlabel_novalue),
            'usebuttonlabel': str(self.usebuttonlabel),
            'include_time': False,
            'close_icon': cradmin_icon(self.close_iconkey),
            'back_icon': cradmin_icon(self.back_iconkey),
            'destinationfield_momentjs_format': self.destinationfield_momentjs_format,
            'timeselector_datepreview_momentjs_format': self.timeselector_datepreview_momentjs_format,
            'close_screenreader_text': str(self.close_screenreader_text),
            'year_screenreader_text': str(self.year_screenreader_text),
            'month_screenreader_text': str(self.month_screenreader_text),
            'day_screenreader_text': str(self.day_screenreader_text),
            'hour_screenreader_text': str(self.hour_screenreader_text),
            'minute_screenreader_text': str(self.minute_screenreader_text),
            'usebutton_arialabel_prefix': str(self.usebutton_arialabel_prefix),
            'usebutton_arialabel_momentjs_format': str(self.usebutton_arialabel_momentjs_format),
            'back_to_datepicker_screenreader_text': str(self.back_to_datepicker_screenreader_text),
            'dateselector_table_screenreader_caption': str(self.dateselector_table_screenreader_caption),
            'today_label_text': str(self.today_label_text),
            'selected_day_label_text': str(self.selected_day_label_text),
            # 'year_emptyvalue': str(self.year_emptyvalue),
            # 'month_emptyvalue': str(self.month_emptyvalue),
            # 'day_emptyvalue': str(self.day_emptyvalue),
            # 'hour_emptyvalue': str(self.hour_emptyvalue),
            # 'minute_emptyvalue': str(self.minute_emptyvalue),
        }

    def get_preview_angularjs_template(self):
        """
        Get the AngularJS template to use to render the preview
        of the selected date.

        Defaults to the ``preview_angularjs_template`` kwarg to ``__init__``,
        which defaults to :obj:`~.DatePickerWidget.default_preview_angularjs_template`.

        Must return a string, The string is evaluated by
        the AngularJS ``$compile`` function with the following scope:

        - ``momentObject``: A momentjs object with the value of the
           selected date/time. You use ``momentObject.format()`` to
           format the date. See the examples below and
           `moment.js docs <http://momentjs.com/docs/#/displaying/>`_.

        Examples:

            The default:

            .. code-block:: html

                {{ momentObject.format('LL') }}

            A more complex example:

            .. code-block:: html

                <span class="start-dayname">{{ momentObject.format('dddd') }}</span>
                <span class="start-monthname">{{ momentObject.format('MMMM') }}</span>
                <span class="start-dayinmonth">{{ momentObject.format('Mo') }}</span>
                <span class="start-year">{{ momentObject.format('YYYY') }}</span>

            Inserting translation strings (remember to use ``u"..."`` if using Python2)::

                return "{label}: {{ momentObject.format('LL') }}".format(
                    label=_('Selected date'))
        """
        return self.preview_angularjs_template

    def __get_preview_angularjs_template(self):
        """
        We use this internally instead of using :meth:`.get_preview_angularjs_template`
        to ensure the returned HTML has a root element (which is required by the
        angularjs ``$compile``-function).
        """
        return '<span>{}</span>'.format(self.get_preview_angularjs_template())

    def render(self, name, value, attrs=None):
        rendered_field = super(DatePickerWidget, self).render(name, value, attrs)
        fieldid = attrs.get('id', 'id_{}'.format(name))
        triggerbuttonid = '{}_triggerbutton'.format(fieldid)
        previewid = '{}_preview'.format(fieldid)
        previewtemplateid = '{}_previewtemplate'.format(fieldid)

        return loader.render_to_string(self.template_name, {
            'field': rendered_field,
            'datepicker_config': json.dumps(self.get_datepicker_config(
                fieldid=fieldid,
                triggerbuttonid=triggerbuttonid,
                previewid=previewid,
                previewtemplateid=previewtemplateid,
            )),
            'triggerbuttonid': triggerbuttonid,
            'previewid': previewid,
            'previewtemplateid': previewtemplateid,
            'preview_angularjs_template': self.__get_preview_angularjs_template(),
        })


class BetterDateTimePickerWidget(DatePickerWidget):
    """
    A Widget for selecting a date and time.
    """
    default_buttonlabel = _('Change date/time')
    default_buttonlabel_novalue = _('Select a date/time')
    default_preview_angularjs_template = "{{ momentObject.format('LLLL') }}"
    destinationfield_momentjs_format = 'YYYY-MM-DD HH:mm'
    usebutton_arialabel_momentjs_format = 'LLLL'

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
