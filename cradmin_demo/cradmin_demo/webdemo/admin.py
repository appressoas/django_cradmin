from django.contrib import admin
from cradmin_demo.webdemo.models import Site, Page


class SiteAdmin(admin.ModelAdmin):
    list_display = ('name', 'admins_as_string')

    def admins_as_string(self, obj):
        return ', '.join([user.username for user in obj.admins.all()])
    admins_as_string.short_description = "Admins"

admin.site.register(Site, SiteAdmin)


class PageAdmin(admin.ModelAdmin):
    list_display = ('title', 'site')

admin.site.register(Page, PageAdmin)
