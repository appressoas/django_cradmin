from django.contrib.auth import get_user_model
from django_cradmin.demo.webdemo.models import PageTag, Page
from django_cradmin.viewhelpers import listbuilder
from django_cradmin.viewhelpers import listbuilderview
from django_cradmin.viewhelpers import listfilter
from django_cradmin.viewhelpers.listfilter.basefilters.single import abstractradio

from . import mixins


class PageListItemValue(listbuilder.itemvalue.EditDeleteWithArchiveImage):
    template_name = 'webdemo/pages/pagelist-itemvalue.django.html'
    valuealias = 'page'

    def get_archiveimage(self):
        return self.page.image

    def get_description(self):
        return self.page.intro


class OrderPagesFilter(listfilter.django.single.select.AbstractOrderBy):
    def get_ordering_options(self):
        return [
            ('', {
                'label': 'Publishing time (newest first)',
                'order_by': ['-publishing_time'],
            }),
            ('publishing_time_asc', {
                'label': 'Publishing time (oldest first)',
                'order_by': ['publishing_time'],
            }),
            ('title', {
                'label': 'Title',
                'order_by': ['title'],
            }),
        ]


class PageTagChecboxFilter(listfilter.django.multi.checkbox.RelatedModelOrFilter):
    def get_choices(self):
        return [
            (tag, tag)
            for tag in PageTag.objects.values_list('tag', flat=True).distinct()
        ]

    def get_filter_attribute(self):
        return 'tags__tag'


class PageTagRadioFilter(abstractradio.AbstractRadioFilter, listfilter.django.DjangoOrmFilterMixin):
    def get_choices(self):
        choices = [
            (tag, tag)
            for tag in PageTag.objects.values_list('tag', flat=True).distinct()
        ]
        choices.insert(0, ('', 'Ignore tags'))
        return choices

    def filter(self, queryobject):
        cleaned_value = self.get_cleaned_value()
        if cleaned_value:
            queryobject = queryobject.filter(tags__tag=cleaned_value).distinct()
        return queryobject


class PageSubscriberFilter(listfilter.django.multi.checkbox.RelatedModelOrFilter):
    def get_choices(self):
        return [
            (user.username, str(user))
            for user in get_user_model().objects.all()
        ]

    def get_filter_attribute(self):
        return 'subscribers__username'


class PagesListBuilderView(mixins.PagesQuerySetForRoleMixin,
                           listbuilderview.ViewCreateButtonMixin,
                           listbuilderview.View):
    """
    Shows how to use listbuilderview with listfilter.
    """
    model = Page
    value_renderer_class = PageListItemValue

    # def get_filterlist_url(self, filters_string):
    #     return self.request.cradmin_app.reverse_appurl(
    #         'filter', kwargs={'filters_string': filters_string})

    def get_post_include_template(self):
        return 'webdemo/pages/pagelist-post-include.django.html'

    def get_unfiltered_queryset_for_role(self):
        return mixins.PagesQuerySetForRoleMixin\
            .get_queryset_for_role(self)\
            .prefetch_related('tags')
