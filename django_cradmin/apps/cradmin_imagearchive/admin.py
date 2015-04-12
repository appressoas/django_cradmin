from __future__ import unicode_literals
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

    def get_queryset(self, request):
        if request.user.is_superuser:
            return super(ArchiveImageAdmin, self).get_queryset(request)
        else:
            return ArchiveImage.objects.none()

admin.site.register(ArchiveImage, ArchiveImageAdmin)
