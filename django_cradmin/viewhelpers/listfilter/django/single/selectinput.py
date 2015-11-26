from django.db import models
from django.utils.translation import ugettext_lazy
from .base import AbstractDjangoOrmSingleFilter


class AbstractSelectFilter(AbstractDjangoOrmSingleFilter):
    """
    Abstract base class for any select filter.

    You only have to override :meth:`~AbstractSelectFilter.get_choices`.
    """
    template_name = 'django_cradmin/viewhelpers/listfilter/django/single/selectinput/base.django.html'

    def get_choices(self):
        """
        Get choices as an iterable of ``(value, label)``.
        """
        raise NotImplementedError()

    def get_select_dom_id(self):
        return '{}-select'.format(self.get_dom_id())

    def set_default_is_selected(self, choicesdata):
        """
        Called by :meth:`.get_choicesdata` when no choice matches
        the current cleaned value.

        See the docs for ``is_selected`` in :meth:`.get_choicesdata`
        for more details.

        Parameters:
            choicesdata (list): Same format as the list returned by :meth:`.get_choicesdata`.
        """
        choicesdata[0]['is_selected'] = True

    def get_choicesdata(self):
        """
        Get choices data as a list of dicts.

        This uses :meth:`.get_choices`, and turns it into
        a list of dicts where each dict has:

        - ``url``: The URL to load when making a choice.
          This is generated using
          :meth:`~django_cradmin.viewhelpers.listfilter.base.AbstractFilter.build_set_values_url`
          with the value from :meth:`.get_choices` as input.
        - ``label``: The label to show (taken directly from :meth:`.get_choices`.
        - ``is_selected`` (boolean): If the current value matches the value of a choice,
          that choice will be selected. If none of them matches, the first choice is selected.
          You can change this behavior by overriding :meth:`.set_default_is_selected`.

        Returns:
            The list of dicts described above.
        """
        selected_value = self.get_cleaned_value()
        choicesdata = []
        selected_found = False
        for value, label in self.get_choices():
            is_selected = value == selected_value
            if is_selected:
                selected_found = True
            url = self.build_set_values_url(values=[value])
            choicesdata.append({
                'url': url,
                'label': label,
                'is_selected': is_selected
            })
        if not selected_found and len(choicesdata) > 0:
            self.set_default_is_selected(choicesdata=choicesdata)
        return choicesdata

    def get_context_data(self):
        context = super(AbstractSelectFilter, self).get_context_data()
        context['choicesdata'] = self.get_choicesdata()
        return context


class Boolean(AbstractSelectFilter):
    """
    A boolean filter that works on any BooleanField and CharField.
    (False, None and ``""`` is considered ``False``).
    """
    def get_do_not_apply_label(self):
        return ''

    def get_true_label(self):
        return ugettext_lazy('Yes')

    def get_false_label(self):
        return ugettext_lazy('No')

    def get_choices(self):
        return [
            ('', self.get_do_not_apply_label()),
            ('true', self.get_true_label()),
            ('false', self.get_false_label()),
        ]

    def get_query(self, modelfield):
        return (models.Q(**{modelfield: False}) |
                models.Q(**{modelfield: ''}) |
                models.Q(**{'{}__isnull'.format(modelfield): True}))

    def filter(self, queryobject):
        modelfield = self.get_modelfield()
        cleaned_value = self.get_cleaned_value()
        query = self.get_query(modelfield)
        if cleaned_value == 'true':
            queryobject = queryobject.exclude(query)
        elif cleaned_value == 'false':
            queryobject = queryobject.filter(query)
        return queryobject


class IsNotNull(Boolean):
    """
    A subclass of :class:`.Boolean` that works with
    foreign keys and other fields where ``None`` means no
    value and anything else means that it has a value.
    """
    def get_query(self, modelfield):
        return models.Q(**{'{}__isnull'.format(modelfield): True})
