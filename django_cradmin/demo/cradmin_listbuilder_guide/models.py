from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy


class Album(models.Model):
    """The class which serves as role for CRadmin. Is a simple illustration of a album with music"""

    #: The title of the album
    title = models.CharField(max_length=100)

    #: The solo artist or band which released the album
    released_by = models.CharField(max_length=100)

    #: The year the album was released
    year = models.PositiveIntegerField()

    def __str__(self):
        return self.title


class Song(models.Model):
    """A song which is on an album"""

    #: The album which contains the song
    album = models.ForeignKey(Album)

    #: The title of the song
    title = models.CharField(max_length=100)

    #: The person which wrote the song. In this guide we assume that only one person writes a song, while in real life
    # there are often several people writing a song
    written_by = models.CharField(max_length=100, default='')

    #: The length of the song as a whole number
    time = models.PositiveIntegerField()

    def __str__(self):
        return self.title

    class Meta(object):
        verbose_name = ugettext_lazy('Song')
        verbose_name_plural = ugettext_lazy('Songs')


class AlbumAdministrator(models.Model):
    """The user which can add songs to an album"""

    #: The user which is an administrator
    user = models.ForeignKey(settings.AUTH_USER_MODEL)

    #: The album which the user administrate
    album = models.ForeignKey(Album)
