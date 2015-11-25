from django.db import models
from django.utils.translation import ugettext_lazy
from .base import AbstractDjangoOrmSingleFilter


class Base(AbstractDjangoOrmSingleFilter):
    template_name = 'django_cradmin/viewhelpers/listfilter/django/single/selectinput/base.django.html'

    def get_choices(self):
        raise NotImplementedError()

    def get_select_dom_id(self):
        return '{}-select'.format(self.get_dom_id())

    def iter_choicesdata(self):
        selected_value = self.get_cleaned_value()
        choicesdata = []
        selected_found = False
        for value, label in self.get_choices():
            is_selected = value == selected_value
            if is_selected:
                selected_found = True
            url = self.build_set_values_url(values=[value])
            choicesdata.append({
                # 'value': value,
                'url': url,
                'label': label,
                'is_selected': is_selected
            })
        if not selected_found and len(choicesdata) > 0:
            choicesdata[0]['is_selected'] = True
        return choicesdata

    def get_context_data(self):
        context = super(Base, self).get_context_data()
        context['choicesdata'] = self.iter_choicesdata()
        return context


class Boolean(Base):
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

    def add_to_queryobject(self, queryobject):
        modelfield = self.get_modelfield()
        cleaned_value = self.get_cleaned_value()
        query = (models.Q(**{modelfield: False}) |
                 models.Q(**{modelfield: ''}) |
                 models.Q(**{'{}__isnull'.format(modelfield): True}))
        if cleaned_value == 'true':
            queryobject = queryobject.exclude(query)
        elif cleaned_value == 'false':
            queryobject = queryobject.filter(query)
        return queryobject
