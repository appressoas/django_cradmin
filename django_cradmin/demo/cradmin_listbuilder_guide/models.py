from django.conf import settings
from django.db import models


class Album(models.Model):
    """"""

    #: The title of the album
    title = models.CharField(max_length=100)

    #: The solo artist or band which released the album
    released_by = models.CharField(max_length=100)

    #: The year the album was released
    year = models.PositiveIntegerField()

    def __str__(self):
        return self.title


class Song(models.Model):
    """"""

    #: The album which contains the song
    album = models.ForeignKey(Album)

    #: The title of the song
    title = models.CharField(max_length=100)

    #: The person which wrote the song. In this guide we assume that only one person writes a song, while in real life
    # there are often several people writing a song
    written_by = models.CharField(max_length=100, default='')

    #: The length of the song
    time = models.PositiveIntegerField()

    def __str__(self):
        return self.title


class AlbumAdministrator(models.Model):
    """"""

    #: The user which is an administrator
    user = models.ForeignKey(settings.AUTH_USER_MODEL)

    #: The album which the user administrate
    album = models.ForeignKey(Album)
