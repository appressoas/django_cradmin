import json
from xml.sax.saxutils import quoteattr

from django.utils.translation import ugettext_lazy

from django_cradmin import renderable
from django_cradmin.viewhelpers.listfilter.base import abstractfilterlistchild
from django_cradmin.viewhelpers.multiselect2 import selected_item_renderer


class Target(renderable.AbstractRenderableWithCss,
             abstractfilterlistchild.FilterListChildMixin):
    """
    Renders a multiselect target form.

    If you have multiple lists with multiselect2 on the same page,
    you have to ensure the DOM IDs are unique by overriding :meth:`.get_dom_id`.
    """

    #: The template used to render this renderable.
    template_name = 'django_cradmin/viewhelpers/multiselect2/target_renderer/target.django.html'

    #: The default for :meth:`.~Target.get_dom_id`.
    default_target_dom_id = 'django_cradmin_multiselect2_select_target'

    #: Selected item rendrerer class.
    selected_item_renderer_class = selected_item_renderer.SelectedItem

    def __init__(self, dom_id=None,
                 selected_values_iterable=None,
                 without_items_text=None,
                 with_items_title=None,
                 submit_button_text=None,
                 form_action=None):
        """
        Args:
            dom_id: See :meth:`.get_dom_id`.
            without_items_text: See :meth:`.get_without_items_text`.
            with_items_title: See :meth:`.get_with_items_title`.
            submit_button_text: See :meth:`.get_submit_button_text`.
            form_action: See :meth:`.get_form_action`.
        """
        self.dom_id = dom_id
        self.without_items_text = without_items_text
        self.with_items_title = with_items_title
        self.selected_values_iterable = selected_values_iterable or []
        self.submit_button_text = submit_button_text
        self.form_action = form_action

    def get_dom_id(self):
        """
        Returns:
            str: The DOM id of the form wrapping everything rendered by this renderable.

            Defaults to the ``dom_id`` parameter for ``__init__`` falling back on
            :obj:`.default_target_dom_id`.
        """
        if self.dom_id:
            return self.dom_id
        else:
            return self.default_target_dom_id

    def get_with_items_title(self):
        """
        Returns:
            str: The title of the box when there are items selected.

            Defaults to the ``with_items_title`` parameter for ``__init__``,
            falling back on ``"Selected items"`` (translatable).
        """
        if self.with_items_title:
            return self.with_items_title
        else:
            return ugettext_lazy('Selected items')

    def get_submit_button_text(self):
        """
        Returns:
            str: The submit button text.

            Defaults to the ``submit_button_text`` parameter for ``__init__``,
            falling back on ``"Submit selection"`` (translatable).
        """
        if self.submit_button_text:
            return self.submit_button_text
        else:
            return ugettext_lazy('Submit selection')

    def get_without_items_text(self):
        """
        Returns:
            str: The text to show when there are no items selected.

            Defaults to the ``without_items_text`` parameter for ``__init__``,
            falling back on empty string.
        """
        if self.without_items_text:
            return self.without_items_text
        else:
            return ''

    def get_form_action(self, request):
        """
        Args:
            request: An HttpRequest object.

        Returns:
            str: The ``<form>`` action attribute value.

            Defaults to the ``form_action`` parameter for ``__init__``,
            falling back on ``request.get_full_path()``.
        """
        if self.form_action:
            return self.form_action
        else:
            return request.get_full_path()

    def get_selected_item_renderer_class(self):
        """
        Returns:
            SelectedItem class: The renderable class to use
            to render the values in the ``selected_values_iterable`` parameter
            for ``__init__``.

            Must be :class:`django_cradmin.viewhelpers.multiselect2.selected_item_renderer.SelectedItem`
            or a subclass.

            Defaults to :obj:`.selected_item_renderer_class`.
        """
        return self.selected_item_renderer_class

    def make_selected_item_renderer(self, **kwargs):
        """
        Args:
            kwargs: The kwargs to send to the constructor of :meth:`.get_selected_item_renderer_class`.

        Returns:
            django_cradmin.viewhelpers.multiselect2.selected_item_renderer.SelectedItem: An instance
            of :meth:`.get_selected_item_renderer_class`.
        """
        return self.get_selected_item_renderer_class()(**kwargs)

    def get_selected_item_renderer_iterable(self):
        """
        Returns:
            iterable: An iterable that yields :meth:`.make_selected_item_renderer` for
            all the objects in the ``selected_item_renderer`` parameter for ``__init__``.
        """
        for value in self.selected_values_iterable:
            yield self.make_selected_item_renderer(value=value)

    def get_context_data(self, request=None):
        context = super(Target, self).get_context_data(request=request)
        context['form_action'] = self.get_form_action(request=request)
        return context


class ManyToManySelectTarget(Target):
    """
    Renders a multiselect target form for
    :class:`django_cradmin.viewhelpers.multiselect2.manytomanywidget.Widget`.
    """
    template_name = 'django_cradmin/viewhelpers/multiselect2/target_renderer/manytomanyselect-target.django.html'

    def __init__(self, target_formfield_id, *args, **kwargs):
        """
        Args:
            target_formfield_id: The DOM ID of the target form field.
        """
        self.target_formfield_id = target_formfield_id
        super(ManyToManySelectTarget, self).__init__(*args, **kwargs)

    def get_usethis_directive_dict(self, request):
        return {
            'fieldid': self.target_formfield_id
        }

    def get_usethis_directive_json(self, request):
        return quoteattr(json.dumps(self.get_usethis_directive_dict(request=request)))

    def get_context_data(self, request=None):
        context = super(ManyToManySelectTarget, self).get_context_data(request=request)
        context['usethis_directive_json'] = self.get_usethis_directive_json(request=request)
        return context
