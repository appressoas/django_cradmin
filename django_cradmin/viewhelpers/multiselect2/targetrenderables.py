from django.utils.translation import ugettext_lazy

from django_cradmin import renderable
from django_cradmin.viewhelpers.listfilter.base import abstractfilterlistchild


class Target(renderable.AbstractRenderableWithCss,
             abstractfilterlistchild.FilterListChildMixin):
    """
    Renders a multiselect target form.

    If you have multiple lists with multiselect2 on the same page,
    you have to ensure the DOM IDs are unique by overriding :meth:`.get_dom_id`.
    """

    #: The template used to render this renderable.
    template_name = 'django_cradmin/viewhelpers/multiselect2/targetrenderables/target.django.html'

    #: The default for :meth:`.~Target.get_dom_id`.
    default_target_dom_id = 'django_cradmin_multiselect2_select_target'

    def __init__(self, dom_id=None,
                 with_items_title=None,
                 submitbutton_text=None,
                 without_items_text=None):
        """
        Args:
            dom_id: See :meth:`.get_dom_id`.
            with_items_title: See :meth:`.get_with_items_title`.
            submitbutton_text: See :meth:`.get_submit_button_text`.
            without_items_text: See :meth:`.get_without_items_text`.
        """
        self.dom_id = dom_id
        self.with_items_title = with_items_title
        self.submitbutton_text = submitbutton_text
        self.without_items_text = without_items_text

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

            Defaults to the ``with_items_title`` parameter for ``__init__`` falling back on
            ``"Selected items"`` (translatable).
        """
        if self.with_items_title:
            return self.with_items_title
        else:
            return ugettext_lazy('Selected items')

    def get_submit_button_text(self):
        """
        Returns:
            str: The submit button text.

            Defaults to the ``submitbutton_text`` parameter for ``__init__`` falling back on
            ``"Submit selection"`` (translatable).
        """
        if self.submitbutton_text:
            return self.submitbutton_text
        else:
            return ugettext_lazy('Submit selection')

    def get_without_items_text(self):
        """
        Returns:
            str: The text to show when there are no items selected.

            Defaults to the ``without_items_text`` parameter for ``__init__`` falling back on
            on an empty string.
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
            str: ``request.get_full_path()`` by default.
        """
        return request.get_full_path()

    def get_context_data(self, request=None):
        context = super(Target, self).get_context_data(request=request)
        context['form_action'] = self.get_form_action(request=request)
        return context


class ManyToManySelectTarget(Target):
    template_name = 'django_cradmin/viewhelpers/multiselect2/targetrenderables/manytomanyselect-target.django.html'
