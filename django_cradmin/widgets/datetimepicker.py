from __future__ import unicode_literals
import json
from builtins import str
from datetime import timedelta, datetime

from django.forms import widgets
from django.template import loader
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

from django_cradmin.templatetags.cradmin_icon_tags import cradmin_icon
from django_cradmin.widgets.selectwidgets import WrappedSelect


class DatePickerWidget(widgets.TextInput):
    """
    A Widget for selecting a date.

    This implements a Django widget using ``django-cradmin-datetime-selector``
    AngularJS directive, but defaults to values that makes the directive
    only allows the user to pick a date.

    The widget works for both date and datetime fields. Datetime fields
    will just get the time, minutes and seconds set to ``0``.

    Also serves as the base class for :class:`.BetterDateTimePickerWidget`.

    You can configure almost everything by extending the class,
    or (to a lesser extent) via parameters to the contructor. The only
    thing that may seem strange that you can not customize is:

    - Day numbers.
    - Weekday names.
    - Month names.

    Day numbers have to be handled by the AngularJS directive since they are
    dynamic (changes when you change month). Weekday names and month days are
    formatted with MomentJS (`momentjs docs <http://momentjs.com/>`_).

    MomentJS has their own i18n support. You can override the locale/language
    used by momentjs via the ``DJANGO_CRADMIN_MOMENTJS_LOCALE`` Django setting,
    and Django-cradmin contains all the locale files bundled with MomentJS.

    You can easily provide your own translation files as explained in their docs.
    If your template inherits from any of the Django-cradmin templates (which
    all extend from ``django_cradmin/standalone-base-internal.django.html``, you
    add your momentjs locale by overriding the the ``momentjslocale`` templatate block.
    Remember that this can be overridden for your entire project by providing a
    ``django_cradmin/standalone-base.django.html`` that overrides the ``momentjslocale``
    block.
    """

    #: The template used to render the widget.
    template_name = 'django_cradmin/widgets/datetimepicker.django.html'

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
    #:
    #: Can be overridden via the ``selected_day_label_text``
    #: keyword argument for ``__init__``.
    default_selected_day_label_text = _('selected')

    #: The text shown in the date picker table cell for "Today".
    #: You can set this to an empty string if you do not want to show this
    #: label.
    #:
    #: Can be overridden via the ``today_label_text``
    #: keyword argument for ``__init__``.
    default_today_label_text = _('today')

    #: See :meth:`~.DatePickerWidget.get_preview_angularjs_template`.
    #:
    #: Can be overridden via the ``preview_angularjs_template``
    #: keyword argument for ``__init__``.
    default_preview_angularjs_template = "{{ momentObject.format('LL') }}"

    #: The aria-label (screenreader only label) for the close button.
    #:
    #: Can be overridden via the ``close_screenreader_text``
    #: keyword argument for ``__init__``.
    default_close_screenreader_text = _('Close date picker without changing the value')

    #: The screenreader only label for the select year ``<select>``.
    #:
    #: Can be overridden via the ``year_screenreader_text``
    #: keyword argument for ``__init__``.
    default_year_screenreader_text = _('Select year')

    #: The screenreader only label for the select month ``<select>``.
    #:
    #: Can be overridden via the ``month_screenreader_text``
    #: keyword argument for ``__init__``.
    default_month_screenreader_text = _('Select month')

    #: The screenreader only label for the select day ``<select>``.
    #:
    #: Can be overridden via the ``day_screenreader_text``
    #: keyword argument for ``__init__``.
    default_day_screenreader_text = _('Select day')

    #: The screenreader only label for the select hour ``<select>``.
    #:
    #: Can be overridden via the ``hour_screenreader_text``
    #: keyword argument for ``__init__``.
    default_hour_screenreader_text = _('Select hour')

    #: The screenreader only label for the select minute ``<select>``.
    #:
    #: Can be overridden via the ``minute_screenreader_text``
    #: keyword argument for ``__init__``.
    default_minute_screenreader_text = _('Select minute')

    #: The screenreader only prefix for the arial-label of the "Use"-button
    #: The suffix is the formatted value of the selected date, formatted using
    #: :obj:`~.DatePickerWidget.default_usebutton_arialabel_momentjs_format`.
    #:
    #: Can be overridden via the ``usebutton_arialabel_prefix``
    #: keyword argument for ``__init__``.
    default_usebutton_arialabel_prefix = _('Confirm that you want to select')

    #: The momentjs format for the screenreader only suffox for the arial-label
    #: of the "Use"-button. The prefix is configured in
    #: :obj:`~.DatePickerWidget.default_usebutton_arialabel_prefix`.
    #:
    #: Can be overridden via the ``usebutton_arialabel_momentjs_format``
    #: keyword argument for ``__init__``.
    default_usebutton_arialabel_momentjs_format = 'LL'

    #: The screenreader only aria-label for the button that takes the user
    #: back to the datepicker when they are in the time picker (not used on mobile).
    #:
    #: Can be overridden via the ``back_to_datepicker_screenreader_text``
    #: keyword argument for ``__init__``.
    default_back_to_datepicker_screenreader_text = _('Return to date picker')

    #: The screenreader only date-picker table caption.
    #:
    #: Can be overridden via the ``dateselector_table_screenreader_caption``
    #: keyword argument for ``__init__``.
    default_dateselector_table_screenreader_caption = _('Select date. Navigate with the arrow keys or tab, '
                                                        'jump up to the month selector with the page up key '
                                                        'and back to this table with the page down key.')

    default_now_button_text = _('Now')
    default_today_button_text = _('Today')
    default_clear_button_text = _('Clear')

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
            close_screenreader_text: See :obj:`.DatePickerWidget.default_close_screenreader_text`.
            year_screenreader_text: See :obj:`.DatePickerWidget.default_year_screenreader_text`.
            month_screenreader_text: See :obj:`.DatePickerWidget.default_month_screenreader_text`.
            day_screenreader_text: See :obj:`.DatePickerWidget.default_day_screenreader_text`.
            hour_screenreader_text: See :obj:`.DatePickerWidget.default_hour_screenreader_text`.
            minute_screenreader_text: See :obj:`.DatePickerWidget.default_minute_screenreader_text`.
            usebutton_arialabel_prefix: See :obj:`.DatePickerWidget.default_usebutton_arialabel_prefix`.
            usebutton_arialabel_momentjs_format: See
                :obj:`.DatePickerWidget.default_usebutton_arialabel_momentjs_format`.
            back_to_datepicker_screenreader_text: See
                :obj:`.DatePickerWidget.default_back_to_datepicker_screenreader_text`.
            dateselector_table_screenreader_caption: See
                :obj:`.DatePickerWidget.default_dateselector_table_screenreader_caption`.
            minimum_datetime: The minimum datetime allowed to be select in the widget.
            maximum_datetime: The minimum datetime allowed to be select in the widget.
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

        self.close_screenreader_text = kwargs.pop('close_screenreader_text',
                                                  self.default_close_screenreader_text)
        self.year_screenreader_text = kwargs.pop('year_screenreader_text',
                                                 self.default_year_screenreader_text)
        self.month_screenreader_text = kwargs.pop('month_screenreader_text',
                                                  self.default_month_screenreader_text)
        self.day_screenreader_text = kwargs.pop('day_screenreader_text',
                                                self.default_day_screenreader_text)
        self.hour_screenreader_text = kwargs.pop('hour_screenreader_text',
                                                 self.default_hour_screenreader_text)
        self.minute_screenreader_text = kwargs.pop('minute_screenreader_text',
                                                   self.default_minute_screenreader_text)
        self.usebutton_arialabel_prefix = kwargs.pop('usebutton_arialabel_prefix',
                                                     self.default_usebutton_arialabel_prefix)
        self.usebutton_arialabel_momentjs_format = kwargs.pop('usebutton_arialabel_momentjs_format',
                                                              self.default_usebutton_arialabel_momentjs_format)
        self.back_to_datepicker_screenreader_text = kwargs.pop('back_to_datepicker_screenreader_text',
                                                               self.default_back_to_datepicker_screenreader_text)
        self.dateselector_table_screenreader_caption = kwargs.pop('dateselector_table_screenreader_caption',
                                                                  self.default_dateselector_table_screenreader_caption)
        self.minimum_datetime = kwargs.pop('minimum_datetime', None)
        self.maximum_datetime = kwargs.pop('maximum_datetime', None)
        self.now_button_text = kwargs.pop('now_button_text', self.default_now_button_text)
        self.today_button_text = kwargs.pop('today_button_text', self.default_today_button_text)
        self.clear_button_text = kwargs.pop('clear_button_text', self.default_clear_button_text)

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
        configdict = {
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
            'now_button_text': str(self.now_button_text),
            'today_button_text': str(self.today_button_text),
            'clear_button_text': str(self.clear_button_text),
            'selected_day_label_text': str(self.selected_day_label_text),
            'yearselect_config': list(self.get_yearselect_config()),
            'hourselect_config': list(self.get_hourselect_config()),
            'minuteselect_config': list(self.get_minuteselect_config()),
            # 'year_emptyvalue': str(self.year_emptyvalue),
            # 'month_emptyvalue': str(self.month_emptyvalue),
            # 'day_emptyvalue': str(self.day_emptyvalue),
            # 'hour_emptyvalue': str(self.hour_emptyvalue),
            # 'minute_emptyvalue': str(self.minute_emptyvalue),
        }

        if self.minimum_datetime:
            minimum_datetime = self.minimum_datetime.strftime('%Y-%m-%d %H:%M')
        else:
            minimum_datetime = None
        if self.maximum_datetime:
            maximum_datetime = self.maximum_datetime.strftime('%Y-%m-%d %H:%M')
        else:
            maximum_datetime = None
        configdict['minimum_datetime'] = minimum_datetime
        configdict['maximum_datetime'] = maximum_datetime

        return configdict

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

    def get_template_name(self):
        """
        Get the name of the template used to render the widget.

        Defaults to :obj:`.template_name`.
        """
        return self.template_name

    def get_extra_css_classes(self):
        """
        Get extra css classes for the wrapper around the field and widget.

        Use this if you want to customize the look of a specific widget.
        If you want to customize all datetime widgets, a custom django-cradmin
        theme is probably a better solution.

        Returns:
            A string with one or more css classes.
        """
        return ''

    def get_context_data(self, fieldid, rendered_field, fieldname, value):
        """
        Get context data for the template used by :meth:`.render` to render the widget.

        The template can be overridden in :meth:`.get_template_name`.
        """
        triggerbuttonid = '{}_triggerbutton'.format(fieldid)
        previewid = '{}_preview'.format(fieldid)
        previewtemplateid = '{}_previewtemplate'.format(fieldid)
        return {
            'classname_lower': self.__class__.__name__.lower(),
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
            'extra_css_classes': self.get_extra_css_classes(),
        }

    def render(self, name, value, attrs=None):
        """
        Render the widget.

        Uses the template returned by :meth:`.get_template_name` with the
        context data returned by :meth:`.get_context_data`.
        """
        attrs = attrs or {}
        attrs['style'] = 'display: none;'
        rendered_field = super(DatePickerWidget, self).render(name, value, attrs)
        fieldid = attrs.get('id', 'id_{}'.format(name))
        return loader.render_to_string(self.get_template_name(), self.get_context_data(
            fieldid=fieldid,
            rendered_field=rendered_field,
            fieldname=name,
            value=value
        ))

    #
    # Year select config
    #

    def format_yearlabel(self, yearnumber):
        """
        Format the given year (int) like you want it to be shown in
        the year ``<select>``.

        Returns:
            The year formatted as a string. Defaults to ``str(yearnumber)``.
            MUST be a string, so if you use Django ugettext, or something
            other that is not encodable by ``json.dumps()``, make sure you
            convert it to a string/unicode.
        """
        return str(yearnumber)

    def get_selectable_yearnumbers(self):
        """
        Get an iterable of year ints (I.e.: anything that can be converted to a
        list of ints with ``list(value)``).

        The iterable must yield integers.

        Defaults to the range of ~130 years in the past and future.

        Used by :meth:`.get_yearselect_config`.
        """
        year_minimum_value = (timezone.now() - timedelta(days=364*130)).year
        year_maximum_value = (timezone.now() + timedelta(days=364*130)).year
        if self.minimum_datetime:
            year_minimum_value = self.minimum_datetime.year
        if self.maximum_datetime:
            year_maximum_value = self.maximum_datetime.year
        return range(
            year_minimum_value,
            year_maximum_value)

    def get_yearselect_config(self):
        """
        Get an iterable of json encodable dicts with ``value`` and ``label`` keys.

        The dicts must be json encodable, so ensure you do not include any
        lazy Django translation strings (convert them to str/unicode).

        Defaults to all the year numbers returned by :meth:`.get_selectable_yearnumbers`
        as ``value``, with the ``label`` formatted by :meth:`.format_yearlabel`.
        This means that you most likely should override those methods instead of this
        method.
        """
        def format_yearconfig(yearnumber):
            return {
                'value': yearnumber,
                'label': self.format_yearlabel(yearnumber)
            }
        return map(format_yearconfig, self.get_selectable_yearnumbers())

    #
    # Hour select config
    #

    def format_hourlabel(self, hournumber):
        """
        Format the given hour (int) like you want it to be shown in
        the hour ``<select>``.

        Returns:
            The hour formatted as a string. Defaults to the ``hournumber`` as
            prefixed with ``0`` if the number is lower than 10.
            MUST be a string, so if you use Django ``ugettext_lazy``, or something
            other that is not encodable by ``json.dumps()``, make sure you
            convert it to a string/unicode.
        """
        return '{:02}'.format(hournumber)

    def get_selectable_hournumbers(self):
        """
        Get an iterable of hour ints (I.e.: anything that can be converted to a
        list of ints with ``list(value)``).

        The iterable must yield integers.

        Defaults to a ``[0, 1, 2, ..., 23]``.

        Used by :meth:`.get_hourselect_config`.
        """
        return range(0, 24)

    def get_hourselect_config(self):
        """
        Get an iterable of json encodable dicts with ``value`` and ``label`` keys.

        The dicts must be json encodable, so ensure you do not include any
        lazy Django translation strings (convert them to str/unicode).

        Defaults to all the hour numbers returned by :meth:`.get_selectable_hournumbers`
        as ``value``, with the ``label`` formatted by :meth:`.format_hourlabel`.
        This means that you most likely should override those methods instead of this
        method.
        """
        def format_hourconfig(hournumber):
            return {
                'value': hournumber,
                'label': self.format_hourlabel(hournumber)
            }
        return map(format_hourconfig, self.get_selectable_hournumbers())

    #
    # Minute select config
    #

    def format_minutelabel(self, minutenumber):
        """
        Format the given minute (int) like you want it to be shown in
        the minute ``<select>``.

        Returns:
            The minute formatted as a string. Defaults to the ``minutenumber`` as
            prefixed with ``0`` if the number is lower than 10.
            MUST be a string, so if you use Django ugettext, or something
            other that is not encodable by ``json.dumps()``, make sure you
            convert it to a string/unicode.
        """
        return '{:02}'.format(minutenumber)

    def get_selectable_minutenumbers(self):
        """
        Get an iterable of minute ints (I.e.: anything that can be converted to a
        list of numbers with ``list(value)``).

        The iterable must yield integers.

        Defaults to ``[0, 5, 10, 15, ...55, 59]``.

        Used by :meth:`.get_minuteselect_config`.
        """
        minutevalues = list(range(0, 60, 5))
        minutevalues.append(59)
        return minutevalues

    def get_minuteselect_config(self):
        """
        Get an iterable of json encodable dicts with ``value`` and ``label`` keys.

        The dicts must be json encodable, so ensure you do not include any
        lazy Django translation strings (convert them to str/unicode).

        Defaults to all the minute numbers returned by :meth:`.get_selectable_minutenumbers`
        as ``value``, with the ``label`` formatted by :meth:`.format_minutelabel`.
        This means that you most likely should override those methods instead of this
        method.
        """
        def format_minuteconfig(minutenumber):
            return {
                'value': minutenumber,
                'label': self.format_minutelabel(minutenumber)
            }
        return map(format_minuteconfig, self.get_selectable_minutenumbers())


class DateTimePickerWidget(DatePickerWidget):
    """
    A Widget for selecting a date and time.

    Extends :class:`.DatePickerWidget`.
    """
    default_buttonlabel = _('Change date/time')
    default_buttonlabel_novalue = _('Select a date/time')
    default_preview_angularjs_template = "{{ momentObject.format('LLLL') }}"
    destinationfield_momentjs_format = 'YYYY-MM-DD HH:mm'
    usebutton_arialabel_momentjs_format = 'LLLL'

    def get_datepicker_config(self, *args, **kwargs):
        config = super(DateTimePickerWidget, self).get_datepicker_config(*args, **kwargs)
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


# class DateTimePickerWidget(widgets.MultiWidget):
#     """
#     A Widget using :class:`.DatePickerWidget`
#     for selecting a date and :class:`.TimePickerWidget`
#     for selecting time.
#     """
#
#     def __init__(self, attrs=None,
#                  datewidget_placeholder=_('yyyy-mm-dd'),
#                  timewidget_placeholder=_('hh:mm')):
#         """
#         Parameters:
#             datewidget_placeholder: The placeholder for the datewidget.
#             timewidget_placeholder: The placeholder for the time widget.
#         """
#         _widgets = [
#             DatePickerWidget(attrs=attrs),
#             TimePickerWidget(attrs=attrs, placeholder=timewidget_placeholder)
#         ]
#         super(DateTimePickerWidget, self).__init__(_widgets, attrs)
#
#     def decompress(self, value):
#         return [value, value]
#
#     def format_output(self, rendered_widgets):
#         return u'<div class="django-cradmin-datetimepicker">{}</div>'.format(
#             u''.join(rendered_widgets))
#
#     def value_from_datadict(self, data, files, name):
#         timevalue = data.get('{}_1'.format(name), '').strip()
#         datevalue = data.get('{}_0'.format(name), '').strip()
#         values = []
#         if datevalue:
#             values.append(datevalue)
#         if timevalue:
#             values.append(timevalue)
#         datetimevalue = ' '.join(values)
#         if datetimevalue:
#             return datetimevalue
#         else:
#             return None


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
