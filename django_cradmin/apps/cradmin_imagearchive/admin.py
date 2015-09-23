from __future__ import unicode_literals
from django.contrib import admin
from django.template import defaultfilters

from django_cradmin.apps.cradmin_imagearchive.models import ArchiveImage


class ArchiveImageAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'description',
        'role',
        'image_width',
        'image_height',
        'get_size',
        'get_url',
    )

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

    def get_queryset(self, request):
        if request.user.is_superuser:
            return super(ArchiveImageAdmin, self).get_queryset(request)
        else:
            return ArchiveImage.objects.none()

    def get_size(self, obj):
        return defaultfilters.filesizeformat(obj.image.size)
    get_size.short_description = 'Size'

    def get_url(self, obj):
        return '<a href="{url}" target="_blank">{label}</a>'.format(
            label='Show image',
            url=obj.image.url
        )
    get_url.short_description = 'Open'
    get_url.allow_tags = True



admin.site.register(ArchiveImage, ArchiveImageAdmin)
