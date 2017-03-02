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


Item Value Listbuilder
----------------------
We are going to expand our ``message_list_view_.py`` with a listbuilder class and add functionality to our view class.
The listbuilder class `MessageItemValue` builds what we are going to see in our view and gives each item in the list
some values, while the class `MessageListBuilderView` is the view for showing what we have build. Since we need to do
some customization, we need to create a template for both classes in the ``message_list_view.py`` file.

Our `MessageItemValue` class looks like this. ::

    class MessageItemValue(listbuilder.itemvalue.TitleDescription):
        """Get values for items in the list"""

        valuealias = 'message'
        template_name = 'cradmin_gettingstarted/crapps/publicui/message_listbuilder.django.html'

        def get_description(self):
            return self.message.body

The class we use as super, `TitleDescription` is one of several classes which render item values for a list. We want to
get a hold of the body of a message and display it in the template. Now we could use context and a for-loop in our
template which would work out fine in views which just shows one list where each element shall be displayed the
same way. However, if you have multiple lists where some of them again containes new lists, you will end up with a lot
of loops in the template and a not-easy-to-read code. Thus, increasing probalility for bugs and decreasing testability.
In CRadmin the class ``AbstractRenderable`` sets `me` to be `self` in the context data. Therefor is the item value,
wether being a list of lists or a list of single objects, refered to as `value`. This means in the template we can write
`me.value` to show the message. Further we can use `self.value` in the view class to work with a message. Again, this
would work fine in our example. However, if we have several lists of different objects, it would be hard to keep track
of which object we are currently working with. So solve this problem we set `valuealias` which overrides `value`. So in
the method `get_description` we can return the body of the message with `self.message.body`.

Listbuilder template
--------------------
When displaying the list of messages in the template we want to show the account which posted the message and the
timestamp. We do this by overriding the block ``description-content``. Here we must call super to get a hold of the code
written in the template which we extends. When we call the super block the template will show the message body which we
returned in the ``get_description`` method. Further we add a p-tag to show the account name and timestamp. As you can
see we use the `valuealias` to get a hold of the instance of the message object.

.. literalinclude:: /../django_cradmin/demo/cradmin_gettingstarted/templates/cradmin_gettingstarted/crapps/publicui/message_listbuilder.django.html

Listbuilder View
----------------
We expaned our existing view by telling which value render class we want to use, which is our listbuilder class where we
sat the item value. Further we set the template name. ::

    class MessageListBuilderView(listbuilderview.View):
        """Builds the list for the view"""
        model = Message
        value_renderer_class = MessageItemValue
        template_name = 'cradmin_gettingstarted/crapps/publicui/message_list.django.html'

Listbuilder View Template
-------------------------
In this template we extend the defualt listbuilderview template in CRadmin and add some new content in the title and
page-cover-title block. Further I don't want the content in the ``block messages`` to be seen. This has nothing to do
with the message object we are working with. It is where messages such as `Created new account` or `Deleted account` is
shown.

In the ``block content`` I have styled a section and a div with some standard CSS classes which you find at
`localhost/styleguide`. Further we need to add a div with the class `blocklist`. Within this div-tag we use a CRadmin
tag called ``cradmin_render_renderable`` and tell it to render ``listbuilder_list``. CRadmin will render the template
we created for our listbuilder with the item values we have decided.

.. literalinclude:: /../django_cradmin/demo/cradmin_gettingstarted/templates/cradmin_gettingstarted/crapps/publicui/message_listbuilder_view.django.html

Test public listview
--------------------
Now that we have created one functionality it is time to do some tests. As always there are several scenarios to test,
and we have to choose what to test first. The point is to write a little code and than test it, or write the test first
and than the code. Either way, testing during development is important and should be done continuerly for each bit of
code which does something. As you may have noticed we have not written any integration tests seeing if CRadmin is
working as intended with Django. This kind of testing is allready done in CRadmin, leaving unittesting to us.

So I have chosen to test two things for our list view. First see if it displayes just one message and that the
description title is equal to the message's title. Second tests involves several messages and checks that the we wrote
in the class ``MessageItemValue`` and in the template ``message_listbuilder.django.html`` does what we want it to do.
So far we have used the hmtls selector `one`. When displaying several messages in a template we need to use the htmls
selector `list` and count the number of times a CSS class occur, which should be equal to the number of messages mommy
makes. The tests is added in the file ``test_messages_list_view.py`` inside a new ``test_publicui`` module. ::

    from django.test import TestCase
    from model_mommy import mommy

    from django_cradmin import cradmin_testhelpers


    class TestMessageListView(TestCase, cradmin_testhelpers.TestCaseMixin):
        viewclass = message_list_view.MessageListBuilderView

        def get_message_title_when_one_message(self):
            message = mommy.make(
                'cradmin_gettingstarted.Message',
                title='A message',
                body='Here is the body',
            )
            mockresponse = self.mock_http200_getrequest_htmls()
            self.assertTrue(mockresponse.selector.one('.test-cradmin-listbuilder-title-description__title'))
            title = mockresponse.selector.one('.test-cradmin-listbuilder-title-description__title').text_normalized
            self.assertEqual(message.title, title)

        def test_number_of_messages_in_html(self):
            mommy.make('cradmin_gettingstarted.Message', _quantity=5)
            mockresponse = self.mock_http200_getrequest_htmls()
            self.assertTrue(mockresponse.selector.list('.test-cradmin-listbuilder-title-description__description'))
            messages_in_template = mockresponse.selector.list('.test-cradmin-listbuilder-title-description__description')
            self.assertEqual(5, len(messages_in_template))

As you probarly remember you can use `mockresponse.selector.prettyprint()` to print the tempate in your terminal and
find which tests css classes used in CRadmin if you have a mock request with htmls.

Make list item a link
---------------------
The plan is to later on making a detail view in the public UI so one can get more information about each message.
Therefore we need to make each list element a link. For the time being the link will just take us to the list view. To
make this happen we will use the Link class in ``listbuilder.itemframe` and use the methode ``get_url``. This method
will return ``cradmin_reverse_url`` where we set the id of the CRadmin instance and the app name. In our case the id is
`cr_public_message` and the appname is `public_message`, as written in the CRadmin instance file for the public UI. ::

    class MessageItemFrameLink(listbuilder.itemframe.Link):
        """Make each frame around the list itmes a link"""

        def get_url(self):
            return reverse_cradmin_url(instanceid='cr_public_message', appname='public_message')

In our listbuilder view we set the ``frame_renderer_class`` to be our newly created Link class. ::

    class MessageListBuilderView(listbuilderview.View):
        """Builds the list for the view"""

        model = Message
        value_renderer_class = MessageItemValue
        frame_renderer_class = MessageItemFrameLink

Test item frame and link
------------------------
Since we will change the link url later on, all we tests for now is if it renders. Lets write the test in our
``test_message_list_view.py`` file. ::

        def test_item_frame_and_link_from_listbuilder(self):
            mommy.make('cradmin_gettingstarted.Message')
            mockresponse = self.mock_http200_getrequest_htmls()
            render_item_frame = mockresponse.selector.one('.test-cradmin-listbuilder-item-frame-renderer')
            listbuilder_link = mockresponse.selector.one('.test-cradmin-listbuilder-link')
            self.assertTrue(render_item_frame)
            self.assertTrue(listbuilder_link)

