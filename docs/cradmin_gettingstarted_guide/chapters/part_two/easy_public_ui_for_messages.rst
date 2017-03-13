.. warning:: This guide is under development, and does not work at this time.

.. _gettingstarted_part_two:

Easy Public UI for Messages
===========================

This document contiunes the work done in tutorial part one :ref:`gettingstarted_part_one`.

In this chapter we are going to create a new crapps named `publicui` which will have a listview for messages written by
an account with a little code as possbile.

Message Model
-------------
 First we create a new model named `Message`. ::

    class Message(models.Model):
    """
    The message is created by logged in user in adminui and can be seen by anyone in the publicui.

    Number of likes on a post can be both negative or positive.
    """

    #: The account which created and posted the message
    account = models.ForeignKey(Account)

    #: The heading of a message
    title = models.CharField(max_length=15)

    #: The main text of a message
    body = models.TextField()

    #: The time a user posted the message is auto set to the time when the message was added
    creation_time = models.DateTimeField(auto_now_add=True)

    #: How many people has liked the message. Can be a negative integer
    number_of_likes = models.IntegerField(default=0)

    def __str__(self):
        return self.title

CRadmin Instance for Message
----------------------------
In the folder ``cradmin_instances`` we create a new file which will hold the public instances of messages. I have named
the file ``message_publicui_cradmin_instance.py``. To create a CRadmin instance which is public require no role nor any
login. This may not be correct since we also have implemented the CRadmin authentication, so if you try to look at any
page on localhost without being logged in, you will be promted to log in before gaining access to the page. However, we
will create a CRadmin instance which require neither log in nor a role. Beside this the CRadmin instance is just like
the once we have created.

.. literalinclude:: /../django_cradmin/demo/cradmin_gettingstarted/cradmin_instances/message_publicui_cradmin_instance.py


CRadmin Application for Message
-------------------------------
In the ``crapps`` folder we create a new module named ``publicui``. Inside this module we add the file
``public_message_list_view.py``. To just make all messages in the system show up in a template, we can use the templates
provided by CRadmin. Here we need to implement the method `get_queryset_for_role`, and since this is a view inside the
public UI we can return all messages. ::

    class MessageListBuilderView(listbuilderview.View):
        """Builds the list for the view"""
        model = Message

        def get_queryset_for_role(self):
            return Message.objects.all()

In our ``__init__.py`` file for the publicui crapps, we add the url as we did earlier. ::

    from django_cradmin import crapp


    class App(crapp.App):
        appurls = [
            crapp.Url(
                r'^$',
                public_message_list_view.MessageListBuilderView.as_view(),
                name=crapp.INDEXVIEW_NAME)
        ]

Project urls
------------
The last thing we need is to add the CRadmin instance urls to our Django project urls. ::

    url(r'^gettingstarted/messages/', include(message_publicui_cradmin_instance.MessagePublicUiCradminInstance.urls())),

Localhost
---------
If you have added a message or two in Django admin, you will see them at `localhist/gettingstarted/messages`.

Next Chapter
------------
TODO