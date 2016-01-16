from django_cradmin import crapp
from django_cradmin.demo.multiselect2demo.models import Product
from django_cradmin.viewhelpers import listbuilderview
from django_cradmin.viewhelpers import listfilter
from django_cradmin.viewhelpers import multiselect2


class ProductListItemValue(multiselect2.listbuilder_itemvalues.ItemValue):
    def get_inputfield_name(self):
        return 'selected_products'


class ProductTargetRenderer(multiselect2.target_renderer.Target):
    def get_with_items_title(self):
        return 'Products selected'

    def get_submit_button_text(self):
        return 'Do stuff with products'

    def get_without_items_text(self):
        return 'Nothing selected'


class ProductListView(listbuilderview.FilterListMixin, listbuilderview.View):
    model = Product
    value_renderer_class = ProductListItemValue
    paginate_by = 20

    def add_filterlist_items(self, filterlist):
        filterlist.append(listfilter.django.single.textinput.Search(
            slug='search',
            label='Search',
            label_is_screenreader_only=True,
            modelfields=['name', 'description']))
        # Add the renderer for the target of selects
        # - the target can be added to a listfilter list,
        #   or rendered by itself anywhere in the page using
        #   ``{% cradmin_render_renderable %}`` (see
        #   :class:`.ProductListItemValue` for an example of this.
        filterlist.append(ProductTargetRenderer())

    def get_filterlist_url(self, filters_string):
        return self.request.cradmin_app.reverse_appurl(
            'filter', kwargs={'filters_string': filters_string})

    def get_unfiltered_queryset_for_role(self, role):
        return Product.objects.all().order_by('name')


class ProductListViewFlexbox(listbuilderview.FilterListMixin, listbuilderview.View):
    """
    A slightly more complex alternative to ProductListView above.

    This uses a custom template and renders the target in a column by itself.
    """
    model = Product
    value_renderer_class = ProductListItemValue
    paginate_by = 20

    def get_filterlist_template_name(self):
        return 'multiselect2demo/productlist-flexbox.django.html'

    def add_filterlist_items(self, filterlist):
        filterlist.append(listfilter.django.single.textinput.Search(
            slug='search',
            label='Search',
            label_is_screenreader_only=True,
            modelfields=['name', 'description']))

    def get_filterlist_url(self, filters_string):
        return self.request.cradmin_app.reverse_appurl(
            'flexbox', kwargs={'filters_string': filters_string})

    def get_unfiltered_queryset_for_role(self, role):
        return Product.objects.all().order_by('name')

    def get_context_data(self, **kwargs):
        context = super(ProductListViewFlexbox, self).get_context_data(**kwargs)
        context['targetrenderer'] = ProductTargetRenderer()
        return context



class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            ProductListView.as_view(),
            name=crapp.INDEXVIEW_NAME),
        crapp.Url(
            r'^filter/(?P<filters_string>.+)?$',
            ProductListView.as_view(),
            name='filter'),
        crapp.Url(
            r'^flexbox/(?P<filters_string>.+)?$',
            ProductListViewFlexbox.as_view(),
            name='flexbox'),
    ]
