from django.conf import settings
from django.db import models


class Artist(models.Model):
    """
    An Artist can be both a solo artist or a band with two or more members.
    """

    #: The stage name for an solo artist or a band
    name = models.CharField(max_length=255)

    #: The user or users which are administrators of the artist
    admins = models.ManyToManyField(settings.AUTH_USER_MODEL)

    def __str__(self):
        return self.name


class Album(models.Model):
    """
    An album contains several :class:`.Song`'s and is released by an :class:`.Artist`.
    """

    #: The artist which released the album
    artist = models.ForeignKey(Artist)

    #: The title of the album
    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title


class Song(models.Model):
    """
    A song is created by an :class:`.Artist` and given out on an :class:`.Album`.
    """

    #: The album which contains the song
    album = models.ForeignKey(Album)

    #: The title of the song
    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title
