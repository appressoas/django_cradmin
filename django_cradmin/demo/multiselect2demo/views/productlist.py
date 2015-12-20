from django_cradmin import crapp
from django_cradmin.demo.multiselect2demo.models import Product
from django_cradmin.viewhelpers import listbuilderview
from django_cradmin.viewhelpers import listfilter
from django_cradmin.viewhelpers import multiselect2


class ProductListItemValue(multiselect2.listbuilder_itemvalues.ItemValue):
    def get_inputfield_name(self):
        return 'selected_products'


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
        filterlist.append(multiselect2.target_renderer.Target())

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
