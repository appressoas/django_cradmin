from django import forms
from django.contrib import messages
from django.shortcuts import redirect
from django.template import defaultfilters

from django_cradmin import crapp
from django_cradmin.demo.multiselect2demo.models import Product
from django_cradmin.viewhelpers import listfilter
from django_cradmin.viewhelpers import multiselect2
from django_cradmin.viewhelpers import multiselect2view


class SelectedProductsForm(forms.Form):
    """
    The form we use for validation and selected items extractions
    when the user submits their selection.

    It is just a plain Django form (can also be a ModelForm). You
    just have to make sure that the name of the form field (``selected_items``)
    matches the value returned by ``get_inputfield_name()`` in the
    ``SelectableProductItemValue`` class.
    """
    selected_items = forms.ModelMultipleChoiceField(
        queryset=Product.objects.none()
    )

    def __init__(self, *args, **kwargs):
        selectable_items_queryset = kwargs.pop('selectable_items_queryset')
        super(SelectedProductsForm, self).__init__(*args, **kwargs)
        self.fields['selected_items'].queryset = selectable_items_queryset


class SelectedProductItem(multiselect2.selected_item_renderer.SelectedItem):
    """
    Define how selected items are rendered.

    You do not have to create this class - you can also just use
    the default value for the ``selected_item_renderer_class``
    You can just use the default value from
    ``multiselect2.listbuilder_itemvalues.ItemValue.selected_item_renderer_class``

    This only scratches the surface of all the options you have for
    how selected items are rendered. See
    :class:`django_cradmin.viewhelpers.multiselect2.selected_item_renderer.SelectedItem`
    for more details.
    """
    valuealias = 'product'

    def get_title(self):
        return self.product.name


class SelectableProductItemValue(multiselect2.listbuilder_itemvalues.ItemValue):
    """
    Define how selectable items are rendered.

    You do not have to create this class - you can also just use
    :class:`django_cradmin.viewhelpers.multiselect2.listbuilder_itemvalues.ItemValue`
    directly if the defaults from that class suites your needs.

    This only scratches the surface of all the options you have for
    how selectable items are rendered. See
    :class:`django_cradmin.viewhelpers.multiselect2.listbuilder_itemvalues.ItemValue`
    for more details.
    """
    valuealias = 'product'

    # You do not need to override this - the default works in most cases!
    selected_item_renderer_class = SelectedProductItem

    def get_inputfield_name(self):
        return 'selected_items'

    def get_title(self):
        return self.product.name

    def get_description(self):
        return defaultfilters.truncatechars(self.product.description, 150)


class ProductTargetRenderer(multiselect2.target_renderer.Target):
    """
    Define how to render the box containing selected items.

    You do not have to create this class - you can also just use
    :class:`django_cradmin.viewhelpers.multiselect2.target_renderer.Target`
    directly if the defaults from that class suites your needs.

    This only scratches the surface of all the options you have for
    how the selected items box is rendered. See
    :class:`django_cradmin.viewhelpers.multiselect2.target_renderer.Target`
    for more details.
    """
    def get_with_items_title(self):
        return 'Selected products:'

    def get_submit_button_text(self):
        return 'Do stuff with products'

    def get_without_items_text(self):
        return 'Nothing selected'


class ProductListView(multiselect2view.ListbuilderView):
    """
    A very simple example of a multiselect2 view.

    It could be simplified further since the following is optional:

    - You do not have to override ``value_renderer_class``.
    - You do not have to override ``get_target_renderer_class``.
    """
    model = Product
    value_renderer_class = SelectableProductItemValue
    paginate_by = 20

    def get_queryset_for_role(self, role):
        return Product.objects.all().order_by('name')

    def get_target_renderer_class(self):
        return ProductTargetRenderer

    #
    #
    # Handling the POST request is just like in a normal Django FormView.
    # The form is not used for GET requests, so the methods below
    # are just for handling POST requests (when users submit their selection).
    #
    #

    def get_form_class(self):
        return SelectedProductsForm

    def get_form_kwargs(self):
        kwargs = super(ProductListView, self).get_form_kwargs()
        kwargs['selectable_items_queryset'] = Product.objects.all()
        return kwargs

    def form_valid(self, form):
        productnames = ['"{}"'.format(product.name) for product in form.cleaned_data['selected_items']]
        messages.success(
            self.request,
            'POST OK. Selected: {}'.format(', '.join(productnames)))
        return redirect(self.request.get_full_path())

    def form_invalid(self, form):
        messages.error(self.request, form.errors.as_text())
        return redirect(self.request.get_full_path())


class FilteredProductListView(multiselect2view.ListbuilderFilterView):
    """
    This view is just like ProductListView except that it adds filters!
    """
    model = Product
    value_renderer_class = SelectableProductItemValue
    paginate_by = 20

    def add_filterlist_items(self, filterlist):
        filterlist.append(listfilter.django.single.textinput.Search(
            slug='search',
            label='Search',
            label_is_screenreader_only=True,
            modelfields=['name', 'description']))

    def get_filterlist_url(self, filters_string):
        return self.request.cradmin_app.reverse_appurl(
            'withfilters', kwargs={'filters_string': filters_string})

    def get_unfiltered_queryset_for_role(self, role):
        return Product.objects.all().order_by('name')

    def get_target_renderer_class(self):
        return ProductTargetRenderer

    #
    #
    # Handling the POST request is just like in a normal Django FormView.
    # The form is not used for GET requests, so the methods below
    # are just for handling POST requests (when users submit their selection).
    #
    #

    def get_form_class(self):
        return SelectedProductsForm

    def get_form_kwargs(self):
        kwargs = super(FilteredProductListView, self).get_form_kwargs()
        kwargs['selectable_items_queryset'] = Product.objects.all()
        return kwargs

    def form_valid(self, form):
        productnames = ['"{}"'.format(product.name) for product in form.cleaned_data['selected_items']]
        messages.success(
            self.request,
            'POST OK. Selected: {}'.format(', '.join(productnames)))
        return redirect(self.request.get_full_path())

    def form_invalid(self, form):
        messages.error(self.request, form.errors.as_text())
        return redirect(self.request.get_full_path())


class ProductListViewSelectOnLoad(ProductListView):
    """
    Extends :class:`.ProductListView` to show how to select items when the
    view loads.
    """
    def __make_value_and_frame_renderer_kwargs(self, product):
        """
        Select all products that contains ``"sock"`` in their name.

        This method is called by :meth:`.get_listbuilder_list_kwargs` (below)
        to create kwargs for our :class:`.SelectableProductItemValue`.
        That class inherits from
        :class:`.django_cradmin.viewhelpers.multiselect2.listbuilder_itemvalues.ItemValue`,
        which takes ``is_selected`` as a kwarg.
        """
        return {
            'is_selected': 'sock' in product.name.lower()
        }

    def get_value_and_frame_renderer_kwargs(self):
        """
        We return a callable here. This callable is used to create
        individual kwargs for each value in the list.
        """
        return self.__make_value_and_frame_renderer_kwargs


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            ProductListView.as_view(),
            name=crapp.INDEXVIEW_NAME),
        crapp.Url(
            r'^with-filters/(?P<filters_string>.+)?$',
            FilteredProductListView.as_view(),
            name='withfilters'),
        crapp.Url(
            r'^select-on-load$',
            ProductListViewSelectOnLoad.as_view(),
            name='select-on-load'),
    ]
