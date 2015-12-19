import json
from xml.sax.saxutils import quoteattr

from django.utils.translation import pgettext_lazy

from django_cradmin.viewhelpers import listbuilder
from django_cradmin.viewhelpers.multiselect2.targetrenderables import Target


class ItemValue(listbuilder.itemvalue.FocusBox):
    """
    Listbuilder itemvalue renderable that renders some information
    and a "Select" buttonn that works out of the box with
    :class:`django_cradmin.viewhelpers.multiselect2.targetrenderables.Target`
    to enable multiselect.

    If you have multiple lists with multiselect2 on the same page,
    you have to ensure the DOM IDs are unique by overriding:

    - :meth:`get_selectbutton_dom_id` (or use the ``selectbutton_id_prefix`` parameter).
    - :meth:`get_target_dom_id` (or use the ``target_dom_id`` parameter). Make sure you
      set :meth:`django_cradmin.viewhelpers.multiselect2.targetrenderables.Target.get_target_dom_id`
      on your corresponding Target renderer to reflect the new ID.
    - :meth:`.get_inputfield_name` (or use the ``inputfield_name`` parameter).

    See :doc:`viewhelpers_listbuilder` for more information about listbuilder.
    """
    template_name = 'django_cradmin/viewhelpers/multiselect2/listbuilder_itemvalues/itemvalue.django.html'

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
        self.deselectbutton_text = kwargs.pop('deselectbutton_text', None)
        self.deselectbutton_aria_label = kwargs.pop('deselectbutton_aria_label', None)
        super(ItemValue, self).__init__(*args, **kwargs)

    def get_target_dom_id(self):
        """
        Returns:
            str: The ``dom_id`` of the :class:`django_cradmin.viewhelpers.multiselect2.targetrenderables.Target`.

            Defaults to the ``target_dom_id`` parameter falling back on
            :obj:`django_cradmin.viewhelpers.multiselect2.targetrenderables.Target.default_target_dom_id`.
        """
        if self.target_dom_id:
            return self.target_dom_id
        else:
            return Target.default_target_dom_id

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

    def get_deselectbutton_text(self):
        """
        Returns:
            str: The text for the deselect button.

            Defaults to the ``deselectbutton_text`` parameter for ``__init__``,
            falling back on ``"Deselect"`` (translatable).
        """
        if self.deselectbutton_text:
            return self.deselectbutton_text
        else:
            return pgettext_lazy('multiselect2 deselect button', 'Deselect')

    def get_deselectbutton_aria_label(self):
        """
        Returns:
            str: The text for the aria-label of the deselect button.

            Defaults to ``"Deselect <self.get_title()>"`` (translatable).
        """
        return pgettext_lazy('multiselect2 deselect button', 'Deselect "%(title)s"') % {
            'title': self.get_title()
        }

    def get_inputfield_name(self):
        """
        Returns:
            str: The name of the input field.

            Defaults to the ``inputfield_name`` parameter for ``__init__``, falling
            back on ``selected_items``.
        """
        if self.inputfield_name:
            return self.inputfield_name
        else:
            return 'selected_items'

    def get_inputfield_value(self):
        """
        Returns:
            str: The value to put in the ``value`` attribute of the input field.
        """
        return str(self.value.id)

    def get_preview_title(self):
        return self.get_title()

    def get_preview_description(self):
        return None

    def get_select_directive_dict(self, request):
        return {
            "preview_container_css_selector": ".django-cradmin-multiselect2-itemvalue",
            "preview_css_selector": ".django-cradmin-multiselect2-preview",
            "item_wrapper_css_selector": "li",
            "target_dom_id": self.get_target_dom_id(),
        }

    def get_select_directive_json(self, request):
        return quoteattr(json.dumps(self.get_select_directive_dict(request=request)))

    def get_context_data(self, request=None):
        context = super(ItemValue, self).get_context_data(request=request)
        context['select_directive_json'] = self.get_select_directive_json(request=request)
        return context
