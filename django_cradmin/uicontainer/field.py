from __future__ import unicode_literals

from django import forms

from . import container
from . import form_mixins
from . import label


class BaseFieldRenderable(container.AbstractContainerRenderable, form_mixins.FieldWrapperRenderableChildMixin):
    """
    Abstract base class for renders of the actual form field
    for a :class:`.FieldWrapper`.

    You never use this on its own outside a :class:`.FieldWrapper`.
    """
    def __init__(self, autofocus=False, placeholder=False, **kwargs):
        """

        Args:
            autofocus (boolean): Autofocus on this field at page load?
            placeholder (str): Placeholder text. See
                :meth:`~django_cradmin.uicontainer.container.AbstractContainerRenderable.get_html_element_attributes`
                for details about how values are applied.
            **kwargs: Kwargs for :class:`django_cradmin.uicontainer.container.AbstractContainerRenderable`.
        """
        self._overridden_autofocus = autofocus
        self._overridden_placeholder = placeholder
        super(BaseFieldRenderable, self).__init__(**kwargs)

    def get_default_autofocus(self):
        """
        Get the default value for the autofocus attribute of the html element.

        Defaults to ``False``.
        """
        return False

    @property
    def autofocus(self):
        """
        Get the value for the autofocus attribute of the html element.

        You should not override this. Override :meth:`.get_default_autofocus` instead.
        """
        return self._overridden_autofocus or self.get_default_autofocus()

    def get_default_placeholder(self):
        """
        Get the default value for the placeholder attribute of the html element.

        Defaults to ``False``.
        """
        return False

    @property
    def placeholder(self):
        """
        Get the value for the placeholder attribute of the html element.

        You should not override this. Override :meth:`.get_default_placeholder` instead.
        """
        return self._overridden_placeholder or self.get_default_placeholder()

    def get_html_element_attributes(self):
        attributes = super(BaseFieldRenderable, self).get_html_element_attributes()
        attributes.update({
            'autofocus': self.autofocus,
            'placeholder': self.placeholder,
        })
        return attributes

    def should_have_for_attribute_on_label(self):
        """
        Should this field get a ``for`` attribute on its label?

        Used by :class:`django_cradmin.uicontainer.label.Label`.

        Defaults to ``True``, but subclasses can override this.
        """
        return True

    def should_render_as_child_of_label(self):
        """
        Should this field be renderered as a child of the ``<label>``?

        Returns ``True`` by default, but subclasses should override this
        for fields that should not be rendered within a label.

        For example, :class:`.Field` overrides this with varying behavior
        depending on the type of the Django field widget.
        """
        return True

    @property
    def bound_formfield(self):
        return self.field_wrapper_renderable.formrenderable.form[self.field_wrapper_renderable.fieldname]

    def get_default_dom_id(self):
        return self.bound_formfield.auto_id

    @property
    def field_attributes_dict(self):
        attributes_dict = {}
        attributes_dict = self.bound_formfield.build_widget_attrs(attributes_dict)
        attributes_dict.update(self.get_html_element_attributes())
        return attributes_dict


class SubWidgetField(BaseFieldRenderable):
    template_name = 'django_cradmin/uicontainer/field/subwidget.django.html'

    def __init__(self, django_subwidget, index_in_parent, **kwargs):
        self.django_subwidget = django_subwidget
        self.index_in_parent = index_in_parent
        super(SubWidgetField, self).__init__(**kwargs)

    @property
    def label_text(self):
        return self.django_subwidget.choice_label

    def can_have_children(self):
        return False

    @property
    def field_attributes_dict(self):
        attributes_dict = {}
        attributes_dict.update(self.django_subwidget.attrs)
        attributes_dict.update(self.get_html_element_attributes())
        if self.dom_id:
            attributes_dict['id'] = '{dom_id}_{index_in_parent}'.format(
                dom_id=self.dom_id,
                index_in_parent=self.index_in_parent)
        return attributes_dict

    @property
    def rendered_subwidget(self):
        return self.django_subwidget.tag(attrs=self.field_attributes_dict)


class Field(BaseFieldRenderable):
    """
    Automatically renders a form field for a :class:`.FieldWrapper`
    using the Django widget system.

    You never use this on its own outside a :class:`.FieldWrapper`.

    Examples:

        First of all, this is always used within a
        :class:`~django_cradmin.uicontainer.fieldwrapper.FieldWrapper`,
        and by default FieldWrapper uses this class without any kwargs
        as the ``field_renderable``. So the following will render a
        field on the form named ``email`` no matter what the type or
        widget of the field is::

            from django_cradmin import uicontainer

            class ExampleForm(forms.Form):
                email = forms.EmailField()

            # You would put the fieldwrapper as a child somewhere below
            # a ``django_cradmin.uicontainer.form.Form``, but we
            # do not include that in these examples for brevity. See the docs for
            # ``django_cradmin.uicontainer.form.Form`` for a complete example.
            uicontainer.fieldwrapper.FieldWrapper(fieldname='email')

        Let us adjust some parameters of the field rendered by the FieldWrapper
        by providing a custom field_renderable::

            uicontainer.fieldwrapper.FieldWrapper(
                fieldname='email',
                field_wrapper_renderable=uicontainer.field.Field(
                    autofocus=True,  # Autofocus on page load
                    placeholder="Type your email...",  # Set a placeholder text

                    # Change the css classes - the css class of the field will
                    # be ``custom-input custom-input--big``
                    bem_block='custom-input',
                    bem_variant_list=['big']

                    # Alternatively, we can set the css class
                ))

        What about some CSS classes on the input field? We can do that using
        BEM naming, by specifying css classes directly as a list,
        or by just adding some css classes. Lets look at the BEM options::

            # Change the BEM block from ``input`` (the default) to ``custom-input``.
            uicontainer.fieldwrapper.FieldWrapper(
                fieldname='email',
                field_wrapper_renderable=uicontainer.field.Field(
                    bem_block='custom-input',
                    bem_variant_list=['big']
                ))

            # .. or just add some variants ..
            uicontainer.fieldwrapper.FieldWrapper(
                fieldname='email',
                field_wrapper_renderable=uicontainer.field.Field(
                    bem_variant_list=['inline', 'small']
                ))

            # .. or both ..
            uicontainer.fieldwrapper.FieldWrapper(
                fieldname='email',
                field_wrapper_renderable=uicontainer.field.Field(
                    bem_block='custom-input',
                    bem_variant_list=['large']
                ))

            # In all cases, the resulting CSS class will be
            # <bem_block> [<bem_block>--<variant0]  [<bem_block>--<variantN>]

        Refer to :ref:`uicontainer_styling` for more details about setting
        CSS classes.

        Field just works automatically with choice fields, but that uses a
        ``<select>`` by default. Let us render a ChoiceField as a
        radio button list instead::

            class ExampleForm(forms.Form):
                user_type = forms.ChoiceField(
                    choices=[
                        ('standard', 'Standard'),
                        ('admin', 'Admin'),
                    ],
                    initial='standard',
                    widget=forms.RadioSelect()
                )

            # Nothing special is needed - we pick up that you override
            # the widget on the form field, and just render it differently.
            uicontainer.fieldwrapper.FieldWrapper(fieldname='user_type')

            # We can override options for the sub-widgets (the radio buttons)
            # Lets change the CSS class of the label around each of the radio buttons
            uicontainer.fieldwrapper.FieldWrapper(
                fieldname='user_type',
                field_renderable=uicontainer.field.Field(
                    subwidget_renderable_kwargs={
                        'bem_variant_list': ['inline']
                    }
                )
            )

        CheckboxSelectMultiple widgets work just like the RadioSelect widget.

        If you need more customization than the ``subwidget_renderable_kwargs`` option
        provides, you can customize exactly how RadioSelect and CheckboxSelectMultiple is rendered
        by extending :class:`.Field` and override:

        - :meth:`~.Field.make_subwidget_renderable_radio`
        - :meth:`~.Field.make_subwidget_renderable_checkbox`

    """
    template_name = 'django_cradmin/uicontainer/field/field.django.html'

    def __init__(self, subwidget_renderable_kwargs=None, **kwargs):
        """

        Args:
            subwidget_renderable_kwargs: Kwargs for the subwidget renderable.
                See :meth:`.make_subwidget_renderable`. You can provide any
                kwargs that works with
                :class:`~django_cradmin.uicontainer.container.AbstractContainerRenderable`.
            **kwargs: Kwargs for :class:`.BaseFieldRenderable`.
        """
        self.extra_subwidget_renderable_kwargs = subwidget_renderable_kwargs or {}
        super(Field, self).__init__(**kwargs)
        self.properties['field_wrapper_renderable'] = self

    @property
    def django_widget(self):
        """
        Get the Django Widget object for the formfield.
        """
        return self.bound_formfield.field.widget

    def is_radio_select_widget(self):
        """
        Returns ``True`` if the field widget is a :class:`django.forms.widgets.RadioSelect`.
        """
        return isinstance(self.django_widget, forms.RadioSelect)

    def is_checkbox_select_multiple_widget(self):
        """
        Returns ``True`` if the field widget is a :class:`django.forms.widgets.CheckboxSelectMultiple`.
        """
        return isinstance(self.django_widget, forms.CheckboxSelectMultiple)

    def is_select_multiple_widget(self):
        """
        Returns ``True`` if the field widget is a :class:`django.forms.widgets.SelectMultiple`.
        """
        return isinstance(self.django_widget, forms.SelectMultiple)

    def is_select_widget(self):
        """
        Returns ``True`` if the field widget is a :class:`django.forms.widgets.Select`.
        """
        return isinstance(self.django_widget, forms.Select)

    def should_render_as_subwidgets(self):
        """
        Returns True if we should render using :meth:`.make_subwidget_renderable`.

        Default to returining ``True`` if :meth:`.is_radio_select_widget` or
        :meth:`.is_checkbox_select_multiple_widget` returns ``True``.
        """
        return (self.is_radio_select_widget()
                or self.is_checkbox_select_multiple_widget())

    def should_have_for_attribute_on_label(self):
        """
        Should this field get a ``for`` attribute on its label?

        Used by :class:`django_cradmin.uicontainer.label.Label`.

        Defaults to :meth:`.should_render_as_subwidgets`.
        """
        return not self.should_render_as_subwidgets()

    def should_render_as_child_of_label(self):
        """
        Should this field be rendered as a child of the label?

        Used by :class:`django_cradmin.uicontainer.label.Label`.
        """
        return not (self.should_render_as_subwidgets()
                    or self.is_select_widget()
                    or self.is_select_multiple_widget())

    def get_default_bem_block_or_element(self):
        """
        Default BEM block is ``input``.
        """
        if self.is_select_widget():
            return None
        else:
            return 'input'

    def get_default_test_css_class_suffixes_list(self):
        return super(Field, self).get_default_test_css_class_suffixes_list() + [
            'djangowidget-{}'.format(self.django_widget.__class__.__name__.lower())
        ]

    def render_bound_formfield_as_widget(self):
        return self.bound_formfield.as_widget(attrs=self.field_attributes_dict)

    def get_subwidget_renderable_kwargs(self, django_subwidget, index_in_parent):
        """
        Get kwargs for the subwidget created by :meth:`.make_subwidget_renderable`.

        Defaults to the ``subwidget_renderable_kwargs`` kwargs + adding
        a :class:`.SubWidgetField` object as ``subwidget_field_renderable``.
        """
        kwargs = dict(self.extra_subwidget_renderable_kwargs)
        kwargs.update({
            'subwidget_field_renderable': SubWidgetField(django_subwidget=django_subwidget,
                                                         index_in_parent=index_in_parent)
        })
        return kwargs

    def make_subwidget_renderable_radio(self, django_subwidget, index_in_parent):
        """
        Make subwidget renderable to use if :meth:`.is_radio_select_widget` returns ``True``.

        Returns a :class:`django_cradmin.uicontainer.label.RadioSubWidgetLabel`
        with kwargs from :meth:`.get_subwidget_renderable_kwargs` by default.

        Used by :meth:`.make_subwidget_renderable`.

        Args:
            django_subwidget: The SubWidget object.
            index_in_parent: The index of the subwidget in the parent.
        """
        return label.RadioSubWidgetLabel(**self.get_subwidget_renderable_kwargs(
            django_subwidget=django_subwidget,
            index_in_parent=index_in_parent
        ))

    def make_subwidget_renderable_checkbox(self, django_subwidget, index_in_parent):
        """
        Make subwidget renderable to use if :meth:`.is_checkbox_select_multiple_widget` returns ``True``.

        Returns a :class:`django_cradmin.uicontainer.label.CheckboxSubWidgetLabel`
        with kwargs from :meth:`.get_subwidget_renderable_kwargs` by default.

        Used by :meth:`.make_subwidget_renderable`.

        Args:
            django_subwidget: The SubWidget object.
            index_in_parent: The index of the subwidget in the parent.
        """
        return label.CheckboxSubWidgetLabel(**self.get_subwidget_renderable_kwargs(
            django_subwidget=django_subwidget,
            index_in_parent=index_in_parent
        ))

    def make_subwidget_renderable(self, django_subwidget, index_in_parent):
        """
        Make a renderable for a Django SubWidget.

        Only used if :meth:`.should_render_as_subwidgets` returns ``True``.

        By default this returns:

        - :meth:`.make_subwidget_renderable_radio` if :meth:`.is_radio_select_widget` returns ``True``.
        - :meth:`.make_subwidget_renderable_checkbox` if :meth:`.is_checkbox_select_multiple_widget` returns ``True``.
        - Raise NotImplementedError otherwise.

        Args:
            django_subwidget: The SubWidget object.
            index_in_parent: The index of the subwidget in the parent.

        """
        if self.is_radio_select_widget():
            return self.make_subwidget_renderable_radio(
                django_subwidget=django_subwidget, index_in_parent=index_in_parent)
        elif self.is_checkbox_select_multiple_widget():
            return self.make_subwidget_renderable_checkbox(
                django_subwidget=django_subwidget, index_in_parent=index_in_parent)
        else:
            widget_class = self.django_widget.__class__
            raise NotImplementedError(
                'The {widget_class!r} widget is not supported.'.format(
                    widget_class='{}.{}'.format(widget_class.__module__, widget_class.__name__)
                ))

    def iter_subwidgets(self):
        for index, django_subwidget in enumerate(self.django_widget.subwidgets(
                name=self.bound_formfield.html_name,
                value=self.bound_formfield.value(),
                attrs=self.field_attributes_dict)):
            subwidget = self.make_subwidget_renderable(
                django_subwidget=django_subwidget,
                index_in_parent=index)
            subwidget.bootstrap(parent=self)
            yield subwidget

    @property
    def rendered_field(self):
        return self.render_bound_formfield_as_widget()


class HiddenField(Field):
    """
    Just like :class:`.Field`, but renders as
    a ``<input type="hidden">``.
    """
    @property
    def rendered_field(self):
        return self.bound_formfield.as_hidden(attrs=self.field_attributes_dict)
