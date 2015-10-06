from __future__ import unicode_literals
from django.contrib import admin
from django_cradmin.apps.cradmin_temporaryfileuploadstore.models import TemporaryFileCollection, TemporaryFile


class TemporaryFileInline(admin.StackedInline):
    fields = ['filename', 'file']
    readonly_fields = ['filename', 'file']
    model = TemporaryFile
    extra = 0


class TemporaryFileCollectionAdmin(admin.ModelAdmin):
    inlines = [TemporaryFileInline]
    list_display = (
        'id',
        'user',
        'created_datetime',
        'minutes_to_live',
    )
    readonly_fields = [
        'singlemode',
        'user',
        'accept',
        'created_datetime',
        'unique_filenames',
        'max_filename_length']
    search_fields = [
        'id',
        'user__id',
        'user__email',
    ]
    date_hierarchy = 'created_datetime'

    def get_queryset(self, request):
        if request.user.is_superuser:
            return super(TemporaryFileCollectionAdmin, self).get_queryset(request)
        else:
            return TemporaryFile.objects.none()

admin.site.register(TemporaryFileCollection, TemporaryFileCollectionAdmin)
