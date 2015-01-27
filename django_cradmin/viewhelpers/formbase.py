from crispy_forms import layout
from crispy_forms.helper import FormHelper
from django.views.generic import FormView as DjangoFormView

from django_cradmin import crapp


class FormViewMixin(object):
    """
    Mixin class for Update and Create views.
    """

    #: Get the view name for the listing page.
    #: You can set this, or implement :meth:`.get_listing_url`.
    #: Defaults to :obj:`django_cradmin.crapp.INDEXVIEW_NAME`.
    listing_viewname = crapp.INDEXVIEW_NAME

    #: Used to add custom attributes like angularjs directives to the form.
    #: See :meth:`.get_form_attributes`.
    form_attributes = {}

    #: A list of extra form css classes. See :meth:`.get_extra_form_css_classes`.
    extra_form_css_classes = []

    #: The ID to set on the DOM element for the form. See :meth:`.get_form_id`.
    form_id = None

    def get_field_layout(self):
        """
        Get a list/tuple of fields. These are added to a ``crispy_forms.layout.Layout``.

        Must be overridden.

        Simple example::

            from django.views.generic import FormView
            from crispy_forms import layout

            class MyFormView(FormViewMixin, FormView):
                def get_field_layout(self):
                    return [
                        layout.Div(
                            'title', 'name', 'size', 'tags',
                            css_class='cradmin-globalfields')
                    ]

        A slightly more complex example::

            from crispy_forms import layout

            class MyFormView(FormViewMixin, FormView):
                def get_field_layout(self):
                    return [
                        layout.Div('title', css_class="cradmin-focusfield cradmin-focusfield-lg"),
                        layout.Div('description', css_class="cradmin-focusfield"),
                        layout.Fieldset('Metadata',
                            'size',
                            'tags'
                        )

                    ]

        """

    def get_hidden_fields(self):
        """
        Get hidden fields for the form.

        Returns:
            An iterable of :class:`crispy_forms.layout.Hidden` objects.
            Defaults to an empty list.
        """
        return []

    def get_buttons(self):
        """
        Get buttons for the form, normally one or more submit button.

        Each button must be a crispy form layout object, typically some
        subclass of :class:`crispy_forms.layout.Submit`.

        See:
            This method is used by :meth:`.get_button_layout`.
        """
        return []

    def get_button_layout(self):
        """
        Get the button layout. This is added to the crispy form layout.

        Defaults to a :class:`crispy_forms.layout.Div` with css class
        ``django_cradmin_submitrow`` containing all the buttons
        returned by :meth:`.get_buttons`.
        """
        return [
            layout.Div(*self.get_buttons(), css_class="django_cradmin_submitrow")
        ]

    def get_form_attributes(self):
        """
        You can add custom attributes to the form via this method.

        This is set as the ``attrs``-attribute of the crispy FormHelper
        created in :meth:`.get_formhelper`.

        Defaults to :obj:`.form_attributes`.

        Returns:
            A dictionary to set any kind of form attributes. Underscores in
            keys are translated into hyphens.
        """
        return self.form_attributes

    def get_form_css_classes(self):
        """
        Returns list of css classes set on the form. You normally
        want to override :meth:`.get_extra_form_css_classes` instead
        of this method unless you want to provide completely custom
        form styles.
        """
        form_css_classes = [
            'django-cradmin-form'
        ]
        form_css_classes.extend(self.get_extra_form_css_classes())
        return form_css_classes

    def get_extra_form_css_classes(self):
        """
        Returns list of extra form css classes. These classes are added to
        the default list of css classes in :meth:`.get_form_css_classes`.

        Defaults to :obj:`.extra_form_css_classes`.
        """
        return self.extra_form_css_classes

    def get_form_id(self):
        """
        Returns the ID to set on the DOM element for the form.

        Defaults to :obj:`.form_id`.
        """
        return self.form_id

    def get_formhelper(self):
        """
        Get a :class:`crispy_forms.helper.FormHelper`.

        You normally do not need to override this directly. Instead
        you should override:

        - :meth:`.get_field_layout`.
        - :meth:`.get_hidden_fields`
        - :meth:`.get_buttons` (or perhaps :meth:`.get_button_layout`)
        """
        helper = FormHelper()
        helper.form_class = ' '.join(self.get_form_css_classes())
        layoutargs = list(self.get_field_layout()) + list(self.get_button_layout()) + list(self.get_hidden_fields())
        helper.layout = layout.Layout(*layoutargs)
        helper.form_action = self.request.get_full_path()
        form_id = self.get_form_id()
        if form_id:
            helper.form_id = form_id
        helper.attrs = self.get_form_attributes()
        return helper

    def get_context_data(self, **kwargs):
        context = super(FormViewMixin, self).get_context_data(**kwargs)
        context['formhelper'] = self.get_formhelper()
        return context

    def get_listing_url(self):
        """
        Get the URL of the listing view.

        Defaults to :obj:`.listing_viewname`. This is used as the success URL
        by default.
        """
        return self.request.cradmin_app.reverse_appurl(self.listing_viewname)

    def get_default_save_success_url(self):
        if 'success_url' in self.request.GET:
            return self.request.GET['success_url']
        else:
            return self.get_listing_url()

    def get_success_url(self):
        return self.get_default_save_success_url()


class FormView(FormViewMixin, DjangoFormView):
    """
    Form view with the :class:`.FormViewMixin`.

    Usage::


    """
