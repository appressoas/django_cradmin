from django.contrib import admin

from django_cradmin.demo.cradmin_listbuilder_guide.models import Artist, Album, Song


@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):
    list_display = [
        'name'
    ]


@admin.register(Album)
class AlbumModel(admin.ModelAdmin):
    list_display = [
        'artist',
        'title'
    ]


@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = [
        'title',
        'album',
        'written_by'
    ]

    def written_by(self, written_by):
        return written_by.album.artist

    # possible to sort by artist
    written_by.admin_order_field = 'album__artist'
