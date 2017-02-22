########
Tutorial
########

.. warning:: This guide is under development, and does not work at this time.

Install
=======
If you have not already done so, please follow the steps in the :ref:`installguide` guide before continuing.


New to CRadmin
==============
If you are new to CRadmin we advice you to read :ref:`newbieguide` before advancing.


Introduction
============
With this project we aim to make the admin interface easier to use, prettier to look at, and more flexible than the
original admin interface in Django.


In this guide we will create a message system where you can write messages as an administrator with the correct role
and look at messages written by other as a common user without a special role. We do not show you where from where we
import project file since this application is build inside CRadmin alongside aother applications made for demo purpose.
Hence, your project sturcture will not look like ours. However, when we import from external libraries or from CRadmin
itself, we will show it.

Setting up the models
---------------------
First you create a Django app inside your project, just like you always do in Django, and create your models and do
some model testing to get started on that part. The models.py file looks like this in the beginning::

    from django.conf import settings
    from django.db import models

    class Account(models.Model):
        """
        The account which works as the cradmin_role.
        """

        #: The name of the account which create, edit and delete messages
        account_name = models.CharField(
            blank=False,
            null=False,
            max_length=50,
            verbose_name='Account name'
        )

        def __str__(self):
            return self.account_name


    class AccountAdministrator(models.Model):
        """
        A user which is an administrator for the :class:`.Account`."
        """

        #: A user with privileges for handling an :class:`.Account`
        user = models.ForeignKey(settings.AUTH_USER_MODEL)

        #: The :class:`.Account` in question to which be administrated
        account = models.ForeignKey(Account)



Setting up a CRadmin interface
==============================
One central part of the interface is the ``cramdin_instance``. In this file we connect our CRadmin apps, known as
``crapps``. Further we can render different kind of menus, header and footer. A full explenation of the methods and
functionality which is possible with a ``cradmin_instance`` can be read in class documentation
:class:`django_cradmin.crinstance.BaseCrAdminInstance`

Setting database model and connect the model with the CRadmin instance
----------------------------------------------------------------------
We begin by creating the file ``gettingstarted_cradmin_instance.py`` which is a subclass of
``BaseCrAdminInstance`` and it will contain our main CRadmin configuration. For now we place this file at the same level
as our models.py file. By overriding the variable ``roleclass`` and method ``get_rolequeryset`` we add a databasemodel
as the roleclass and decides which objects to be returned from the database. Our ``gettingstarted_cradmin_instance.py``
file looks like this::

    from django_cradmin import crinstance

    class GettingStartedCradminInstance(crinstance.BaseCrAdminInstance):
        roleclass = Account

        def get_rolequeryset(self):
            queryset = Account.objects.all()
            if not self.request.user.is_superuser:
                queryset = queryset.filter(accountadministrator__user=self.request.user)
            return queryset
Here we have defined a roleclass and returned all Account objects in the database which have an user defined in
the class AccountAdministrator. If you are logged in as a superuser, all Accounts will be returne. So if we query an
Account which is not connected to an AccountAdministrator, the ``get_rolequeryset`` should be empty. Likewise, the
``get_rolequeryset`` should not be empty when a user is connected to the Account class through the AccountAdministrator.
Lets write two tests to check if this theory holds water. For most of the tests we`ll be using mommy, and for some tests
we also use MagicMock::

    from unittest import mock

    from django.conf import settings
    from django.test import TestCase
    from model_mommy import mommy

    class TestGettingStartedCradminInstance(TestCase):
        def test_none_super_user_makes_empty_rolequeryset(self):
            mommy.make('cradmin_gettingstarted.Account')
            mockrequest = mock.MagicMock()
            mockrequest.user = mommy.make(settings.AUTH_USER_MODEL)
            cradmin_instance = GettingStartedCradminInstance(request=mockrequest)
            self.assertEqual(0, cradmin_instance.get_rolequeryset().count())

        def test_user_is_in_rolequeryset(self):
            user = mommy.make(settings.AUTH_USER_MODEL)
            account = mommy.make('cradmin_gettingstarted.Account')
            mommy.make(
                'cradmin_gettingstarted.AccountAdministrator',
                account=account,
                user=user
            )
            mockrequest = mock.MagicMock()
            mockrequest.user = user
            cradmin_instance = GettingStartedCradminInstance(request=mockrequest)
            self.assertEqual(1, cradmin_instance.get_rolequeryset().count())
As the tests shows, our queryset is empty when the Account is not connected to an AccountAdministrator. Further, the
queryset returned one object from the database when we connected the two. So far so good.


Building an index view for Account
----------------------------------
Our main goal for now is to create an indexview or a dashboard if you prefer, which will give us some information about
the Account we are currently holding. The next step to make this happen is to connect the ``cramdin_instance`` with a
CRadmin application. These apps lives inside a module named ``crapps`` in our Django App. A full documentation for the
CRadmin app can be read the in the class documentation :class:`django_cradmin.crapp.App`.

In CRadmin the apps are essentially our views. This is where we define the urls, layout and content of the various
pages for our CRadmin interface.

First we create a module called ``crapps`` which will hold all of our cradmin applications. Inside here, we create a
file called ``account_index.py``. The Project structure will look something like ::

    cradmin_gettingstarted
        crapps
            init.py
            account_index.py
        migrations
        tests
        init.py
        gettingstarted_cradmin_instance.py
        models.py
The file named ``account_index.py`` will contain a class which is a sub of the ``WithinRoleTemplateView``. This view
is used when you extends the ``django_cradmin/base.django.html`` template which inherit from Djangos generic
templateview. As the name suggests, our ``WithinRoleTemplateView`` is used when you have a role, as we sat in the
cradmin instance file to the class Account.

Inside the ``account_index.py`` file we add this content::

    from django_cradmin.viewhelpers.generic import WithinRoleTemplateView

    class AccountIndexView(WithinRoleTemplateView):
        template_name = 'cradmin_gettingstarted/account.index.django.html'

You could choose to use the built-in template in CRadmin, hence not setting a template name. However, we want to show
you some functionality which is done in the template, thus we create our own and put in the template folder for our
Django project, just as we always do.

Eventhough it is common practice to not put code in an ``__init__.py``file, we put our ``crapp.App`` class in here. This
makes it possible to load different urls from our CRadmin application in an easy way. Besides all of our crapps modules
are selfcontained, so being outside the CRadmin app we either import the whole shabang or we don't import it at all.

So in the ``__init__.py`` file inside the crapps folder we add the url to the view as this::

    from django_cradmin import crapp


    class App(crapp.App):
        appurls = [
            crapp.Url(r'^$', AccountIndexView.as_view(), name=crapp.INDEXVIEW_NAME)
        ]
As mentioned earlier we want to use our own template, so I have created a file named ``account_index.django.html`` which
is placed inside the Django applications template folder with the following content::

    {% extends "django_cradmin/base.django.html" %}

    {% block title %}
        {{ request.cradmin_role.account_name }}
    {% endblock title %}

    {% block content %}

    {% endblock content %}
Now, as you can see in the title block we are requesting the account name for the cradmin_role. To make this work we
need to implement the :func:`django_cradmin.crinstance.BaseCrAdminInstance.get_titletext_for_role` in our
``gettingstarted_cradmin_instance.py`` file and tell it to return the account name, like this::

    def get_titletext_for_role(self, role):
        return role.account_name
Testing the view
----------------
Before we contiune our work, let us take a short break. Go outside, stretch our legs and get some fresh air.

Now that we feel refreshed, it is time to test the recent work. CRadmin has test helpers to make testing work fast and
easy. We consider it very important to test code, so it is equally important to have tools which makes the testing go
smoothly. We will start simple and explain some basic functionality for testing with CRadmin. If you want to read more
about testing in CRadmin, go over to the class documentation :class:`django_cradmin.cradmin_testhelpers.TestCaseMixin`.


We have the same structure in our tests module as we have for our Django App, meaning inside the tests directory there
is a new module named ``test_crapps``. Inside here we put the file ``test_account_index.py``::

    tests
        test_crapps
            __init__.py
            test_account_index.py
        __init__.py
        test_gettingstarted_cradmin_instance.py


The first thing we're going to test is if the account name for an instance of our Account model is displayed in the
template. We create a test class which is a subclass of both ``TestCase`` and ``cradmin_testhelpers.TestCaseMixin``. In
this class we tell which view we want to test. Further we write a method to check the html title in the template, where
we create both an Account and an AccountAdministrator with mommy. Further we mock a get request by using functionality
from CRadmin.

Our test file for the index view looks like this::

    from django.conf import settings
    from django.test import TestCase
    from model_mommy import mommy

    from django_cradmin import cradmin_testhelpers


    class TestAccountIndexView(TestCase, cradmin_testhelpers.TestCaseMixin):
        """"""
        viewclass = AccountIndexView

    def test_get_title(self):
        account = mommy.make(
            'cradmin_gettingstarted.Account',
            account_name='My account'
        )
        mommy.make(
            'cradmin_gettingstarted.AccountAdministrator',
            account=account,
            user=mommy.make(settings.AUTH_USER_MODEL)
        )
        mockresponse = self.mock_getrequest(
            htmls_selector=True,
            cradmin_role=account
        )
        mockresponse.selector.prettyprint()
        page_title = mockresponse.selector.one('title').alltext_normalized
        self.assertEqual(account.account_name, page_title)
In the ``self.mock_get_request`` hmtls selector is True and the CRadmin role is our newly created account. Htmls
is created by us to make it easy to use CSS selectors with HTML in unittests. The line
``mockresponse.selector.prettyprint()`` writes the template out to your terminal. Normally this is NOT pushed up to
GitHub or wherever you store you code. It's just a tool making it easy for a developer to see the whole template with
all its CSS classes and HTML tags. The line ``page_title = mockresponse.selector.one('title').alltext_normalized``
fetches the templates title. We tell the HTMLS that we expect just one instance of a title and that we want all the text
appear with normalize whitespace, meaning all text within this element and all child elements has the string stripped
of whitespaces in both ends and all consecutive whitespace characters is repleced with a single space. If we want to
just get the text within a element, we use ``text_normalized`` instead. For this example, I think both would work.
Nevertheless, we now have fetched the title from our template and can do a assert equal to see if it matches
the account name.

Setting up urls
===============
Now we are ready to see our index view on localhost. First we need to connect our new app, the index view, with the
CRadmin instance. This is done by adding the following code in the ``gettingstarted_cradmin_instance`` file::

    class GettingStartedCradminInstance(crinstance.BaseCrAdminInstance):
        roleclass = Account

        apps = [
            ('index', crapps.App)
        ]
Project urls
____________
Now that we have told CRadmin to read the url in our crapps __init__ file, we need to tell our Django project to include
the cradmin instance. So in the file for all your project urls, you import the ``gettingstarted_cradmin_instance`` file
and then you add the following to include the urls::

    urlpatterns = [
        url(r'^gettingstarted/', include(GettingStartedCradminInstance.urls())),
    ]

Create an Account and display account name in html
==================================================
Now is a good time to add the models to your ``admin.py`` file. This way you can create an account and
add a user to that account. Now since we are using rolebased accesscontrol we need to add login functionality so the
account created in Django admin will show up in you template. CRadmin has an easy way to get login and logout up and
running in no time. All you need to do is to add the following in your project settings::

    INSTALLED_APPS = (
        # ...
        'django_cradmin',
        'django_cradmin.apps.cradmin_authenticate',
    )
And in your urls.py file for the project you add::

    urlpatterns = patterns(
        # ...
        url(r'^authenticate/', include('django_cradmin.apps.cradmin_authenticate.urls')),
        # ...
    )
Cradmin instance
----------------
As you may have read, the :class:`django_cradmin.crinstance.BaseCrAdminInstance` requires a ``rolefrontpage_appname``
so it know which app is your frontpage. CRadmin calls this ``INDEXVIEW_NAME``, and we sat this name in the ``__ini__``
file when we added the appurls. So your ``gettingstarted_cradmin_instance`` file should now look like this::

    from django_cradmin import crinstance
    from django_cradmin.demo.cradmin_gettingstarted import crapps
    from django_cradmin.demo.cradmin_gettingstarted.models import Account


    class GettingStartedCradminInstance(crinstance.BaseCrAdminInstance):
        id = 'gettingstarted'
        roleclass = Account
        rolefrontpage_appname = 'account_admin'

        apps = [
            ('account_admin', crapps.App)
        ]

        def get_rolequeryset(self):
            queryset = Account.objects.all()
            if not self.request.user.is_superuser:
                queryset = queryset.filter(accountadministrator__user=self.request.user)
            return queryset

        def get_titletext_for_role(self, role):
            return role.account_name
Index view
----------
In the ``account_index.py`` file we need to add some context data. First let us create a property so we can have names
which matches what we have build so far. As you remember, our CRadmin roleclass is Account. By creating a property named
account and have it return a request for the cradmin_role, we get the account as role. Now you don't need to do it this
way. I recon it makes more sense and gives the code a tad increased readability. Nevertheless, we get to context
variables which is used in our template. One for the account and one for the account administrator::

    from django_cradmin.demo.cradmin_gettingstarted.models import Account
    from django_cradmin.viewhelpers.generic import WithinRoleTemplateView


    class AccountIndexView(WithinRoleTemplateView):
    template_name = 'cradmin_gettingstarted/account_index.django.html'

    @property
    def account(self):
        return self.request.cradmin_role

    def __get_account(self):
        return self.account

    def __get_account_admin(self):
        return AccountAdministrator.objects.get(pk=self.account.id)

    def get_context_data(self, **kwargs):
        context = super(AccountIndexView, self).get_context_data()
        context['account_admin'] = self.__get_account_admin()
        context['account'] = self.__get_account()
        return context
Test view
_________
First we add a new block to our template so that the Account name shows as a h1 tag for the page and we load the
cradmin_tags which we will use in testing::

    {% extends "django_cradmin/base.django.html" %}
    {% load cradmin_tags %}

    {% block title %}
        {{ request.cradmin_role.account_name }}
    {% endblock title %}

    {% block page-cover-title %}
        {{ request.cradmin_role.account_name }}
    {% endblock page-cover-title %}

Cradmin uses ``cradmin_test_css_class`` as class for html tags. When we do this you can still change other classes on
your tags without have to change anything in your tests. In the ``base.django.html`` which we extends in our template
there is already a test CSS class for the page-cover-title block, so that test-css-class would work without loading the
cradmin tags.
We can now write a test to confirm that the cover title is equal to our Account name. Add a test in your
``test_account_index``::

    def test_get_heading(self):
        account = mommy.make('cradmin_gettingstarted.Account', account_name='Test Account')
        mommy.make(
            'cradmin_gettingstarted.AccountAdministrator',
            account=account,
            user=mommy.make(settings.AUTH_USER_MODEL)
        )
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=account
        )
        self.assertTrue(mockresponse.selector.one('.test-primary-h1'))
        heading = mockresponse.selector.one('.test-primary-h1').alltext_normalized
        self.assertEqual(account.account_name, heading)
Here we use a new build in mock method which expects a 200 response from the get request, thus the test fails if another
status code than 200 is return. Further we do not need to say that ``html_selectors=True``. We check that the
``cradmin_test_css_class`` named "test-primary-h1" exists and that is value is equal to the name of the Account.
Next we want to test if the name of an account which we are not the administrator off, shows up in the template. You can
test this with cradmin instances or right in the template. I`m gonna choose the latter since we're looping over all
account in the html file. So in the ``account_index.django.html`` template we add some code to make it look a tad nicer
and a ``cradmin_tes_css_class``::

    {% block content %}
        <section class="adminui-page-section  adminui-page-section--center-lg">
            <div class="container">
                <div class="blocklist blocklist--tight">
                    <section class="blocklist__item">
                    <h2 class="blocklist__itemtitle">Account administrator</h2>
                    <p class="{% cradmin_test_css_class 'admin-user-email' %}">{{ account_admin.user.email }}</p>
                </section>
                </div>
            </div><!-- end container-->
        </section>
    {% endblock content %}
In the ``test_account_index`` file we can now write a test where only one of two users first name should show::

    def test_only_account_where_user_is_admin_shows_on_page(self):
        account_one = mommy.make('cradmin_gettingstarted.Account', account_name='Wrong role account')
        account_two= mommy.make('cradmin_gettingstarted.Account', account_name='Right role account')
        mommy.make(
            'cradmin_gettingstarted.AccountAdministrator',
            account=account_one,
            user=mommy.make(settings.AUTH_USER_MODEL, email='not_me@example.com')
        )
        mommy.make(
            'cradmin_gettingstarted.AccountAdministrator',
            account=account_two,
            user=mommy.make(settings.AUTH_USER_MODEL, email='me@example.com')
        )
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=account_two)
        self.assertTrue(mockresponse.selector.one('.test-admin-user-email'))
        admin_email = mockresponse.selector.one('.test-admin-user-email').alltext_normalized
        self.assertEqual('me@example.com', admin_email)

Edit Account
============
Now that we can see the index page for each account connected to the administrator, lets add a view to update the
Account. We can do this by using a ``modelform`` in Django. First we create a file named ``edit_account.py`` in account
crapps (this is where our ``account_index.py`` file lives). Then we write an mixin class so that we can use the same
form when we edit an exisitng account and later on when we want to create a new account for the administrator. Our
``edit_account.py`` file will now loook something like::

    from django_cradmin import uicontainer
    from django_cradmin.demo.cradmin_gettingstarted.models import Account
    from django_cradmin.viewhelpers import formview


    class AccountCreateUpdateMixin(object):
        model = Account
        roleid_field = 'account'
        fields = [
            'account_name'
        ]

        def get_form_renderable(self):
            return uicontainer.layout.AdminuiPageSectionTight(
                children=[
                    uicontainer.form.Form(
                        form=self.get_form(),
                        children=[
                            uicontainer.fieldwrapper.FieldWrapper('account_name'),
                            uicontainer.button.SubmitPrimary(
                                text='Save')
                        ]
                    )
                ]
            ).bootstrap()


    class AccountUpdateView(AccountCreateUpdateMixin, formview.WithinRoleUpdateView):
        """"""
        def get_queryset_for_role(self):
            return Account.objects.filter(id=self.request.cradmin_role.pk)
First we import uicontainer from django_cradmin, which is used to render the form with the cradmin layout. In the
:class:`django_cradmin.demo.cradmin_gettingstarted.crapps.account.edit_account.AccountCreateUpdateMixin` we choose the
model which are form is going to handle, and choose fields. Further we add a ``roleid_filed`` as "account". This is
described in :class:`django_cradmin.viewhelpers.formview.create_update_view_mixin.CreateUpdateViewMixin` and is the
current role, which in our case is "account". When we render the form we add a submit button to save the Account after
changing the account name. In the
:class:`django_cradmin.demo.cradmin_gettingstarted.crapps.account.edit_account.AccountUpdateView` we use the super
:class:`django_cradmin.viewhelpers.formview.updateview.WithinRoleUpdateView` and overwrites the method where we query
the role and filter the objects on the PK to our current cradmin_role. We add a new url in the ``__init__.py`` file
inside our crapps::

    class App(crapp.App):
        appurls = [
            crapp.Url(
                r'^$',
                account_index.AccountIndexView.as_view(),
                name=crapp.INDEXVIEW_NAME
            ),
            crapp.Url(
                r'^edit/(?P<pk>\d+)$',
                edit_account.AccountUpdateView.as_view(),
                name='edit'
            )
        ]
We do not create a new template for this edit view, but rather use the built-in html in CRadmin. So in our
``account_index.django.html`` file we add a new section after the one which gives the name for the account
administrator::

    <section class="blocklist__item">
        <h2 class="blocklist__itemtitle">Edit Account</h2>
        <a href='{% cradmin_appurl viewname="edit" pk=admin.account.id %}' class="button  button--primary">
            Change name
        </a>
    </section>
Here we use CRadmin template tag ``cradmin_appurl`` which reverse the view named "edit" and we pass the PK of our
current account. Now it's time to test our UpdateView for the Account.

Test Edit Account
-----------------
We want to test at least three different senarios. The first is a get request to check that he form is rendered with the
name of our current account. The second is a 200 postrequest if the new account name is empty. And finally we want to
check that a post request with a new account name updates the current Account object and gives us a 302 Found
redirects::

    from django.conf import settings
    from django.test import TestCase
    from model_mommy import mommy

    from django_cradmin import cradmin_testhelpers
    from django_cradmin.demo.cradmin_gettingstarted.crapps.account import edit_account
    from django_cradmin.demo.cradmin_gettingstarted.models import Account


    class TestUpdateAccountView(TestCase, cradmin_testhelpers.TestCaseMixin):
        viewclass = edit_account.AccountUpdateView

        def test_get_form_renderable(self):
            account = mommy.make('cradmin_gettingstarted.Account', account_name='Charisma')
            mommy.make(
                'cradmin_gettingstarted.AccountAdministrator',
                account=account,
                user=mommy.make(settings.AUTH_USER_MODEL)
            )
            mockresponse = self.mock_http200_getrequest_htmls(
                cradmin_role=account,
                viewkwargs={'pk': account.id}
            )
            self.assertTrue(mockresponse.selector.one('#id_account_name'))
            form_account_name = mockresponse.selector.one('#id_account_name').get('value')
            self.assertEqual(account.account_name, form_account_name)

        def test_post_without_required_account_name(self):
            account = mommy.make('cradmin_gettingstarted.Account', account_name='Charisma')
            mommy.make(
                'cradmin_gettingstarted.AccountAdministrator',
                account=account,
                user=mommy.make(settings.AUTH_USER_MODEL)
            )
            mockresponse = self.mock_http200_postrequest_htmls(
                cradmin_role=account,
                viewkwargs={'pk': account.id},
                requestkwargs={
                    'data': {
                        'account_name': ''
                    }
                }
            )
            self.assertTrue(mockresponse.selector.one('#id_account_name_wrapper'))
            warning_message = mockresponse.selector.one('#id_account_name_wrapper .test-warning-message').alltext_normalized
            self.assertEqual('This field is required.', warning_message)

        def test_post_with_required_account_name_updates_db(self):
            """Should get a 302 Found redirects and have one Account object in database with a new name"""
            account = mommy.make('cradmin_gettingstarted.Account', account_name='Charisma')
            mommy.make(
                'cradmin_gettingstarted.AccountAdministrator',
                account=account,
                user=mommy.make(settings.AUTH_USER_MODEL)
            )
            accounts_in_db = Account.objects.all()
            self.assertEqual(1, accounts_in_db.count())
            self.mock_http302_postrequest(
                cradmin_role=account,
                viewkwargs={'pk': account.id},
                requestkwargs={
                    'data': {
                        'account_name': 'The idol'
                    }
                }
            )
            accounts_in_db = Account.objects.all()
            self.assertEqual(1, accounts_in_db.count())
            get_account_from_db = Account.objects.filter(pk=account.id).get()
            self.assertEqual('The idol', get_account_from_db.account_name)
As you remember form earlier test, when we use methods such as
:meth:`django_cradmin.cradmin_testhelpers.TestCaseMixin.mock_http200_getrequest_htmls` we do not need to write an assert
equal for the status code, since this checked for us by CRadmin. Further the htmls lets us fetch tags using
CSS selectors. To pass the PK of our account we use the ``viewkwargs`` variable which passes the id of our account to
the view. Further does the variable ``requestkwargs`` set the data we want to pass with the form when pressing the save
button. In our case, this is just the name of the account. In the second test we want to check that a warning message
is displayed to the user if account name is empty. Here we use the htmls to fetch the value of a html tag with an id. In
the last test we count the number of Account objects in database before and after posting the form, and checks that our
account has been given the new name we passed with the form.

Create a new account
====================
First I want to clean up a bit in our project structur, both for my own sanity and for you who reads this guide so we
are on the same page. Keep in mind that we now want to make it possible for an account administrator to add a new
account to administrate. So our crapps need a name which reflects this. The project structur should now look something
like this after a refactor::

    cradmin_gettingstarted
        crapps
            account_adminui
                __init__.py (here is our urls)
                account_index_view.py
                edit_account_view.py
            __init__.py
        migrations
        templates
            cradmin_gettingstarted
                account_index.django.html
        tests
            test_account_adminut
                __init__.py
                test_account_index.py
                test_edit_account.py
            test_models
               __init__.py
                test_account.py
                test_account_administrator.py
        __init__.py
        admin.py
        gettingstarted_cradmin_instance.py
        models.py
If you now go to Django Admin, add another account for the same user and than go to "localhost/gettingstarted" in your
browser, you will see you now can choose which account you would like to edit. This page is created by CRadmin without
us doing anything else than a bit inheritance in our view. What I want to do is to have the option for a logged in user
to either choose an existing account or create a new account. For this we need to overwrite the template which now shows
the accounts which you administrate.












We begin by creating the file ``cradmin_question.py`` in the views folder of our ``polls`` app. In this file we
add this content::

    from django_cradmin import crapp
    from django_cradmin.viewhelpers import objecttable
    from polls import models


    class QuestionListView(objecttable.ObjectTableView):
        model = models.Question
        columns = ['question_text']

        def get_queryset_for_role(self, role):
            return models.Question.objects.all()


    class App(crapp.App):
        appurls = [
            crapp.Url(r'^$', QuestionListView.as_view(), name=crapp.INDEXVIEW_NAME)
        ]

This code snippet defines a :class:`django_cradmin.crapp.App`` instance with a :class:`django_cradmin.crapp.Url`
pointing to a :class:`django_cradmin.viewhelpers.objecttable.ObjectTableView`.

The ``App`` is essentially just a place where we define the urls for our cradmin views, and the ``ObjectTableView`` is a
view for presenting a list of objects as a table. In our ``ObjectTableView``, ``QuestionListView``, we define the bare
minimum for a ``ObjectTableView``:

 - ``model``: the Django model we read data from
 - :obj:`django_cradmin.viewhelpers.objecttable.ObjectTableView.columns`: what columns should each row contain. In this case
   we simply entered a model-value from ``Question``; ``question_text``.
 - :func:`django_cradmin.viewhelpers.objecttable.ObjectTableView.get_queryset_for_role()`: define the queryset that should be
   returned for the list.

You should now have a list of all questions in the database, but this is not particularily useful on its own, so
now it's time to add some functionality to our view!

Adding and editing objects
--------------------------
