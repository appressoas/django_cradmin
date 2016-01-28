from django import forms
from django.views.generic.edit import FormMixin

from django_cradmin.viewhelpers import listbuilderview
from django_cradmin.viewhelpers import multiselect2


class ViewMixin(FormMixin):
    """
    Multiselect2 view mixin. Must be mixin in before any Django View subclass.

    This is typically used with a Django ListView or TemplateView.
    """
    def get_target_renderer_class(self):
        """
        Get the target renderer class.

        Must return :class:`django_cradmin.viewhelpers.multiselect2.target_renderer.Target`
        or a subclass of that class.

        Defaults to returning :class:`django_cradmin.viewhelpers.multiselect2.target_renderer.Target`.
        """
        return multiselect2.target_renderer.Target

    def get_target_renderer_kwargs(self):
        """
        Get keywork arguments for the class returned
        by :meth:`.get_target_renderer_class`

        You should call ``super()`` when overriding this method
        to get any default kwargs provided by this method.
        """
        return {
            'form': self.get_form()
        }

    def get_target_renderer(self):
        """
        Get the target renderer object.

        Must return an object of :class:`django_cradmin.viewhelpers.multiselect2.target_renderer.Target`
        or a subclass of that class.

        .. note:: You normally do not override this method, but instead
            you override :meth:`.get_target_renderer_kwargs` and
            :meth:`.get_target_renderer_class`.
        """
        return self.get_target_renderer_class()(**self.get_target_renderer_kwargs())

    def get_context_data(self, **kwargs):
        context = super(ViewMixin, self).get_context_data(**kwargs)
        context['target_renderer'] = self.get_target_renderer()
        return context

    def is_initially_selected(self, value):
        """
        Should the provided value be selected on load?

        You normally do not need to override this. Override:

        - :meth:`.get_inititially_selected_queryset`
        - and for very rare cases, override :meth:`.get_postrequest_selected_queryset`.

        Args:
            value: A value in the listbuilder list (an object in the queryset).

        Returns:
            bool: If the provided value should be selected on load, return ``True``,
            otherwise return ``False``. Defaults to ``False`` if you do not overrie
            this method.
        """
        return value in self._initially_selected_values_set

    def __value_is_selected(self, value):
        if self.request.GET.get('cradmin-bgreplaced', 'false') == 'true':
            return False
        else:
            return self.is_initially_selected(value=value)

    def make_value_and_frame_renderer_kwargs(self, value):
        """
        This method is called by :meth:`.get_listbuilder_list_kwargs` (below)
        to create kwargs for our value and frame renderers.
        """
        return {
            'is_selected': self.__value_is_selected(value=value)
        }

    def get_value_and_frame_renderer_kwargs(self):
        """
        We return a callable here. This callable is used to create
        individual kwargs for each value in the list.
        """
        return self.make_value_and_frame_renderer_kwargs

    def get_selected_items_form_attribute(self):
        """
        Get the form attribute that contains the selected items.

        Defaults to ``"selected_items"``, so you need to override this
        if you use something else in your form.
        """
        return 'selected_items'

    def get_selectable_items_queryset(self):
        if hasattr(self, 'get_unfiltered_queryset_for_role'):
            queryset = self.get_unfiltered_queryset_for_role(role=self.request.cradmin_role)
        else:
            queryset = self.get_queryset()
        return queryset

    def __make_selected_items_form_class(self):
        selected_items_form_attribute = self.get_selected_items_form_attribute()
        selectable_items_queryset = self.get_selectable_items_queryset()

        class SelectedItemsForm(forms.Form):
            def __init__(self, *args, **kwargs):
                super(SelectedItemsForm, self).__init__(*args, **kwargs)
                self.fields[selected_items_form_attribute] = forms.ModelMultipleChoiceField(
                        queryset=selectable_items_queryset
                )

        return SelectedItemsForm

    def get_postrequest_selected_queryset(self):
        """
        Get a QuerySet of the items that was selected on POST.

        If the form attribute where you set your selected items is not
        named ``"selected_items"``, you have to override :meth:`.get_selected_items_form_attribute`.

        You normally do not need to override this method.

        Optionally, you can override both :meth:`.form_invalid_init` and :meth:`.form_invalid`
        to disable autoselect of the items that was selected before post.
        """
        form_class = self.__make_selected_items_form_class()
        form = form_class(self.request.POST)
        if form.is_valid():
            selected_items_form_attribute = self.get_selected_items_form_attribute()
            return form.cleaned_data[selected_items_form_attribute]
        else:
            return self.model.objects.none()

    def get_inititially_selected_queryset(self):
        """
        Get queryset of initially selected items.

        Defaults to ``self.model.object.none()``, and you should override this
        if you want to select any objects on load.
        """
        return self.model.objects.none()

    def get_selected_values_queryset(self):
        if self.request.method == 'POST':
            return self.get_postrequest_selected_queryset()
        else:
            return self.get_inititially_selected_queryset()

    def __get_selected_values_set(self):
        return set(self.get_selected_values_queryset())

    def form_invalid_init(self, form):
        """
        Called before ``form_invalid()`` to initialize the required attributes for
        ``form_invalid()``.

        If you provide a custom ``form_invalid``-method that does not re-render
        the page (I.E.: returns a HttpResponseRedirect with an error message),
        you can override this method
        """
        self.object_list = self.get_queryset()

    def dispatch(self, request, *args, **kwargs):
        self._initially_selected_values_set = self.__get_selected_values_set()
        return super(ViewMixin, self).dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests, instantiating a form instance with the passed
        POST variables and then checked for validity.
        """
        form = self.get_form()
        if form.is_valid():
            self.__form_is_valid = True
            return self.form_valid(form)
        else:
            self.__form_is_valid = False
            self.form_invalid_init(form)
            return self.form_invalid(form)

    def get_queryset(self):
        queryset = super(ViewMixin, self).get_queryset().distinct()
        queryset = self.get_selected_values_queryset().distinct() | queryset
        queryset = queryset.distinct()
        return queryset


class ListbuilderView(ViewMixin, listbuilderview.View):
    """
    Multiselect2 listbuilder view.
    """
    template_name = 'django_cradmin/viewhelpers/multiselect2view/listbuilderview.django.html'
    value_renderer_class = multiselect2.listbuilder_itemvalues.ItemValue


class ListbuilderFilterView(ViewMixin, listbuilderview.FilterListMixin, listbuilderview.View):
    """
    Multiselect2 listbuilder view with filters.
    """
    template_name = 'django_cradmin/viewhelpers/multiselect2view/listbuilderfilterview.django.html'
    value_renderer_class = multiselect2.listbuilder_itemvalues.ItemValue

    def get_filterlist_template_name(self):
        return self.template_name
