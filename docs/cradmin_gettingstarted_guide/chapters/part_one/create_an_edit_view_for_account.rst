.. _create_an_edit_view_for_account:

Create an Edit View for Account
===============================
The main goal for this part of the tutorial is to create functionality which allows us to change the name of an existing
account. We're goning to use a mixin class which holds our form and uses CRadmin uicontainer to render the form. Further
will our view class have a super class from CRadmin. As mentioned earlier there are different formview classes in
CRadmin which extends Djangos views. When we want to edit an account, the view is a subclass of the CRadmin class
``WithinRoleUpdateView``. This view is a modelform view.


Since we now have more than one file inside our CRadmin application(crapps) module, it is time to create a new module
within our `crapps` module, and call it `account_adminui`. Put ``__init__.py`` file with our urls and the file
``account_dashboard_view.py`` inside the new module. Rerun all tests to be sure everyting works as intended with the new
crapps structure::

    cradmin_gettingstarted
        crapps
            account_adminui
                __init__.py
                account_dashboard_view.py
                edit_account_view.py
                mixins.py
            __init__.py

Mixins
------
In our mixins file we import uicontainer and formview from CRadmin, and render a form based on the Account class. We
also needs to tell CRadmin the role, which in our case is Account. The mixin file will look something like this::

    from django_cradmin import uicontainer
    from django_cradmin.viewhelpers import formview


    class AccountCreateUpdateMixin(object):
        model = Account
        roleid_field = 'account'
        fields = [
            'name'
        ]

        def get_form_renderable(self):
            return uicontainer.layout.AdminuiPageSectionTight(
                children=[
                    uicontainer.form.Form(
                        form=self.get_form(),
                        children=[
                            uicontainer.fieldwrapper.FieldWrapper('name'),
                            uicontainer.button.SubmitPrimary(
                                text='Save')
                        ]
                    )
                ]
            ).bootstrap()

The View
--------
The file ``edit_account_view.py`` overrides the method `get_queryset_for_role` where we filter on the pk of the current
CRadmin role. Since our CRadmin role is account, you could argue that we filter on the pk for the account we are
currently lookin at. The ``edit_account_view.py`` file looks something like ::

    class AccountUpdateView(mixins.AccountCreateUpdateMixin, formview.WithinRoleUpdateView):
        """"""
        def get_queryset_for_role(self):
            return Account.objects.filter(id=self.request.cradmin_role.pk)

The url
-------
We add a new url in the ``__init__.py`` file inside our account adminui crapps::

    class App(crapp.App):
        appurls = [
            crapp.Url(
                r'^$',
                account_dashboard.AccountDashboardView.as_view(),
                name=crapp.INDEXVIEW_NAME
            ),
            crapp.Url(
                r'^edit/(?P<pk>\d+)$',
                edit_account.AccountUpdateView.as_view(),
                name='edit'
            )
        ]

The template
------------
We do not create a new template for this edit view, but rather use the built-in CRadmin template. So in our
``account_dashboard.django.html`` file we add a new blocklist section after the one which gives the name for the account
administrator. To make our button work we need to tell the `href` to look for a view within the current CRadmin
instance. This is done by using Django template tags syntax. We also pass along the id of the current account as the
pk, which is accessible from the `get_context_data` method in our ``account_dashboard_view.py`` file. A full explenation
about CRadmin template tags can be read at :ref:`cradmin_tags` ::

    <section class="blocklist__item">
        <h2 class="blocklist__itemtitle">Edit Account</h2>
        <a href='{% cradmin_appurl viewname="edit" pk=account.id %}' class="button  button--primary">
            Change name
        </a>
    </section>

This is all the code neded to be able to change the account name in our edit view. Before we start testing, it is again
time to look at the clock and see if you have been infront of the screen for 60 minutes. If yes, take som fresh air and
stretch those legs of yours.

Test Edit Account View
----------------------
There are several scenarios which you could test for an edit view. We are going to test three of those. First if the
form is rendered with the name of the current account. Second, we try to post the form but leave the new account name
empty. This means we should get a response code of 200. Finally we post the form with a new account name for the current
Account object. Here we should get a 302 Found redirects response.

We need to set the account id as a pk when testing, and this is done with ``viewkwargs``. Further we
need to pass the account name when we post the form, and this is done with ``requestkwargs``. Beside this there is
nothing new in our test methods. Our file ``test_edit_account.py`` looks something like this.::

    from django.conf import settings
    from django.test import TestCase
    from model_mommy import mommy

    from django_cradmin import cradmin_testhelpers


    class TestUpdateAccountView(TestCase, cradmin_testhelpers.TestCaseMixin):
        viewclass = edit_account_view.AccountUpdateView

        def test_get_form_renderable(self):
            account = mommy.make(
                'cradmin_gettingstarted.Account',
                name='Charisma'
            )
            mommy.make(
                'cradmin_gettingstarted.AccountAdministrator',
                account=account,
                user=mommy.make(settings.AUTH_USER_MODEL)
            )
            mockresponse = self.mock_http200_getrequest_htmls(
                cradmin_role=account,
                viewkwargs={'pk': account.id}
            )
            self.assertTrue(mockresponse.selector.one('#id_name'))
            form_name = mockresponse.selector.one('#id_name').get('value')
            self.assertEqual(account.name, form_name)

        def test_post_without_required_name(self):
            account = mommy.make(
                'cradmin_gettingstarted.Account',
                name='Charisma'
            )
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
                        'name': ''
                    }
                }
            )
            self.assertTrue(mockresponse.selector.one('#id_name_wrapper'))
            warning_message = mockresponse.selector.one('#id_name_wrapper .test-warning-message').alltext_normalized
            self.assertEqual('This field is required.', warning_message)

        def test_post_with_required_name_updates_db(self):
            """Should get a 302 Found redirects and have one Account object in database with a new name"""
            account = mommy.make(
                'cradmin_gettingstarted.Account',
                name='Charisma'
            )
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
                        'name': 'The idol'
                    }
                }
            )
            accounts_in_db = Account.objects.all()
            self.assertEqual(1, accounts_in_db.count())
            get_account_from_db = Account.objects.filter(pk=account.id).get()
            self.assertEqual('The idol', get_account_from_db.name)

Since we changed the structure in our crapps module, I have updated the structur of the tests module, so it now looks
like this::

    tests
        test_crapps
            test_account_adminui
                __init__.py
                test_account_dashboard_view.py
                test_edit_account_view.py
            __init__.py
        test_models
            __init__.py
            test_account.py
            test_account_administrator.py
        __init__.py
        test_account_admin_cradmin_instance.py

Next Chapter
------------
TODO