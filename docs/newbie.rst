############
Newbie guide
############

.. _newbieguide:


***************
What is CRadmin
***************
- CRadmin has rolebased accesscontrol.
- CRadmin has one or more apps, called CrApps.
- CRadmin as one or more files called crinstance, which holds all the CrApps.


****************
CRadmin_instance
****************
When implementing CRadmin in a Django project, at least one file called ``crinstance_<crappname>.py`` must be created.
This file holds different information about your CrApps, such as roleclass and method for rolequeryset. A
``cradmin_instance`` can holde one or more CrApps. It is possible for a
``cradmin_instance`` file to hold CrApps from different Django Apps.

One advantage with the ``cradmin_instance`` is the possibility to easily include different views. These views may have
different roles.

Minimalistic ``cradmin_instance`` example::

    class MyCrAdminInstance(crinstance.BaseCrAdminInstance):
    roleclass =
    rolefrontpage_appname =

    apps = [
       ('CrAppNameHere, <path_to_crapp_module>.App),
    ]

    def get_rolequeryset(self):

Roleclass
---------
An easy way to explain the ``roleclass`` is to use the example. A website holds all the
webpages. A very lightweight translation into Python classes can be the classes Site and Page. The ``cradmin_instance``
is then the Site, setting the ``roleclass`` to Site. You request the roleclass with ``request.cradmin_role``.
We will come back to the roleclass for Page later in the document.

Rolefrontpage appname
---------------------
This is the app to where the user is redirected after chosing a role. Depending on what you build you may have different
apps to where you want to redirect a user. This is solved by creating more than one ``cradmin_instance`` for the CrApp.
However, you can also redirect a not logged-in user to the ``INDEX`` of your app, which would be the
case if you build a website open for the public to read.

Rolequeryset
------------
The super :class:`django_cradmin.crinstance.BaseCrAdminInstance` describes more in detail the different methods used by
a ``cradmin_intance``. However if you use the rolebased accesscontrol, the
:meth:`django_cradmin.crinstance.BaseCrAdminInstance.get_rolequeryset` gets the role for the authenticated user.
However, if you don't need a role like in a detailview for a public webpage, you can use the mixin
:class:`django_cradmin.crinstance.NoRoleMixin`. There is also a mixin for not requiring a logged-in user in the
:class:`django_cradmin.crinstance.NoLoginMixin`. Furthermore the mixin :class:`django_cradmin.crinstance.NoLoginMixin`
is a shortcut if you neither need a role nor login to see the content held by the ``cradmin_instance``.


******
CrApps
******
The module ``crapps`` is at the same level as ``templates`` and ``tests`` in a Django projects. Inside the ``crapps``
directory you will add modules which is the ``CRadmin app`` you want to use in your Django project. The project
structure will then look something like::

    django_app
        crapps (module)
            cradmin_app (module)
                __init__ (with urls)

Roles within CrApps
-------------------
If we continue the example with a Website and webpages as mentioned earlier on, you may create a ``cradmin_app`` named
``pages_app``. Within this app you will most likely have different kind of views, such as edit, create and delte. Lets
assume the same person should be able to create, edit and delete a webpage. Somewhere, maybe in a mixin, you must
define the role a user has to have to be granted privileges for working with the pages. The attribute ``roleid_field``
must be sat equal to the roleclass defined in the ``cradmin_instance`` file. Finally your views must have a method named
``get_queryset_for_role`` to set the correct access for the user.
To make it all work, you will have the following classes::

    MODELS
    class Site(models.Model):
        name = models.CharField(max_length=100)
        admins = models.ManyToManyField(settings.AUTH_USER_MODEL)

    class Page(models.Model):
        site = models.ForeginKey(Site)


    CRADMIN INSTANCE
    class WebCrAdminInstance(crinstance.BaseCrAdminInstance):
        id = 'website'
        roleclass = Site
        rolefrontpage_appname = 'pages'

        apps = [
            ('pages', pages.App),
        ]

        def get_rolequeryset(self):
            queryset = Site.objects.all()
            if not self.request.user.is_superuser:
                queryset = queryset.filter(admins=self.request.user)
            return queryset

    PAGES APP
    class PageCreateUpdateMixin(object):
        model = Page
        roleid_field = 'site'

        def get_queryset_for_role(self):
            return Page.objects.filter(site=self.request.cradmin_role)

Views in CrApps
---------------
There are different types of views within CRadmin. It is important to remember that this is an Django Extension, so if
you don't know much about views in Django, do start reading the Django Docs. However, the view used for edit a webpage
will be a subclass of the super :class:`django_cradmin.viewhelpers.formview.updateview.WithinRoleUpdateView`. This is
a modelbased view, and offcourse there are super classes for create and delete. Ssometimes a modelbased view
just want cut it. In these cases, the :class:`django_cradmin.viewhelpers.formview.formview.WithinRoleFormView` may be
your super class. The point is to use the viewhelpers in CRadmin.

Indexview
---------
According to :meth:`django_cradmin.crapp.App.reverse_appindexurl` it is expected that each ``CrApp`` has a view named
``crapp.INDEXVIEW_NAME``. This is the frontpage or homepage for the app.


************
CRadmin urls
************
We recomend to use the ``__init__`` file within a ``cradmin__app`` to set the urls for each view. Hence the file
contaning you default urls must include the urls to the ``cradmin_instance``::

    url(r'^webpages/', include(WebCrAdminInstance.urls())),

In the ``__init__`` file you will add the :class:`django_cradmin.crapp.App` which holds the urls to all different views
within the app. If we continue the website and webpage example, the ``__init__`` file will look something like this for
the pages app::

    from django_cradmin import crapp

    from django_project.django_app.crapps.pages_app import websiteviews
    from django_project.django_app.crapps.pages_app import editviews

    class App(crapp.App):
        appurls = [
            crapp.Url(
                r'^$',
                websiteviews.IndexView.as_view(),
                name=crapp.INDEXVIEW_NAME
            ),
            crapp.Url(
                r'^create$',
                editviews.PageCreateView.as_view(),
                name="create"),
            crapp.Url(
                r'^edit/(?P<pk>\d+)$',
                editviews.PageUpdateView.as_view(),
                name="edit"),
            crapp.Url(
                r'^delete/(?P<pk>\d+)$',
                editviews.PageDeleteView.as_view(),
                name="delete")
        ]
