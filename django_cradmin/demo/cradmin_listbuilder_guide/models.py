from django.db import models


class Artist(models.Model):
    """"""

    name = models.CharField('artist name', max_length=255)

    def __str__(self):
        return self.name


class Album(models.Model):
    """"""

    artist = models.ForeignKey(Artist, verbose_name='artist')

    title = models.CharField('album title', max_length=255)

    def __str__(self):
        return self.title


class Song(models.Model):
    """"""

    album = models.ForeignKey(Album, verbose_name='album')

    title = models.CharField('song title', max_length=255)

    def __str__(self):
        return self.title
