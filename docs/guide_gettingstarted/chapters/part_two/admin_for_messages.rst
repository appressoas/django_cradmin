.. _admin_for_messages:

Admin for Messages
==================
In this chapter we want to add functionality which let us create new messages and edit or delete existing ones. We are
going to use the existing CRadmin instance ``AccountAdminCradminInstance`` to hold our new CRadmin application.

When we have a model like message where we need to create new ones and edit or delete existing ones, CRadmin comes with
an easy to use template for creating a list of all the object instances with clickable buttons. Basicly we can just
use use a modelform, set the item value, build the list and create three views which with super classes to make it all
work. However we need to override one block in the template to get the whole body of a message as an item value. To do
this we override the method ``get_description`` in the item value class. Further we will create our own template so
we can add some context below the description. This work is somewhat similar to what we did when we created our public
UI. If we build a message application for other purposes than a getting started guide the structure of crapps and
CRadmin instances would probarly look somewhat different. For instance could the we build one crapps for messages, and
use the views for both admin UI and public UI. We could alos use just one template with an if test and display based
on the role of the user or if the user is logged in or not. When we chose to rather rewrite some code and have the
project structure we have, it is to create an guide where you can easily find different functionality in CRadmin without
digging for far to long. Okay, back to the an Admin for messages.

We start with creating a CRadmin instance.

CRadmin Instance for Admin Messages
-----------------------------------
We add an application to the list of apps in the ``AccountAdminCradminInstance`` and call it ``messages``. ::

        apps = [
            ('account_admin', account_adminui.App),
            ('new_account', create_account.App),
            ('public_messages', publicui.App),
            ('messages', messages.App)
        ]

Crapps for Admin Messages
-------------------------
Next we add a new module named ``messages`` within our crapps module. Inside here we need three files, one for the
edite, delete and create views, one for the list view and one mixins file.

We begin with the mixins file, which is named ``mixins.py``. Inside here we will create one mixin class which gives us
the form fields and one mixin class which has a method to get the queryset for role needed by the edit and create view.
Here we return all message objects created by an account and order them so the newest is at the top.
::

    from django_cradmin import uicontainer


    class MessageCreateUpdateMixin(object):
        """
        Mixin class for create and edit view for messages in account admin UI
        """
        model = Message
        roleid_field = 'account'
        fields = [
            'title',
            'body'
        ]

        def get_form_renderable(self):
            return uicontainer.layout.AdminuiPageSectionTight(
                children=[
                    uicontainer.form.Form(
                        form=self.get_form(),
                        children=[
                            uicontainer.fieldwrapper.FieldWrapper('title'),
                            uicontainer.fieldwrapper.FieldWrapper('body'),
                            uicontainer.button.SubmitPrimary(
                                text='Save')
                        ]
                    )
                ]
            ).bootstrap()


    class MessagesQuerysetForRoleMixin(object):
        def get_queryset_for_role(self):
            return Message.objects.filter(account=self.request.cradmin_role).order_by('-creation_time')

Next we create the file for our message list view and name it ``message_list_view.py``. Just as we did when we created
the list of messages for the public UI we create an item value class and a listbuilder view class. The item value
class inherit from the ``listbuilder.itemvalue.EditDelete`` which uses a template that provides us the buttons we
need for edit and delete an existing message. If you read the code for this class you will see there is some rules for
what we name our views later on. We set the name of the template we want to use to get the message's creation time
shown in the template. Further we want the whole message body to be the description.

In the list builder view class we use our newly created query set for role mixin and two listbuilder views as super.
The first listbuilder view adds a create button in the template. The second is the View class we need to build a list
view. Finally we tell which model to use and the name of the value render class.

::

    from django_cradmin.viewhelpers import listbuilder
    from django_cradmin.viewhelpers import listbuilderview


    class MessageItemValue(listbuilder.itemvalue.EditDelete):
        template_name = 'cradmin_gettingstarted/crapps/messages/messageslist_itemvalue.django.html'
        valuealias = 'message'

        def get_description(self):
            return self.message.body


    class MessageListBuilderView(mixins.MessagesQuerysetForRoleMixin,
                                 listbuilderview.ViewCreateButtonMixin,
                                 listbuilderview.View):
        model = Message
        value_renderer_class = MessageItemValue

The last file we need to create for the CRadmin application ``messages`` is named ``message_edit_views`` and holds the
view for create, edit and delete. This is probarly the easiest views every written. We just need to use the correct
super classes. As you see in the code snippet below we use our mixin classes and CRadmin formviews. ::

    from django_cradmin.viewhelpers import formview


    class CreateMessageView(mixins.MessageCreateUpdateMixin, formview.WithinRoleCreateView):
        """"""


    class MessageEditView(mixins.MessagesQuerysetForRoleMixin,
                          mixins.MessageCreateUpdateMixin,
                          formview.WithinRoleUpdateView):
        """"""


    class MessageDeleteView(mixins.MessagesQuerysetForRoleMixin, formview.WithinRoleDeleteView):
        """"""

Urls for Admin Messages
-----------------------
Next we need to set the urls for our CRadmin application. So in the ``__init__.py`` file within our messages crapps, we
add our appurls like we did for the other crapps. Now to make our template work as intended it is important to give our
views names which our template expects to recive. Meaning a create view is named create, an edit view is named edit and
a delete view is named delete.
::

    from django_cradmin import crapp


    class App(crapp.App):
        appurls = [
            crapp.Url(
                r'^$',
                message_list_view.MessageListBuilderView.as_view(),
                name=crapp.INDEXVIEW_NAME
            ),
            crapp.Url(
                r'^create$',
                message_edit_views.CreateMessageView.as_view(),
                name='create'
                ),
            crapp.Url(
                r'^edit/(?P<pk>\d+)$',
                message_edit_views.MessageEditView.as_view(),
                name='edit'
            ),
            crapp.Url(
                r'^delete/(?P<pk>\d+)$',
                message_edit_views.MessageDeleteView.as_view(),
                name='delete'
            )
        ]

Template for Admin Messages
---------------------------
Our template extends the ``edit-delete,django.html`` CRadmin template, and all we want is to fill the block below the
description with the timestamp for creation of the message.
::

    {% extends "django_cradmin/viewhelpers/listbuilder/itemvalue/edit-delete.django.html" %}
    {% load cradmin_tags %}

    {% block below-description %}
        Posted: {{ me.message.creation_time }}
    {% endblock below-description %}

Tests for Admin Messages
------------------------
We want to test if form and list renders as we want, if a new message is saved in the database and connected to the
correct account, if an edited message is updated in the database and if we delete the correct message. Besides this
we're going to write some tests to check that a warning message is shown in template if we try to create or edit a
message without all the required fields.

Eventhough we have all our views in two files within the ``messages`` crapps, we're going to use four test files. This
makes our code easy to read and easier to find future bugs.

First we create a new test module named ``test_messages`` within our ``test_crapps`` module. In the ``test_messages``
we create the following four files: ``test_message_create_view``, ``test_message_delete_view``,
``test_message_edit_view`` and ``test_message_list_view``.

Test Message List View
""""""""""""""""""""""
The order which we tests these views really don't matter, so let's just start with the list view. In the file
``test_message_list_view`` we first add an Account in the method setUp, since we need a CRadmin role for all our tests.
Further we write three get tests, one for the rendering the page, one for rendering the list and finally one for
rendering the item value for a list element.
::

    from django.test import TestCase
    from model_mommy import mommy

    from django_cradmin import cradmin_testhelpers


    class TestMessageListView(TestCase, cradmin_testhelpers.TestCaseMixin):
        """
        Simple Message Listbuilder View tests for the CRadmin application 'messages'
        """
        viewclass = MessageListBuilderView

        def setUp(self):
            self.account = mommy.make('cradmin_gettingstarted.Account', name='My Account')

        def test_get_render_form_sanity(self):
            mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=self.account)
            self.assertEqual('Messages',mockresponse.selector.one('title').text_normalized)
            self.assertEqual('Messages', mockresponse.selector.one('.test-primary-h1').text_normalized)

        def test_render_list_sanity(self):
            mommy.make(
                'cradmin_gettingstarted.Message',
                account=self.account,
                _quantity=5
            )
            mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=self.account)
            message_list = mockresponse.selector.list('.test-cradmin-listbuilder-item-value-renderer')
            self.assertEqual(5, len(message_list))

        def test_render_item_value_sanity(self):
            my_message = mommy.make(
                'cradmin_gettingstarted.Message',
                account=self.account,
                title='Hello World',
                body='Life is beatiful'
            )
            mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=self.account)
            self.assertTrue(mockresponse.selector.one('.test-cradmin-listbuilder-title-description__title'))
            self.assertTrue(mockresponse.selector.one('.test-cradmin-listbuilder-title-description__description'))
            message_title = mockresponse.selector.one('.test-cradmin-listbuilder-title-description__title').text_normalized
            message_body = mockresponse.selector.one(
                '.test-cradmin-listbuilder-title-description__description').text_normalized
            self.assertEqual(my_message.title, message_title)
            self.assertEqual(my_message.body, message_body)

Test Message Edit View
""""""""""""""""""""""
In the file ``test_message_edit_view`` we're creating class methods which tests if the title of the page is as expected,
if we get a message when the required fields have no value and that we get redirected when we update a message with
values for the required fields. If you remember from earlier testing, CRadmin automaticly tests if the response code is
200 if we use ``self.mock_http200_......``. The same goes for all ``self.mock....`` which have a status code number in
them. In the last test below we still checks the status code as an example of what is going on behind the scenes.
In the setUp method we also add a message since we need this in all our tests. Further we use the ``viewkwargs`` to pass
along the id of the message we want to edit, while the ``requestkwargs`` sets a new value to the fields.
::

    from django.test import TestCase
    from model_mommy import mommy

    from django_cradmin import cradmin_testhelpers


    class TestMessageEditView(TestCase, cradmin_testhelpers.TestCaseMixin):
        """
        Simple Edit Message View tests for the CRadmin application 'messages'
        """
        viewclass = message_edit_views.MessageEditView

        def setUp(self):
            self.account = mommy.make('cradmin_gettingstarted.Account', name='My Account')
            self.message = mommy.make(
                'cradmin_gettingstarted.Message',
                account=self.account,
                title='Hello World',
                body='Life is Beatiful'
            )

        def test_get_view_title_sanity(self):
            mockresponse = self.mock_http200_getrequest_htmls(
                cradmin_role=self.account,
                viewkwargs={'pk': self.message.id}
            )
            self.assertTrue(mockresponse.selector.one('.test-primary-h1'))
            view_title = mockresponse.selector.one('.test-primary-h1').text_normalized
            self.assertTrue('Edit message', view_title)

        def test_post_without_required_field_title(self):
            mockresponse = self.mock_http200_postrequest_htmls(
                cradmin_role=self.account,
                viewkwargs={'pk': self.message.id},
                requestkwargs={
                    'data': {
                        'title': '',
                        'body': 'A body'
                    }
                }
            )
            self.assertTrue(mockresponse.selector.one('#id_title_wrapper'))
            self.assertEqual('This field is required.',
                             mockresponse.selector.one('#id_title_wrapper .test-warning-message').alltext_normalized)

        def test_post_without_required_field_body(self):
            mockresponse = self.mock_http200_postrequest_htmls(
                cradmin_role=self.account,
                viewkwargs={'pk': self.message.id},
                requestkwargs={
                    'data': {
                        'title': 'A title',
                        'body': ''
                    }
                }
            )
            self.assertTrue(mockresponse.selector.one('#id_body_wrapper'))
            self.assertEqual('This field is required.',
                             mockresponse.selector.one('#id_body_wrapper .test-warning-message').alltext_normalized)

        def test_post_message_sanity(self):
            mockresponse = self.mock_http302_postrequest(
                cradmin_role=self.account,
                viewkwargs={'pk': self.message.id},
                requestkwargs={
                    'data': {
                        'title': 'Hello Space',
                        'body': 'But you cannot hear me, can you?'
                    }
                }
            )
            self.assertEqual(302, mockresponse.response.status_code)
            self.assertEqual(1, Message.objects.all().count())

Test Message Delete View
""""""""""""""""""""""""
Here we use the setUp method create an Account and a message we will work with in all tests. What we checks in these
tests is that we get the template, that we get a confirm question before deleting a message and that the correct message
is delete.
::

    from django.test import TestCase
    from model_mommy import mommy

    from django_cradmin import cradmin_testhelpers


    class TestMessageDeleteView(TestCase, cradmin_testhelpers.TestCaseMixin):
        """
        Simple Delete Message View tests for the CRadmin application 'messages'
        """
        viewclass = message_edit_views.MessageDeleteView

        def setUp(self):
            self.account = mommy.make('cradmin_gettingstarted.Account', name='My Account')
            self.message = mommy.make(
                'cradmin_gettingstarted.Message',
                title='My message',
                account=self.account
            )

        def test_get_form_sanity(self):
            mockresponse = self.mock_http200_getrequest_htmls(
                cradmin_role=self.account,
                viewkwargs={'pk': self.message.id}
            )
            self.assertEqual('Confirm delete', mockresponse.selector.one('title').text_normalized)
            self.assertEqual('Confirm delete', mockresponse.selector.one('.test-primary-h1').text_normalized)

        def test_deleteview_question_sanity(self):
            mockresponse = self.mock_http200_getrequest_htmls(
                cradmin_role=self.account,
                viewkwargs={'pk': self.message.id}
            )
            self.assertTrue(mockresponse.selector.one('#id_deleteview_question'))
            question = mockresponse.selector.one('#id_deleteview_question').alltext_normalized
            self.assertEqual('Are you sure you want to delete "{}"?'.format(self.message.title), question)

        def test_message_deleted_sanity(self):
            another_message = mommy.make(
                'cradmin_gettingstarted.Message',
                account=self.account,
                title='Delete me not'
            )
            self.assertEqual(2, Message.objects.all().count())
            self.mock_http302_postrequest(
                cradmin_role=self.account,
                viewkwargs={'pk': self.message.id}
            )
            self.assertEqual(1, Message.objects.all().count())
            self.assertFalse(Message.objects.filter(pk=self.message.id))
            self.assertTrue(Message.objects.get(pk=another_message.id))

Test Message Create View
""""""""""""""""""""""""
In our last test file ``test_message_create_view`` we checks that the form renders as wanted, that we get a warning
message if one of the required fileds have no value and that we are sucessfull in creating a new message when all
required fields have a value.
::


    from django.test import TestCase
    from model_mommy import mommy

    from django_cradmin import cradmin_testhelpers
    from django_cradmin.demo.cradmin_gettingstarted.crapps.messages import message_edit_views
    from django_cradmin.demo.cradmin_gettingstarted.models import Message


    class TestMessageCreateView(TestCase, cradmin_testhelpers.TestCaseMixin):
        """
        Simple Create Message View tests for the CRadmin application 'messages'
        """
        viewclass = message_edit_views.CreateMessageView

        def setUp(self):
            self.account = mommy.make('cradmin_gettingstarted.Account', name='My Account')

        def get_form_title_sanity(self):
            mockresponse = self.mock_http200_getrequest_htmls(
                cradmin_role=self.account
            )
            self.assertEqual('Create message', mockresponse.selector.one('.test-primary-h1').text_normalized)

        def test_post_form_without_required_title(self):
            mockresponse = self.mock_http200_postrequest_htmls(
                cradmin_role=self.account,
                requestkwargs={
                    'data': {
                        'title': '',
                        'body': 'Iron Maiden'
                    }
                }
            )
            self.assertTrue(mockresponse.selector.one('#id_title_wrapper'))
            self.assertEqual('This field is required.',
                             mockresponse.selector.one('#id_title_wrapper .test-warning-message').alltext_normalized)

        def test_post_form_without_required_body(self):
            mockresponse = self.mock_http200_postrequest_htmls(
                cradmin_role=self.account,
                requestkwargs={
                    'data': {
                        'title': 'Metallica',
                        'body': ''
                    }
                }
            )
            self.assertTrue(mockresponse.selector.one('#id_body_wrapper'))
            self.assertEqual('This field is required.',
                             mockresponse.selector.one('#id_body_wrapper .test-warning-message').alltext_normalized)

        def test_post_form_success(self):
            self.mock_http302_postrequest(
                cradmin_role=self.account,
                requestkwargs={
                    'data': {
                        'title': 'Metal Forever',
                        'body': 'Yeah!'
                    }
                }
            )
            self.assertEqual(1, Message.objects.all().count())

Next Chapter
------------
TODO