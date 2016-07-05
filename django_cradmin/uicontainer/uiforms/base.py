from ..base import ContainerRenderable


class FieldRenderable(ContainerRenderable):
    template_name = 'uicontainer/uiforms/base/field_renderable.django.html'
    valuealias = 'field'

    def __init__(self, fieldname, formrenderable=None, childcontainers=None):
        self.formrenderable = None
        self.fieldname = fieldname
        self.set_formrenderable(formrenderable=formrenderable)
        super(FieldRenderable, self).__init__(
            value=None,
            childcontainers=childcontainers)

    def set_formrenderable(self, formrenderable):
        self.formrenderable = formrenderable
        if self.formrenderable and self.formrenderable.form:
            self.set_value(self.formrenderable.form.fields[self.fieldname])

    def get_base_css_classes_list(self):
        css_classes = super(ContainerRenderable, self).get_base_css_classes_list()
        css_classes.append('field')
        return css_classes


class FormRenderable(ContainerRenderable):
    valuealias = 'form'
    template_name = 'uicontainer/uiforms/base/form_renderable.django.html'

    def __init__(self, form, childcontainers=None):
        self.form = form
        super(FormRenderable, self).__init__(value=form, childcontainers=childcontainers)

    def add_childcontainer(self, childcontainer):
        """
        Overrides :meth:`.django_cradmin.uicontainer.base.ContainerRenderable.add_childcontainer`
        and to automatically call :meth:`.FieldRenderable.set_formrenderable` if the
        ``childcontainer`` inherits from :class:`.FieldRenderable`.
        """
        if isinstance(childcontainer, FieldRenderable):
            childcontainer.set_formrenderable(self)
        super(FormRenderable, self).add_childcontainer(childcontainer=childcontainer)

    def add_fieldrenderer(self, fieldrenderer):
        """
        Alias for :meth:`.add_childcontainer`. Useful to distinguish between
        children that are actual fields, and children that are just renderables (when reading code
        that creates form renderables).

        Args:
            fieldrenderer: A :class:`.FieldRenderable` object.

        Raises:
            ValueError: If ``fieldrenderer`` is not a :class:`.FieldRenderable` object.
        """
        if not isinstance(fieldrenderer, FieldRenderable):
            raise ValueError(
                'fieldrenderer must be a '
                'django_cradmin.uicontainer.uiforms.base.FieldRenderable object.')
        self.add_childcontainer(childcontainer=fieldrenderer)

    def get_base_css_classes_list(self):
        css_classes = super(ContainerRenderable, self).get_base_css_classes_list()
        css_classes.append('form')
        return css_classes
