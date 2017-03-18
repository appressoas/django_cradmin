from django.contrib import admin

from django_cradmin.demo.cradmin_listbuilder_guide.models import Album, Song, AlbumAdministrator


@admin.register(Album)
class AlbumModel(admin.ModelAdmin):
    list_display = [
        'id',
        'released_by',
        'title',
        'year'
    ]


@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'title',
        'album',
        'written_by',
        'time'
    ]


@admin.register(AlbumAdministrator)
class AlbumAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'user',
        'album'
    ]
