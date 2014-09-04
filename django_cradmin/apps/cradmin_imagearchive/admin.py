from django.contrib import admin

from django_cradmin.apps.cradmin_imagearchive.models import ArchiveImage


class ArchiveImageAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'description',
        'role',
    )
    readonly_fields = [
        'image_width',
        'image_height',
        'file_extension',
    ]

admin.site.register(ArchiveImage, ArchiveImageAdmin)
