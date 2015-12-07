from __future__ import unicode_literals
from django.contrib import admin
from django_cradmin.demo.webdemo.models import Site, Page, PageTag


class SiteAdmin(admin.ModelAdmin):
    list_display = ('name', 'admins_as_string')

    def admins_as_string(self, obj):
        return ', '.join([user.username for user in obj.admins.all()])
    admins_as_string.short_description = "Admins"

admin.site.register(Site, SiteAdmin)


class PageTagInline(admin.TabularInline):
    model = PageTag
    extra = 0


class PageAdmin(admin.ModelAdmin):
    list_display = [
        'title',
        'site',
        'get_tags',
    ]
    inlines = [
        PageTagInline
    ]

    def get_tags(self, obj):
        return ', '.join(pagetag.tag for pagetag in obj.pagetag_set.all())
    get_tags.short_description = 'Tags'

    def get_queryset(self, request):
        return super(PageAdmin, self).get_queryset(request)\
            .select_related('site')\
            .prefetch_related('pagetag_set')

admin.site.register(Page, PageAdmin)
