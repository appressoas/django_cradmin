from django.contrib import admin
from django_cradmin.apps.cradmin_imagearchive.models import ArchiveImage


class ArchiveImageAdmin(admin.ModelAdmin):
    list_display = (
        'role',
        'name',
        'description',
    )

admin.site.register(ArchiveImage, ArchiveImageAdmin)
