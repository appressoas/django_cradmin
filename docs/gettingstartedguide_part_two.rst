.. warning:: This guide is under development, and does not work at this time.

.. _gettingstarted_part_two:

#################
Tutorial part two
#################

Expand Account model with message
=================================

This document contiunes the work done in :ref:`gettingstarted`.

Easy show messages in template
==============================
In this chapter we are going to create a new crapps named `publicui` which will have a listview for messages written by
`Account` with a little code as possbile.

Model
-----
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
    body = models.TextField(max_length=255)

    #: The time a user posted the message is auto set to the time when the message was added
    creation_time = models.DateTimeField(auto_now_add=True)

    #: How many people has liked the message. Can be a negative integer
    number_of_likes = models.IntegerField()

    def __str__(self):
        return self.title

CRadmin Instance
----------------
In the folder `cradmin_instances` we create a new file which will hold the public instances of messages. I have named
the file ``message_publicui_cradmin_instance.py``. To create a CRadmin instance which is public require no role nor any
login. This may be not correct since we also have implemented the CRadmin authentication, so if you try to look at any
page on localhost without being logged in, you will be promted to log in before gaining access to the page. However, we
will create a CRadmin instance which require neither log in nor a role. Beside this the CRadmin instance is just like
the once we have created.

.. literalinclude:: /../django_cradmin/demo/cradmin_gettingstarted/cradmin_instances/message_publicui_cradmin_instance.py


Crapps
------
In the ``crapps`` folder we create a new module names ``publicui``. Inside this module we add the file
``message_list_view.py``. To just make all messages in the system show up in a template, we can use the template
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
                message_list_view.MessageListBuilderView.as_view(),
                name=crapp.INDEXVIEW_NAME)
        ]

Project urls
------------
The last thing we need is to add the CRadmin instance urls to our Django project urls. ::

    url(r'^gettingstarted/messages/', include(message_publicui_cradmin_instance.MessagePublicUiCradminInstance.urls())),

Localhost
---------
If you have added a message or two in Django admin, you will see them at `localhist/gettingstarted/messages`.

Expanding the listview for public messages
==========================================
In the last chapter we rendered a listview using pretty much just built in template and functionality in CRadmin. Now we
are going to expand our view and create our own template with a bit more functionality than what basic CRadmin offers.
However, we are not going to create something totaly new. Everything we are going to use already lives inside CRadmin.

How lists works in CRadmin
--------------------------


Value Render Class
------------------
We are going to create a new class in the ``message_list_view_.py`` file which will render the value of each item in the
list. The render class gets the value for each item in the lists. The view class, displays the list with all its values
in the template. ::

    class MessageItemValue(listbuilder.itemvalue.TitleDescription):
        """Get values for items in the list"""

        valuealias = 'message'

        def get_description(self):
            return self.message.body

The class we use as super, `TitleDescription` is one of several classes which render item values for a list. We want to
get a hold of the body of a message and display it in the template. Now we could use context and a for-loop in our
template which would work out fine in views which just shows one list where each element shall be displayed the
same way. However, if you have multiple lists where some of them again contained new lists, you will end up with a lot
of loops in the template and a not-easy-to-read code. Thus, increasing probalility for bugs and decreasing testability.
In CRadmin the class ``AbstractRenderable`` sets `me` to be `self` in the context data. Further is the item value,
wether being a list of lists or a list of single objects, refered to as `value`. This means in the template we can write
`me.value` to show the message. Further we can use `self.value` in the view class to work with a message. Again, this
would work fine in our example. However, if we have several lists of different objects, it would be hard to keep track
of which object we are currently working with. So solve this problem we set `valuealias` which overrides `value`. So in
the method `get_description` we can return the body of the message with `self.message.body`. To make our view use this
functionality we add `value_renderer_class = MessageItemValue` underneath the model. ::

    class MessageListBuilderView(listbuilderview.View):
        """Builds the list for the view"""
        model = Message
        value_renderer_class = MessageItemValue
        template_name = 'cradmin_gettingstarted/crapps/publicui/message_list.django.html'

Create message list template
----------------------------
In the template folder I have created a new html file which we for us to use.

