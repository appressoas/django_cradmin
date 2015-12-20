from __future__ import unicode_literals

import json
from builtins import str
from xml.sax.saxutils import quoteattr

from django.utils.translation import pgettext_lazy

from django_cradmin.viewhelpers import listbuilder
from django_cradmin.viewhelpers.multiselect2 import selected_item_renderer
from django_cradmin.viewhelpers.multiselect2 import target_renderer
from django_cradmin.viewhelpers.multiselect2 import widget_preview_renderer


class ItemValue(listbuilder.itemvalue.FocusBox):
    """
    Listbuilder itemvalue renderable that renders some information
    and a "Select" buttonn that works out of the box with
    :class:`django_cradmin.viewhelpers.multiselect2.target_renderer.Target`
    to enable multiselect.

    If you have multiple lists with multiselect2 on the same page,
    you have to ensure the DOM IDs are unique by overriding:

    - :meth:`get_selectbutton_dom_id` (or use the ``selectbutton_id_prefix`` parameter).
    - :meth:`get_target_dom_id` (or use the ``target_dom_id`` parameter). Make sure you
      set :meth:`django_cradmin.viewhelpers.multiselect2.target_renderer.Target.get_target_dom_id`
      on your corresponding Target renderer to reflect the new ID.
    - :meth:`django_cradmin.viewhelpers.multiselect2.selected_item_renderer.SelectedItem.get_inputfield_name`
      of the :meth:`~.ItemValue.get_selected_item_renderer_class`.

    See :doc:`viewhelpers_listbuilder` for more information about listbuilder.
    """

    #: The template used to render this renderable.
    template_name = 'django_cradmin/viewhelpers/multiselect2/listbuilder_itemvalues/itemvalue.django.html'

    #: Selected item rendrerer class.
    selected_item_renderer_class = selected_item_renderer.SelectedItem

    def __init__(self, *args, **kwargs):
        """
        Args:
            target_dom_id: See :meth:`.get_target_dom_id`.
            inputfield_name: See :meth:`.get_inputfield_name`.
            selectbutton_id_prefix: See :meth:`.get_selectbutton_dom_id`.
                Defaults to ``django_cradmin_multiselect2_selectbutton``.
            selectbutton_text: See :meth:`.get_selectbutton_text`.
            deselectbutton_text: See :meth:`.get_deselectbutton_text`.
        """
        self.target_dom_id = kwargs.pop('target_dom_id', None)
        self.inputfield_name = kwargs.pop('inputfield_name', None)
        self.selectbutton_id_prefix = kwargs.pop('selectbutton_id_prefix',
                                                 'django_cradmin_multiselect2_selectbutton')
        self.selectbutton_text = kwargs.pop('selectbutton_text', None)
        self.selectbutton_aria_label = kwargs.pop('selectbutton_aria_label', None)
        # self.deselectbutton_text = kwargs.pop('deselectbutton_text', None)
        # self.deselectbutton_aria_label = kwargs.pop('deselectbutton_aria_label', None)
        super(ItemValue, self).__init__(*args, **kwargs)
        self.selected_item_renderer = self.make_selected_item_renderer()

    def get_target_dom_id(self):
        """
        Returns:
            str: The ``dom_id`` of the :class:`django_cradmin.viewhelpers.multiselect2.target_renderer.Target`.

            Defaults to the ``target_dom_id`` parameter falling back on
            :obj:`django_cradmin.viewhelpers.multiselect2.target_renderer.Target.default_target_dom_id`.
        """
        if self.target_dom_id:
            return self.target_dom_id
        else:
            return target_renderer.Target.default_target_dom_id

    def get_selectbutton_dom_id(self):
        """
        Returns:
            str: Get the DOM id of the select button.

            Defaults to ``<selectbutton_id_prefix>_<self.value.id>``, where
            ``selectbutton_id_prefix`` is the ``selectbutton_id_prefix`` parameter.

            If you have multiple lists with multiselect2 on the same page, you must
            make sure this is unique.
        """
        return '{}_{}'.format(self.selectbutton_id_prefix, self.value.id)

    def get_base_css_classes_list(self):
        """
        Adds the ``django-cradmin-multiselect2-itemvalue`` css class
        in addition to the classes added by the superclasses.
        """
        css_classes = super(ItemValue, self).get_base_css_classes_list()
        css_classes.append('django-cradmin-multiselect2-itemvalue')
        return css_classes

    def get_title(self):
        """
        Returns:
            str: The title of the box.

            Defaults to ``str(self.value)``.
        """
        return str(self.value)

    def get_description(self):
        """
        Returns:
            str: The description (shown below the title).

            Defaults to ``None``, which means that no description
            is rendered.
        """
        return None

    def get_selectbutton_text(self):
        """
        Returns:
            str: The text for the select button.

            Defaults to the ``selectbutton_text`` parameter for ``__init__``,
            falling back on ``"Select"`` (translatable).
        """
        if self.selectbutton_text:
            return self.selectbutton_text
        else:
            return pgettext_lazy('multiselect2 select button', 'Select')

    def get_selectbutton_aria_label(self):
        """
        Returns:
            str: The text for the aria-label of the select button.

            Defaults to ``"Select <self.get_title()>"`` (translatable).
        """
        return pgettext_lazy('multiselect2 select button', 'Select "%(title)s"') % {
            'title': self.get_title()
        }

    def get_custom_data(self):
        return None

    def get_select_directive_dict(self, request):
        return {
            'preview_container_css_selector': '.django-cradmin-multiselect2-itemvalue',
            'preview_css_selector': '.django-cradmin-multiselect2-selected-item',
            'item_wrapper_css_selector': 'li',
            'target_dom_id': self.get_target_dom_id(),
            'custom_data': self.get_custom_data(),
            'is_selected': self.kwargs.get('is_selected', False),
        }

    def get_select_directive_json(self, request):
        return quoteattr(json.dumps(self.get_select_directive_dict(request=request)))

    def get_selected_item_renderer_class(self):
        """
        Returns:
            SelectedItem class: The renderable class to use
            to render the selected item in the corresponding
            :class:`django_cradmin.viewhelpers.multiselect2.target_renderer.Target`.

            Must be :class:`django_cradmin.viewhelpers.multiselect2.selected_item_renderer.SelectedItem`
            or a subclass.

            Defaults to :obj:`.selected_item_renderer_class`.
        """
        return self.selected_item_renderer_class

    def make_selected_item_renderer(self):
        """
        Returns:
            django_cradmin.viewhelpers.multiselect2.selected_item_renderer.SelectedItem: An instance
            of :meth:`.get_selected_item_renderer_class`.

            This is called in ``__init__`` and the return value is stored in ``self.selected_item_renderer``.
        """
        return self.get_selected_item_renderer_class()(value=self.value)

    def get_context_data(self, request=None):
        context = super(ItemValue, self).get_context_data(request=request)
        context['select_directive_json'] = self.get_select_directive_json(request=request)
        return context


class ManyToManySelect(ItemValue):
    def get_manytomanyfield_preview_renderer_class(self):
        return widget_preview_renderer.Value

    def get_manytomanyfield_preview_html(self):
        renderer_class = self.get_manytomanyfield_preview_renderer_class()
        return renderer_class(value=self.value, wrap_in_li_element=True).render()

    def get_custom_data(self):
        return {
            'value': self.selected_item_renderer.get_inputfield_value(),
            'preview': self.get_manytomanyfield_preview_html()
        }
