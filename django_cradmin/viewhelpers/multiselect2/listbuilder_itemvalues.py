import json
from xml.sax.saxutils import quoteattr

from django.utils.translation import pgettext_lazy

from django_cradmin.viewhelpers import listbuilder
from django_cradmin.viewhelpers.multiselect2.targetrenderables import Target


class ItemValue(listbuilder.itemvalue.FocusBox):
    template_name = 'django_cradmin/viewhelpers/multiselect2/listbuilder_itemvalues/itemvalue.django.html'

    def __init__(self, *args, **kwargs):
        self.target_dom_id = kwargs.pop('target_dom_id', None)
        self.inputfield_name = kwargs.pop('inputfield_name', None)
        self.selectbutton_id_prefix = kwargs.pop('selectbutton_id_prefix',
                                                 'django_cradmin_multiselect2_selectbutton')
        self.selectbutton_text = kwargs.pop('selectbutton_text', None)
        self.selectbutton_aria_label = kwargs.pop('selectbutton_aria_label', None)
        self.deselectbutton_text = kwargs.pop('selectbutton_text', None)
        self.deselectbutton_aria_label = kwargs.pop('selectbutton_aria_label', None)
        super(ItemValue, self).__init__(*args, **kwargs)

    def get_selectbutton_dom_id(self):
        return '{}_{}'.format(self.selectbutton_id_prefix, self.value.id)

    def get_target_dom_id(self):
        if self.target_dom_id:
            return self.target_dom_id
        else:
            return Target.default_target_dom_id

    def get_base_css_classes_list(self):
        """
        Adds the ``django-cradmin-listbuilder-itemvalue-titleeditdelete`` css class
        in addition to the classes added by the superclasses.
        """
        css_classes = super(ItemValue, self).get_base_css_classes_list()
        css_classes.append('django-cradmin-multiselect2-itemvalue')
        return css_classes

    def get_title(self):
        """
        Get the title of the box.

        Defaults to ``str(self.value)``.
        """
        return str(self.value)

    def get_description(self):
        """
        Get the description (shown below the title).

        Defaults to ``None``, which means that no description
        is rendered.
        """
        return None

    def get_selectbutton_text(self):
        if self.selectbutton_text:
            return self.selectbutton_text
        else:
            return pgettext_lazy('multiselect2 select button', 'Select')

    def get_selectbutton_aria_label(self):
        if self.selectbutton_aria_label:
            return self.selectbutton_aria_label
        else:
            return pgettext_lazy('multiselect2 select button', 'Select "%(title)s"') % {
                'title': self.get_title()
            }

    def get_deselectbutton_text(self):
        if self.deselectbutton_text:
            return self.deselectbutton_text
        else:
            return pgettext_lazy('multiselect2 deselect button', 'Deselect')

    def get_deselectbutton_aria_label(self):
        if self.deselectbutton_aria_label:
            return self.deselectbutton_aria_label
        else:
            return pgettext_lazy('multiselect2 deselect button', 'Deselect "%(title)s"') % {
                'title': self.get_title()
            }

    def get_preview_title(self):
        return self.get_title()

    def get_preview_description(self):
        return None

    def get_inputfield_name(self):
        if self.inputfield_name:
            return self.inputfield_name
        else:
            return 'selected_item'

    def get_inputfield_value(self):
        return self.value.id

    def get_select_directive_dict(self, request):
        return {
            "preview_container_css_selector": ".django-cradmin-multiselect2-itemvalue",
            "preview_css_selector": ".django-cradmin-multiselect-preview",
            "item_wrapper_css_selector": "li",
            "target_dom_id": self.get_target_dom_id(),
        }

    def get_select_directive_json(self, request):
        return quoteattr(json.dumps(self.get_select_directive_dict(request=request)))

    def get_context_data(self, request=None):
        context = super(ItemValue, self).get_context_data(request=request)
        context['select_directive_json'] = self.get_select_directive_json(request=request)
        return context
