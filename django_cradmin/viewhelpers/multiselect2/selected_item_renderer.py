from builtins import str

from django.utils.translation import pgettext_lazy

from django_cradmin import renderable


class Default(renderable.AbstractRenderableWithCss):
    """
    Renders a selected item. This is rendered by
    :class:`django_cradmin.viewhelpers.multiselect2.listbuilder_itemvalues.ItemValue`,
    and added to a :class:`django_cradmin.viewhelpers.multiselect2.target_renderer.Target`
    when the "select"-button in the ItemValue is clicked.
    """

    #: The template used to render this selected item.
    template_name = 'django_cradmin/viewhelpers/multiselect2/selecteditemrenderables/default.django.html'

    def __init__(self, value):
        """
        Args:
            value: The value to render. Typically a django model object.

        """
        self.value = value

    def get_base_css_classes_list(self):
        return ['django-cradmin-multiselect2-preview']

    def get_title(self):
        """
        Returns:
            str: The title of the selected item.
        """
        return str(self.value)

    def get_description(self):
        """
        Returns:
            str: The description of the selected item.

            This is shown below the title. It defaults to ``None``,
            which means that no description is rendered.
        """
        return None

    def get_deselectbutton_text(self):
        """
        Returns:
            str: The text for the deselect button.

            Defaults to the ``deselectbutton_text`` parameter for ``__init__``,
            falling back on ``"Deselect"`` (translatable).
        """
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
        return 'selected_items'

    def get_inputfield_value(self):
        """
        Returns:
            str or int: The value to put in the ``value`` attribute of the input field.
        """
        return self.value.pk
