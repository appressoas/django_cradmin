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

    def __init__(self, dom_id=None, selected_values_iterable=None):
        """
        Args:
            dom_id: See :meth:`.get_dom_id`.
        """
        self.dom_id = dom_id
        self.selected_values_iterable = selected_values_iterable or []

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
        """
        return ugettext_lazy('Selected items')

    def get_submit_button_text(self):
        """
        Returns:
            str: The submit button text.
        """
        return ugettext_lazy('Submit selection')

    def get_without_items_text(self):
        """
        Returns:
            str: The text to show when there are no items selected.

            Defaults to empty string.
        """
        return ''

    def get_form_action(self, request):
        """
        Args:
            request: An HttpRequest object.

        Returns:
            str: ``request.get_full_path()`` by default.
        """
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
    template_name = 'django_cradmin/viewhelpers/multiselect2/target_renderer/manytomanyselect-target.django.html'

    def __init__(self, target_formfield_id, *args, **kwargs):
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
