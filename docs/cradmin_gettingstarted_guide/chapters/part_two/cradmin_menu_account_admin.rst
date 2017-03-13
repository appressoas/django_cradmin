.. _cradmin_menu_account_admin:

CRadmin Menu Account Admin
==========================
In this chapter we're going to add a expandable menu for our account administration CRadmin instance. The goal here is
to have a back option to the dashboard of the account administration application, one menu point which lets us create
a new account and the last menu point will take us to the list view of all messages in the system.

In our CRadmin instance class ``AccountAdminCradminInstance`` we first add the two other CRadmin applications(crapps)
to our list of apps. By doing this we can get a hold of the views for the other crapps.
::

    apps = [
        ('account_admin', account_adminui.App),
        ('new_account', create_account.App),
        ('public_messages', publicui.App)
    ]

If we now add a method to get the expandable menu items rendered, we will have a menu up in the right corner for all
users which is an account administrator. All CRadmin instanced which have the
:class:`django_cradmin.crinstance.BaseCrAdminInstance` as a super, also have access to the menue system which is based
on the :class:`django_cradmin.crmenu.AbstractMenuRenderable`. Very easy spoken, all it does is to render a menu. We
advice you to take a closer look on the abstract menu renderable class to understand in more detail how the CRadmin
menu works. Nevertheless, we are going to use the method ``get_expandable_menu_item_renderables``. Each item in the
menu points to one of the crapps in our list of applications. First we will show the method and than explain in further
detail what we have done. ::

    def get_expandable_menu_item_renderables(self):
        return [
            crmenu.ExpandableMenuItem(
                label=ugettext_lazy('Dashboard'),
                url=self.appindex_url('account_admin'),
                is_active=self.request.cradmin_app.appname == 'account_admin'),
            crmenu.ExpandableMenuItem(
                label=ugettext_lazy('New Account'),
                url=self.request.cradmin_instance.reverse_url(appname='new_account', viewname='create_account'),
                is_active=self.request.cradmin_app.appname == 'new_account'),
            crmenu.ExpandableMenuItem(
                label=ugettext_lazy('Public Messages'),
                url=self.appindex_url('public_messages'),
                is_active=self.request.cradmin_app.appname == 'public_messages')
        ]

The first menu item points to the CRadmin application of the the account admin. The url we want to go to is the index,
which we sat in the in the ``account_adminui`` crapps init file. In the second menu item we want to be taken to the
create account view. In the url we must use the reverse url of the CRadmin instance, and pass along the application
name and view name. This will take us directly to the template where we can add a new account. The third menu item is
the index view for the public UI CRadmin application.

Next Chapter
------------
TODO
