.. _expanding_listview_for_public_messages:

Expanding Listview for Public Messages
======================================
In the last chapter we rendered a listview using pretty much just built in templates and functionality in CRadmin. Now
we are going to expand our view and create our own template with a bit more functionality than what basic CRadmin
offers. However, we are not going to create something totaly new. Almost everything we're going to use already lives
inside CRadmin.

Item Value Listbuilder
----------------------
We are going to a listbuilder class in the ``message_list_view_.py`` file and add functionality to our existing view
class. The listbuilder class ``MessageItemValue`` builds what we are going to see in our view and gives each item in the
list some values, while the class ``MessageListBuilderView`` is the view for showing what we have build. Since we need
to do some customization, we need to create a template for both classes.

We start the work by writing the listbuilder item value class. ::

    class MessageItemValue(listbuilder.itemvalue.TitleDescription):
        """Get values for items in the list"""

        valuealias = 'message'
        template_name = 'cradmin_gettingstarted/crapps/publicui/message_listbuilder.django.html'

        def get_description(self):
            return self.message.body

We want to get a hold of the message body and display it in the template. We use the super ``TitleDescription`` which is
one of several classes which render item values for a list. When overriding the method ``get_description`` we can return
the body of a message. As you can see we use the valuealias to get a hold of the message. In CRadmin the class
``AbstractRenderable`` sets `me` to be `self` in the context data. Therefore is the item value, wether being a list of
lists or a list of single objects, refered to as ``value``. This means we can write ``me.value`` in the template to show
the message. Further we can use `self.value` in the view class to work with a message. In our example where we just work
with one list object, it may not be nesseccary to use an alias for value. However, if we have several lists of
different objects, it would be hard to keep track of which object we are currently working with. So solve this problem
we set ``valuealias`` which overrides ``value``.

Item Value Template
-------------------
In the template we don't want the whole textfield of the message to show. If we use truncatechars in the
``block description-content`` without calling super, we can put new content in the existing p-tag. To get a hold of the
message body we just call ``me.get_description`` and add the length where we want to truncate the textfield. Now we
have overridden the content given by CRadmin as a default for the ``block description-content``, but we still use the
default CRadmin html-tags within the block.

When displaying the list of messages in the template we want to show the account which posted the message and the
timestamp. This can be done with the ``block below-description``. If you look in the html file which we extends, you´ll
see that the block is empty by default, so we have to create the needed html-tags. In this example we put everything
inside a p-tag and add a span-tag for a CRadmin test css class used for testing the account name. An alternative is to
remove the span-tag and add a CRadmin test css class in the p-tag and test both account name and timestamp. ::

    {% extends 'django_cradmin/viewhelpers/listbuilder/itemvalue/titledescription.django.html' %}
    {% load cradmin_tags %}

    {% block description-content %}
        {{ me.get_description|truncatechars:"100" }}
    {% endblock description-content %}

    {% block below-description %}
        <p>
            Posted by: <span class="{% cradmin_test_css_class 'listbuilder-posted-by-account' %}">
            {{ me.message.account }}</span>
            at {{ me.message.creation_time }}
        </p>
    {% endblock below-description %}

Listbuilder View
----------------
The next step is to tell our listbuilder view to use our newly create value render class and to decide which template
we want for our view. ::

    class MessageListBuilderView(listbuilderview.View):
        """Builds the list for the view"""
        model = Message
        value_renderer_class = MessageItemValue
        template_name = 'cradmin_gettingstarted/crapps/publicui/message_list.django.html'

Listbuilder View Template
-------------------------
In this template we extend the defualt listbuilderview template in CRadmin and add some new content in the title and
page-cover-title block. Further we can hide the default content in the ``block messages`` by adding the block without
calling the super. The ``block message`` has nothing to do with the message objects we are working with. It is where
messages such as `Created new account` or `Deleted account` is shown. We will use this block to display a message to the
user if there are no messages in the system.

In the ``block content`` we use standard CSS classes which you find at `localhost/styleguide` on the html- tags. As you
can see we use some if logic where we check if ``listbuilder_list`` is empty or not. This variable name is provided by
CRadmin and is where all objects we render for our listview is stored by default. In our case the list is populated by
instances of the message object, if there are any in the database.

If there are messages we want to show them in a blocklist. Inside the blocklist we use the CRadmin tag
``cradmin_render_renderable`` and tell it to render the ``listbuilder_list``. In our view we will now get a blocklist
element for each message which shows both the body of the message and the content we chose to add below the description.
When there are no messages in our system we display an information message in the ``block message``. Here we also add
a CRadmin test css class so we can check that the if-test in our template works as intended.

in the system by creating a div with the class ``blocklist``. Within this
div-tag we use a CRadmin tag called ``cradmin_render_renderable`` and tell it to render ``listbuilder_list``. CRadmin
will now render the template we created for our listbuilder view with the item values we have decided. ::

    {% extends 'django cradmin/viewhelpers/listbuilderview/default.django.html' %}
    {% load cradmin_tags %}

    {% block title %}
        Gettingstarted
    {% endblock title  %}

    {% block page-cover-title %}
        Messages
    {% endblock page-cover-title %}

    {% block messages %}{% endblock messages %}

    {% block content %}
        <section class="adminui-page-section">
            <div class="container container--wide">
                {% if listbuilder_list %}
                    <div class="blocklist">
                        {% cradmin_render_renderable listbuilder_list %}
                    </div>
                {% else %}
                    <p class="text-center message message--info {% cradmin_test_css_class 'no-messages' %}">
                        No messages in system
                    </p>
                {% endif %}
            </div>
        </section>
    {% endblock content %}

Test Public Listview
--------------------
Now that we have created more functionality it is time to do some tests. As always there are several scenarios to test,
and we have to choose what to test. The point is to write a little code and than test it, or write the test first
and than the code. Either way, testing during development is important and should be done continuous for each bit of
code which does something. As you may have noticed we have not written any integration tests seeing if CRadmin is
working as intended with Django. This kind of testing is allready done in CRadmin, leaving unittesting to us.

So let's chose five things to test for our list view. First see if it displayes just one message and that the
description title is equal to the message's title. Second test involves several messages and checks that the body of a
each message is shown in the template. The third test is to check if the ``block message`` get our content when there
are no messages in the system. The fourth test for this section is for what we did in the template
``message_listbuilder.django.html`` and just checks if the account name which wrote the message is shown in template.
The fith and final test find the length of the message body in the template and checks if it is equal to what we said
in the template's ``block description-content``.

Since we use two templates in one test class, we add some comments making it easier to remember what we did when we
look at the code in the future and make it easier for other to understand what we have done.

So far we have used the hmtls selector ``one``. When displaying several messages in a template we need to use the htmls
selector ``list`` and count the number of times a CSS class occour, which should be equal to the number of messages
mommy makes. The tests is added in the file ``test_messages_list_view.py`` inside a new ``test_publicui`` module. ::

    from django.test import TestCase
    from model_mommy import mommy

    from django_cradmin import cradmin_testhelpers


    class TestMessageListView(TestCase, cradmin_testhelpers.TestCaseMixin):
        """
        This test class uses two templates, which together gives the public UI for a list of messages in the system.
        We have created both a template for the listbuilder item values and one for the listbuilder view.
        """
        viewclass = message_list_view.MessageListBuilderView

        def get_message_title_when_one_message(self):
            """Test for template ``message_listbuilder_view.django.html"""
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
            """Test for template ``message_listbuilder_view.django.html"""
            mommy.make('cradmin_gettingstarted.Message', _quantity=5)
            mockresponse = self.mock_http200_getrequest_htmls()
            self.assertTrue(mockresponse.selector.list('.test-cradmin-listbuilder-title-description__description'))
            messages_in_template = mockresponse.selector.list('.test-cradmin-listbuilder-title-description__description')
            self.assertEqual(5, len(messages_in_template))

        def test_no_message_in_system_information(self):
            """Test for template ``message_listbuilder_view.django.html"""
            mockresponse = self.mock_http200_getrequest_htmls()
            self.assertTrue(mockresponse.selector.one('.test-no-messages'))
            template_message = mockresponse.selector.one('.test-no-messages').text_normalized
            self.assertEqual('No messages in system', template_message)

        def test_account_name_displayed_in_message_description(self):
            """
            This test checks the ``block below-description`` in the template ``message_listbuilder.django.html``.
            """
            account = mommy.make(
                'cradmin_gettingstarted.Account',
                name='My Account'
            )
            mommy.make(
                'cradmin_gettingstarted.Message',
                account=account
            )
            mockresponse = self.mock_http200_getrequest_htmls()
            self.assertTrue(mockresponse.selector.one('.test-listbuilder-posted-by-account'))
            name_in_template = mockresponse.selector.one('.test-listbuilder-posted-by-account').text_normalized
            self.assertEqual(account.name, name_in_template)

        def test_message_content_truncatechars(self):
            """
            In this test we checks the ``block description-content`` which is written in the template
            ``message_listbuilder.django.html``.
            """
            message_content = 'IM' * 255
            mommy.make(
                'cradmin_gettingstarted.Message',
                body=message_content
            )
            mockresponse = self.mock_http200_getrequest_htmls()
            self.assertTrue(mockresponse.selector.one('.test-cradmin-listbuilder-title-description__description'))
            template_message_body = mockresponse.selector.one(
                '.test-cradmin-listbuilder-title-description__description').text_normalized
            self.assertEqual(100, len(template_message_body))

As you probarly remember you can use ``mockresponse.selector.prettyprint()`` to print the template in your terminal and
find which tests css classes used in CRadmin if you have a mock request with htmls.

Make List Item a Link
---------------------
The plan is to later on make a detail view in the public UI so one can get more information about each message.
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

Test Item Frame and Link
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

Do you remember to take a break from the screen and stretch your body?

Next Chapter
------------
TODO