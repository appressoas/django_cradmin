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
        return {}

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

    def is_initially_selected_on_get(self, value):
        """
        Should the provided value be selected on load for GET requests?
        Override this to select values on load for GET requests.

        Args:
            value: A value in the listbuilder list (an object in the queryset).

        Returns:
            bool: If the provided value should be selected on load, return ``True``,
            otherwise return ``False``. Defaults to ``False`` if you do not overrie
            this method.
        """
        return False

    def is_initially_selected_on_post(self, value, form_is_valid):
        """
        Should the provided value be selected on load for POST requests?

        Args:
            value: A value in the listbuilder list (an object in the queryset).
            form_is_valid: This is ``False`` if the posted form is invalid.

        Returns:
            bool: If the provided value should be selected on load, return ``True``,
            otherwise return ``False``. Defaults to ``True`` if the value was selected
            in the POST request.
        """
        if form_is_valid:
            return False
        else:
            return value in self.items_selected_on_post_set

    def is_initially_selected(self, value):
        """
        Calls :meth:`.is_initially_selected_on_get` or :meth:`.is_initially_selected_on_post`
        depending on the request method.
        """
        if self.request.method == 'GET':
            return self.is_initially_selected_on_get(value=value)
        elif self.request.method == 'POST':
            return self.is_initially_selected_on_post(value=value,
                                                      form_is_valid=self.__form_is_valid)

    def make_value_and_frame_renderer_kwargs(self, value):
        """
        This method is called by :meth:`.get_listbuilder_list_kwargs` (below)
        to create kwargs for our value and frame renderers.
        """
        return {
            'is_selected': self.is_initially_selected(value=value)
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

    def get_selected_items_set(self, form):
        """
        Get a ``set`` of the items that was selected on POST.

        If the form attribute where you set your selected items is not
        named ``"selected_items"``, you have to override :meth:`.get_selected_items_set`.

        Optionally, you can override both :
        """
        return set(form.cleaned_data[self.get_selected_items_form_attribute()])

    def form_invalid_init(self, form):
        """
        Called before ``form_invalid()`` to initialize the required attributes for
        ``form_invalid()``.

        If you provide a custom ``form_invalid``-method that does not re-render
        the page (I.E.: returns a HttpResponseRedirect with an error message),
        you can override this method
        """
        self.object_list = self.get_queryset()
        self.items_selected_on_post_set = self.get_selected_items_set(form=form)

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
