from __future__ import unicode_literals
from builtins import object
from crispy_forms import layout
from django.conf import settings
from django.views.generic import FormView as DjangoFormView
from django.utils.translation import ugettext_lazy as _

from django_cradmin import crapp
from django_cradmin.crispylayouts import CradminFormHelper


class FormViewMixin(object):
    """
    Mixin class for form views.
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

    #: Enable support for modelchoicefield?
    #: If this is ``False``, you will not be able to use
    #: :class:`django_cradmin.widgets.modelchoice.ModelChoiceWidget`
    #: in the form.
    enable_modelchoicefield_support = False

    #: Set this to True to hide the page header. See :meth:`~.FormViewMixin.get_hide_page_header`.
    hide_page_header = False

    #: The save submit label. See :meth:`~.FormViewMixin.get_submit_save_label`.
    submit_save_label = _('Save')

    #: The save submit label. See :meth:`~.FormViewMixin.get_submit_save_and_continue_edititing_label`.
    submit_save_and_continue_edititing_label = _('Save and continue editing')

    #: See :meth:`~.FormViewMixin.get_submit_save_button_name`.
    submit_save_button_name = 'submit-save'

    #: See :meth:`~.FormViewMixin.get_submit_save_and_continue_edititing_button_name`.
    submit_save_and_continue_edititing_button_name = 'submit-save-and-continue-editing'

    def get_submit_save_label(self):
        """
        Get the save submit label. Not used by this mixin, but you
        can use this in your own ``get_buttons``-method.

        Defaults to :obj:`~.FormViewMixin.submit_save_label`.
        """
        return self.submit_save_label

    def get_submit_save_and_continue_edititing_label(self):
        """
        Get the "save and continue editing" submit label. Not used by this mixin, but you
        can use this in your own ``get_buttons``-method.

        Defaults to :obj:`~.FormViewMixin.submit_save_and_continue_edititing_label`.
        """
        return self.submit_save_and_continue_edititing_label

    def get_submit_save_button_name(self):
        """
        Get the name of the save submit button. Not used by this mixin, but you
        can use this in your own ``get_buttons``-method.

        Defaults to :obj:`~.FormViewMixin.submit_save_button_name`.
        """
        return self.submit_save_button_name

    def get_submit_save_and_continue_edititing_button_name(self):
        """
        Get the "save and continue editing" submit button name.
        Not used by this mixin, but you can use this in your own ``get_buttons``-method.

        Defaults to :obj:`~.FormViewMixin.submit_save_and_continue_edititing_button_name`.
        """
        return self.submit_save_and_continue_edititing_button_name

    def get_hide_page_header(self):
        """
        Return ``True`` if we should hide the page header.

        You can override this, or set :obj:`.hide_page_header`, or hide the page header
        in all form views with the ``DJANGO_CRADMIN_HIDE_PAGEHEADER_IN_FORMVIEWS`` setting.
        """
        return self.hide_page_header or getattr(settings, 'DJANGO_CRADMIN_HIDE_PAGEHEADER_IN_FORMVIEWS', False)

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
        raise NotImplementedError()

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

    def get_formhelper_class(self):
        return CradminFormHelper

    def get_formhelper(self):
        """
        Get a :class:`crispy_forms.helper.FormHelper`.

        You normally do not need to override this directly. Instead
        you should override:

        - :meth:`.get_field_layout`.
        - :meth:`.get_hidden_fields`
        - :meth:`.get_buttons` (or perhaps :meth:`.get_button_layout`)
        """
        helper = self.get_formhelper_class()()
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
        context['enable_modelchoicefield_support'] = self.enable_modelchoicefield_support
        context['hide_pageheader'] = self.get_hide_page_header()
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
    A :class:`django.views.generic.edit.FormView` with :class:`.FormViewMixin`.

    Examples:

        Minimalistic example::

            from django import forms
            from django.http import HttpResponseRedirect
            from django_cradmin.crispylayouts import PrimarySubmit

            class MyForm(forms.Form):
                first_name = forms.CharField(max_length=50)
                last_name = forms.CharField(max_length=50)

            class MyFormView(FormView):
                template_name = 'myapp/myview.django.html'
                form_class = MyForm

                def get_field_layout(self):
                    return [
                        'first_name',
                        'last_name',
                    ]

                def get_buttons(self):
                    return [
                        PrimarySubmit('save', _('Save')),
                    ]

                def form_valid(self, form):
                    # ... do something with the form ...
                    return HttpResponseRedirect('/some/view')
    """
    template_name = 'django_cradmin/viewhelpers/formview_base.django.html'
