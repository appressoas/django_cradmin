from django.conf import settings
from django.db import models


class Account(models.Model):
    """
    The account which works as the cradmin_role.
    """

    #: The name of the account which create, edit and delete messages
    name = models.CharField(max_length=50, verbose_name='Account name')

    def __str__(self):
        return self.name


class AccountAdministrator(models.Model):
    """
    A user which is an administrator for the :class:`.Account`."
    """

    #: A user with privileges for handling an :class:`.Account`
    user = models.ForeignKey(settings.AUTH_USER_MODEL)

    #: The :class:`.Account` in question to which be administrated
    account = models.ForeignKey(Account)


class Tag(models.Model):
    """
    Tag used to label a message with a certain topic
    """

    #: The tag used on a message for categorization and search
    tag = models.SlugField()

    def __str__(self):
        return self.tag


class Message(models.Model):
    """
    The message is created by logged in user in adminui and can be seen by anyone in the publicui.

    It is possible to search on tags and author which is the user in :class:`.AccountAdministrator`

    Number of likes on a post can be both negative or positive.
    """

    #: The account which created and posted the message
    account = models.ForeignKey(Account)

    #: The heading of a message
    title = models.CharField(max_length=15)

    #: The main text of a message
    body = models.TextField(max_length=255)

    #: A message should be categorized by topic or topics. Helps improve searching and listing
    tags = models.ManyToManyField(Tag)

    #: The time a user posted the message is auto set to the time when the message was added
    creation_time = models.DateTimeField(auto_now_add=True)

    #: How many people has liked the message. Can be a negative integer
    number_of_likes = models.IntegerField()

    def __str__(self):
        return self.title
