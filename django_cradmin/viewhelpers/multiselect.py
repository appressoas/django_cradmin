from django.utils.translation import ugettext_lazy as _
from django import forms
from django.views.generic import TemplateView
from django.views.generic.edit import FormMixin
from django.shortcuts import render


class MultiSelectView(TemplateView):
    """
    Base view for multiselect views (views used when the
    user selects one or more items for some action).
    """

    def get_queryset_for_role(self, role):
        """
        Get a queryset with all objects of :obj:`.model`  that
        the current role can access.
        """
        raise NotImplementedError()

    def get_queryset(self):
        """
        DO NOT override this. Override :meth:`.get_queryset_for_role`
        instead.
        """
        queryset = self.get_queryset_for_role(self.request.cradmin_role)
        return queryset

    def _get_selected_objects_form_class(self):
        class MultiSelectForm(forms.Form):
            selected_objects = forms.ModelMultipleChoiceField(
                widget=forms.MultipleHiddenInput,
                queryset=self.get_queryset())
        return MultiSelectForm

    def _get_selected_objects_form(self):
        form_class = self._get_selected_objects_form_class()
        return form_class(data=self.request.POST)

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests, instantiating a form instance with the passed
        POST variables and then checked for validity.
        """
        self.selected_objects_form = self._get_selected_objects_form()
        if self.selected_objects_form.is_valid():
            self.selected_objects = self.selected_objects_form['selected_objects']
            return self.object_selection_valid()
        else:
            return self.object_selection_invalid(self.selected_objects_form)

    def is_first_load(self):
        """
        Can be used by subclasses to check if this is the
        first/initial load of this view (right after
        the user submits the form where they selected what
        to perform the action for).
        """
        return 'is_the_multiselect_form' in self.request.POST

    def object_selection_valid(self, selected_objects):
        """
        Called if the form used to validate the selected objects is valid.
        Must be overridden.
        """
        raise NotImplementedError()

    def object_selection_invalid(self, form):
        """
        Called if the form used to validate the selected objects is invalid.
        Must be overridden.
        """
        return render(self.request, 'django_cradmin/error.django.html', {
            'error': _(
                'Invalid selection. This is usually caused by someone else changing '
                'permissions while you where selecting items to edit.')
        })

    def get_context_data(self, **kwargs):
        context = super(MultiSelectView, self).get_context_data(**kwargs)
        context['selected_objects_form'] = self.selected_objects_form
        return context


class MultiSelectFormView(MultiSelectView, FormMixin):
    template_name = 'django_cradmin/viewhelpers/multiselect/formview.django.html'

    #: The model class to edit. You do not have to specify
    #: this, but if you do not specify this, you have to override
    #: :meth:`.get_pagetitle`.
    model = None

    def object_selection_valid(self):
        form_class = self.get_form_class()
        if self.is_first_load():
            form = form_class()
            return self.first_load(form)
        else:
            form = self.get_form(form_class)
            if form.is_valid():
                return self.form_valid(form)
            else:
                return self.form_invalid(form)

    def first_load(self, form):
        """
        Called on the first load of the page (right after
        the user submits the form where they selected what
        to edit).
        """
        return self.render_to_response(self.get_context_data(form=form))

    def form_invalid(self, form):
        """
        Called when the form is invalid.
        """
        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):
        """
        Called when the form is valid. Must be overridden.

        You will normally want to do something with the form data
        here, and redirect to a success page.
        """
        raise NotImplementedError()

    def get_pagetitle(self):
        """
        Get the page title/heading.

        Defaults to the ``verbose_name_plural`` of the :obj:`.model`.
        """
        return self.model._meta.verbose_name_plural

    def get_context_data(self, **kwargs):
        context = super(MultiSelectFormView, self).get_context_data(**kwargs)
        context['pagetitle'] = self.get_pagetitle()
        return context
