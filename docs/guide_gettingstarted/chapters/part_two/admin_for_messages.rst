.. _admin_for_messages:

Admin for Messages
==================
In this chapter we want to add functionality which let us create new messages and edit or delete existing ones. We are
going to use the existing CRadmin instance ``AccountAdminCradminInstance`` to hold our new CRadmin application.

CRadmin comes with an easy to use template for creating a list of all messages created by an account. Buttons for
create, edit and delete are automaticly added for us. However we need to override one block in the template to publish
the timestamp on a message, just as we did when creating our public UI for messages. Keep in mind this is a getting
started guide, meaning the structure of our project's applications can be done smoother. For instance coulde the
application messages hold views for both public and admin UI. We could even use one template showing content based
on the role or if a user is logged in. On the other side can the chosen structure provide an easy to use guide for the
different parts of CRadmin without digging for far to long in our code.

Let us start creating what we need to make a list of all messages with the options to edit, delete and create a new
message.

CRadmin Instance
----------------
We add an application to the list of apps in the ``AccountAdminCradminInstance`` and call it ``messages``. ::

        apps = [
            ('account_admin', account_adminui.App),
            ('new_account', create_account.App),
            ('public_messages', publicui.App),
            ('messages', messages.App)
        ]

Crapps
------
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

Urls
----
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

Template
--------
Our template extends the ``edit-delete`` CRadmin template, and all we want is to fill the block below the description
with the timestamp for creation of the message.

::

    {% extends "django_cradmin/viewhelpers/listbuilder/itemvalue/edit-delete.django.html" %}
    {% load cradmin_tags %}

    {% block below-description %}
        Posted: {{ me.message.creation_time }}
    {% endblock below-description %}

Tests
-----
