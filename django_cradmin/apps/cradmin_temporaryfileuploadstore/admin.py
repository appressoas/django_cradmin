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
        'user',
        'created_datetime']
    search_fields = [
        'id',
        'user__id',
        'user__email',
    ]
    date_hierarchy = 'created_datetime'

admin.site.register(TemporaryFileCollection, TemporaryFileCollectionAdmin)
