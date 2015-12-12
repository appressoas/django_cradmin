from django_cradmin import crapp
from django_cradmin.demo.multiselectdemo.models import Product
from django_cradmin import renderable
from django_cradmin.viewhelpers import listbuilderview
from django_cradmin.viewhelpers import listfilter
from django_cradmin.viewhelpers import listbuilder
from django_cradmin.viewhelpers.listfilter.base import abstractfilterlistchild


class ProductListItemValue(listbuilder.itemvalue.FocusBox):
    template_name = 'webdemo/multiselect/productlist-itemvalue.django.html'
    valuealias = 'product'

    def is_selected(self):
        # This should only be set when posting something that results in an error
        # - it is used to re-select the previously selected choices
        return self.product.id == 2


class ProductListSelectTarget(renderable.AbstractRenderableWithCss,
                              abstractfilterlistchild.FilterListChildMixin):
    template_name = 'webdemo/multiselect/productlist-select-target.django.html'


class ProductListView(listbuilderview.FilterListMixin, listbuilderview.View):
    model = Product
    value_renderer_class = ProductListItemValue

    def add_filterlist_items(self, filterlist):
        filterlist.append(listfilter.django.single.textinput.Search(
            slug='search',
            label='Search',
            label_is_screenreader_only=True,
            modelfields=['name', 'description']))
        filterlist.append(ProductListSelectTarget())

    def get_filterlist_url(self, filters_string):
        return self.request.cradmin_app.reverse_appurl(
            'filter', kwargs={'filters_string': filters_string})

    def get_queryset_for_role(self, role):
        queryset = Product.objects.all().order_by('name')
        queryset = self.get_filterlist().filter(queryset)
        return queryset


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
    ]
