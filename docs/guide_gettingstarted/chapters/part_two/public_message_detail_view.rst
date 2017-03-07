Public Message Detail View
==========================
Now it is time to create a detail view which is shown when a user clicks any message in our listview of messages. Inside
the detailview one should be able to see the whole message and number of likes. To make the detail view work we need
to update the class ``MessageItemFrameLink``, add an url to the detail view in the ``__init__.py`` file, create a new
detail view and decide which template to use.

Item Frame Link
---------------
As you remember we have already created an item frame link around each message in our list view. We now need to tell
that this link should point to the detail view. We can use a ``valuealias`` to set the pk in kwargs in our url. Further
we set the CRadmin instance id, application name and view name. Our ``MessageItemFrameLink`` class now looks something
like this ::

    class MessageItemFrameLink(listbuilder.itemframe.Link):
        """Make each frame around the list itmes a link"""
        valuealias = 'message'

        def get_url(self):
            return reverse_cradmin_url(
                instanceid='cr_public_message',
                appname='public_message',
                viewname='detail',
                kwargs={
                    'pk': self.message.id
                }
            )

Url in Init File
----------------
In the ``__init__.pt`` file within our CRadmin application ``publicui`` we add the url with an pk and set the viewname
equal to what we used for the ``get_url`` method. ::

    class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            message_list_view.MessageListBuilderView.as_view(),
            name=crapp.INDEXVIEW_NAME),
        crapp.Url(
            r'^detail/(?P<pk>\d+)$',
            message_detail_view.MessageDetailView.as_view(),
            name='detail')
    ]

Message Detail View
-------------------
Next we create a file named ``message_detail_view`` in our CRadmin application ``publicui``. Here we create a a class
which inherit from CRadmins ``DetailView``. There is also an ``DetailRoleView`` class you can use as super if there is
a role in question, for instance if we create a detail view for messages in our ``account_admin`` crapps. Nevertheless,
we use the ``DetailView`` as a super. We override the method ``get_queryset_for_role``, which may seems a tad backwards
sicne there is no role for this CRadmin instance. If you check the super classes to the ``DetailView`` which we inherit
from, you will find that it is recommended that we override ``get_queryset_for_role``. So that is what we do. To get a
hold of the message, we just ask for the object, which gives us something to work with in the template.
::

    from django_cradmin import viewhelpers
    from django_cradmin.demo.cradmin_gettingstarted.models import Message


    class MessageDetailView(viewhelpers.detail.DetailView):
        """"""
        template_name = 'cradmin_gettingstarted/crapps/publicui/message_detail_view.django.html'

        def get_queryset_for_role(self):
            """"""
            return Message.objects.all()

        def get_context_data(self, **kwargs):
            context = super(MessageDetailView, self).get_context_data(**kwargs)
            context['message'] = self.get_object()
            return context

Message Detail Template
-----------------------
In our template folder we create a html file named ``message_detail_view.django.html`` which extends
``django_cradmin/base.django.html``. In the template we add blocks for title, page cover title and content. Inside the
content block we add which details we want to show for a message. There is not much more info here than in the list
view, than again the user now can see the whole message and number of likes beside the timestamp and account name which
wrote the message. Further we add some CRadmin test css classes for our tests. The detail view template looks like this.
::

    {% extends 'django_cradmin/base.django.html' %}
    {% load cradmin_tags %}

    {% block title  %}
        Message details
    {% endblock title %}

    {% block page-cover-title %}
        Message Details
    {% endblock page-cover-title %}

    {% block content %}
        <section class="adminui-page-section">
            <div class="container container--tight">
                <h2>{{ message }}</h2>
                <p>{{ message.body }}</p>
                <p class="paragraph paragraph--xtight {% cradmin_test_css_class 'public-detail-posted-by' %}">
                    Posted by: {{ message.account }}
                </p>
                <p class="paragraph paragraph--xtight"> Time: {{ message.creation_time }}</p>
                <p class="{% cradmin_test_css_class 'public-detail-likes' %}">
                    Likes: {{ message.number_of_likes }}
                </p>
            </div>
        </section>
    {% endblock content %}

In the p-tags which shows the message owner, time of creation and number of likes we use the classes ``paragraph`` and
``paragraph--xtight`` to decrease white space between the the paragraphs coming after the message's body. Now this CSS
class decreases the white space below the paragraph, so there is no need to add the CSS class in the last p-tag.

Test Message Detail View
------------------------
We test that the detail view shows the message information as intended, and that our item frame link has the
correct href. This means we need to rewrite the item link test method in the file ``test_message_list_view.py`` file
and create a new file within the same folder and name it ``test_message_detail_view.py``.

Lest start with rewriting the test for item frame link. In this test we fetch the href after a get request and compare
the result to what we should get looking at our new constructed url. From the project urls we should get
``/gettingstarted``. From the CRadmin application we're working with, we should get ``/messages``. From our view we
should get the view name and id of the message ``/detail/<id_as_integer>``. When we use a real url, we may ran into
trouble down the line when there is changes in our project. So solve this problem we could use MagicMock to mock both
the CRadmin application and to add something to the expected url. However, we are not going to introduce MagicMock in
this tutorial. So we will stick to our real url.

After rewriting both method name and content, the test now looks like this.
::

    def test_listbuilder_link_href_sanity(self):
        """Test for template ``message_listbuilder_view.django.html"""
        message = mommy.make('cradmin_gettingstarted.Message')
        mockresponse = self.mock_http200_getrequest_htmls(
            viewkwargs={'pk': message.id}
        )
        listbuilder_link = mockresponse.selector.one('.test-cradmin-listbuilder-link')
        self.assertTrue(listbuilder_link)
        href_in_template = mockresponse.selector.one('.test-cradmin-listbuilder-item-frame-renderer')['href']
        expected_href = '/gettingstarted/messages/detail/{}'.format(message.id)
        self.assertEqual(expected_href, href_in_template)

In our new test file ``test_message_deatil_view.py`` which is inside the test module ``test_publicui``, we create a new
test class and add the methods of what we want to test. As usually you may want to test something different than what
we test in this guide. The point is to write some code and test it. When we test the more simple parts of our code,
there is easier to get the more complicated parts to run without errors. We know the structure behind works up to some
point.

This time we test the primary title in the template, who posted the message and if the number of likes can both be a
positive number and a negative number.
::

    from django.test import TestCase
    from model_mommy import mommy

    from django_cradmin import cradmin_testhelpers


    class TestMessageDetailView(TestCase, cradmin_testhelpers.TestCaseMixin):
        viewclass = MessageDetailView

        def test_primary_h1(self):
            message = mommy.make('cradmin_gettingstarted.Message')
            mockresponse = self.mock_http200_getrequest_htmls(
                viewkwargs={'pk': message.pk}
            )
            self.assertTrue(mockresponse.selector.one('.test-primary-h1'))
            h1_in_template = mockresponse.selector.one('.test-primary-h1').text_normalized
            self.assertEqual('Message Details', h1_in_template)

        def test_posted_by_sanity(self):
            account = mommy.make('cradmin_gettingstarted.Account', name='My Account')
            message = mommy.make('cradmin_gettingstarted.Message', account=account)
            mockresponse = self.mock_http200_getrequest_htmls(
                viewkwargs={'pk': message.id}
            )
            self.assertTrue(mockresponse.selector.one('.test-public-detail-posted-by'))
            posted_by = mockresponse.selector.one('.test-public-detail-posted-by').text_normalized
            self.assertEqual('Posted by: {}'.format(message.account), posted_by)

        def test_number_of_likes_positive_sanity(self):
            """A positive number should be shown in template"""
            account = mommy.make('cradmin_gettingstarted.Account', name='My Account')
            message = mommy.make(
                'cradmin_gettingstarted.Message',
                account=account,
                number_of_likes=100
            )
            mockresponse = self.mock_http200_getrequest_htmls(
                viewkwargs={'pk': message.id}
            )
            self.assertTrue(mockresponse.selector.one('.test-public-detail-likes'))
            likes = mockresponse.selector.one('.test-public-detail-likes').text_normalized
            self.assertEqual('Likes: {}'.format(message.number_of_likes), likes)

        def test_number_of_likes_negative_sanity(self):
            """A neagative number should be shown in template"""
            account = mommy.make('cradmin_gettingstarted.Account', name='My Account')
            message = mommy.make(
                'cradmin_gettingstarted.Message',
                account=account,
                number_of_likes=-10000
            )
            mockresponse = self.mock_http200_getrequest_htmls(
                viewkwargs={'pk': message.id}
            )
            self.assertTrue(mockresponse.selector.one('.test-public-detail-likes'))
            likes = mockresponse.selector.one('.test-public-detail-likes').text_normalized
            self.assertEqual('Likes: {}'.format(message.number_of_likes), likes)