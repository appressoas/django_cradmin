from django_cradmin.superuserui.views import mixins
from django_cradmin.viewhelpers import listbuilderview
from django_cradmin.viewhelpers import listfilter
from django_cradmin.viewhelpers import listbuilder


class View(mixins.QuerySetForRoleMixin,
           # listbuilderview.FilterListMixin,
           listbuilderview.ViewCreateButtonMixin,
           listbuilderview.View):

    paginate_by = 50
    value_renderer_class = listbuilder.itemvalue.EditDelete

    # def get_filterlist_url(self, filters_string):
    #     return self.request.cradmin_app.reverse_appurl(
    #         'filter', kwargs={'filters_string': filters_string})

    def get_post_include_template(self):
        return 'webdemo/pages_listbuilder/pagelist-post-include.django.html'

    # def add_filterlist_items(self, filterlist):
    #     filterlist.append(listfilter.django.single.textinput.Search(
    #         slug='search',
    #         label='Search',
    #         label_is_screenreader_only=True,
    #         modelfields=['title']))
    #     filterlist.append(OrderPagesFilter(
    #         slug='orderby', label='Order by'))
    #     filterlist.append(listfilter.django.single.select.IsNotNull(
    #         slug='image', label='Has image?'))
    #     filterlist.append(listfilter.django.single.select.DateTime(
    #         slug='publishing_time', label='Publishing time'))
    #     filterlist.append(PageTagFilter(
    #         slug='tags', label='Tag'))
    #     filterlist.append(PageSubscriberFilter(
    #         slug='subscribers', label='Subscribers'))
