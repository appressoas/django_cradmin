from __future__ import unicode_literals
from django.contrib import admin
from django.template import defaultfilters
from django_cradmin import crsettings

from django_cradmin.apps.cradmin_imagearchive.models import ArchiveImage


class ArchiveImageAdmin(admin.ModelAdmin):

    search_fields = [
        'id',
        'name',
        'description',
    ]

    readonly_fields = [
        'image_width',
        'image_height',
        'file_extension',
    ]

    def __show_previews(self):
        return crsettings.get_setting('DJANGO_CRADMIN_IMAGEARCHIVE_SHOW_PREVIEWS_IN_DJANGOADMIN', True)

    def get_list_display(self, request):
        list_display = [
            'id',
            'name',
            'description',
            'role',
            'image_width',
            'image_height',
            'get_size',
            'get_url',
        ]
        if self.__show_previews():
            list_display.insert(0, 'get_image_preview')
        return list_display

    def get_list_display_links(self, request, list_display):
        list_display_links = [
            'id',
            'name',
        ]
        if self.__show_previews():
            list_display_links.append('get_image_preview')
        return list_display_links

    def get_queryset(self, request):
        if request.user.is_superuser:
            return super(ArchiveImageAdmin, self).get_queryset(request)
        else:
            return ArchiveImage.objects.none()

    def get_size(self, obj):
        if obj.file_size:
            return defaultfilters.filesizeformat(obj.file_size)
        else:
            return None
    get_size.short_description = 'Size'
    get_size.admin_order_field = 'file_size'

    def get_url(self, obj):
        return '<a href="{url}" target="_blank">{label}</a>'.format(
            label='Show image',
            url=obj.image.url
        )
    get_url.short_description = 'Open'
    get_url.allow_tags = True

    def get_image_preview(self, obj):
        return '<img src="{url}">'.format(
            url=obj.image.url
        )
    get_url.short_description = 'Image preview'
    get_url.allow_tags = True


admin.site.register(ArchiveImage, ArchiveImageAdmin)
