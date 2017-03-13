from django.db import models


class Artist(models.Model):
    """"""

    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Album(models.Model):
    """"""

    artist = models.ForeignKey(Artist)

    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title


class Song(models.Model):
    """"""

    album = models.ForeignKey(Album)

    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title
