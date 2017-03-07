.. _delete_account:

Delete Account
==============
The last view we're creating in this first part of our getting started tutorial is a delete view. This works pretty much
just like a modelclass delete view in Django, just enhanced with the role based access control. So in our ``__ini__.py``
file within our ``account_admin`` crapps, we add the url. ::

    crapp.Url(
            r'^delete/(?P<pk>\d+)$',
            delete_account_view.AccountDeleteView.as_view(),
            name='delete'
        )

Delete Account View
-------------------
Next we create a ``delete_account_view.py`` file in the same crapps. Here we use the ``get_object`` method from the
``SingleObjectMixin`` class, which requires that we pass the value for a queryset to have the right signature to get
the Account object we want to delete. Further we implement the abstract method ``get_queryset_for_role`` from the super
class. Both methods returns the same object, so you can actually pass the ``get_queryset_for_role`` method in this
example. However, this may not always be the case. Further we need to take the user to a valid page after deletion of an
accont. If we take the user to the index of our create account CRadmin instance, the user can create a new account or
choose an exisiting. First we import ``reverse_cradmin_url``. Second we override the method ``get_success_url``. Here
we return the ``reverse_cradmin_url`` and pass along the id of the CRadmin instance and the name of the application we
want to go to after deletion. Since this CRadmin instance don't require a role, there is no need to pass along a role
id. ::

    from django_cradmin.crinstance import reverse_cradmin_url
    from django_cradmin.viewhelpers import formview


    class AccountDeleteView(formview.WithinRoleDeleteView):
        """"""
        model = Account

        def get_object(self, queryset=None):
            return self.request.cradmin_role

        def get_queryset_for_role(self):
            return Account.objects.filter(id=self.request.cradmin_role.pk)

        def get_success_url(self):
            return reverse_cradmin_url(instanceid='create_account', appname='dashboard')

Delete Account Template
-----------------------
After creating the view we move on to the template file ``account_dashboard.django.html`` and add a button so the user
can delete an Account. ::

    <section class="blocklist__item">
        <h2 class="blocklist__itemtitle">Edit Account</h2>
        <a class="button button--primary button--compact"
           href='{% cradmin_appurl viewname="edit" pk=account.id %}'>
            Change name
        </a>
        <a class="button button--secondary button--compact"
           href="{% cradmin_appurl viewname='delete' pk=account.id %}">
            Delete
        </a>
    </section>

Test Delete Account View
------------------------
Finally we write some tests to check that our new functionality works as intended. We need three sanity checks and
two tests for the success url. The first sanity test confirm that the name of our Account is shown in a get request.
The second sanity test is for deleting an Account when the there is just one Account in the database. The third sanity test checks if the right Account is deleted when we have a database with
multiple instances of the Account object.

The first test of the url after a successfull deletion checks if everything works out fine when there is one account.
The second tests is the same but the user has three accounts and we delete one of them. Now in these two tests we use
``response['location']`` to check that the response header field named location is equal to what we pass in the
reverse CRadmin url of a CRadmin instance. ::

    from django.conf import settings
    from django.test import TestCase
    from model_mommy import mommy

    from django_cradmin import cradmin_testhelpers


    class TestDeleteAccountView(TestCase, cradmin_testhelpers.TestCaseMixin):
        viewclass = delete_account_view.AccountDeleteView

        def test_get_sanity(self):
            account = mommy.make(
                'cradmin_gettingstarted.Account',
                name='My Account'
            )
            mockresponse = self.mock_http200_getrequest_htmls(
                cradmin_role=account,
            )
            self.assertTrue(mockresponse.selector.one('#id_deleteview_question'))
            delete_question = mockresponse.selector.one('#id_deleteview_question').alltext_normalized
            self.assertEqual('Are you sure you want to delete "My Account"?', delete_question)

        def test_post_sanity_with_one_account(self):
            account = mommy.make(
                'cradmin_gettingstarted.Account',
                name='Another Account'
            )
            self.assertEqual(1, Account.objects.count())
            self.mock_http302_postrequest(
                cradmin_role=account
            )
            self.assertEqual(0, Account.objects.count())

        def test_post_sanity_with_multiple_accounts(self):
            account = mommy.make(
                'cradmin_gettingstarted.Account',
                name='Delete me'
            )
            mommy.make(
                'cradmin_gettingstarted.Account',
                _quantity=10
            )
            self.assertEqual(11, Account.objects.count())
            self.mock_http302_postrequest(
                cradmin_role=account
            )
            self.assertFalse(Account.objects.filter(name='Delete me'))
            self.assertEqual(10, Account.objects.count())

        def test_success_url_after_delete_when_one_account(self):
            account = mommy.make(
                'cradmin_gettingstarted.Account',
                name='Delete me'
            )
            mommy.make(
                'cradmin_gettingstarted.AccountAdministrator',
                account=account,
                user=mommy.make(settings.AUTH_USER_MODEL)
            )
            mockresponse = self.mock_http302_postrequest(cradmin_role=account)
            self.assertEqual(mockresponse.response['location'],
                             crinstance.reverse_cradmin_url(instanceid='create_account',
                                                            appname='dashboard'))

        def test_success_url_after_delete_when_three_accounts_for_one_admin(self):
            account_one = mommy.make('cradmin_gettingstarted.Account')
            account_two = mommy.make('cradmin_gettingstarted.Account')
            account_three = mommy.make('cradmin_gettingstarted.Account')
            user = mommy.make(settings.AUTH_USER_MODEL)
            mommy.make(
                'cradmin_gettingstarted.AccountAdministrator',
                account=account_one,
                user=user
            )
            mommy.make(
                'cradmin_gettingstarted.AccountAdministrator',
                account=account_two,
                user=user
            )
            mommy.make(
                'cradmin_gettingstarted.AccountAdministrator',
                account=account_three,
                user=user
            )
            mockresponse = self.mock_http302_postrequest(cradmin_role=account_two)
            self.assertEqual(mockresponse.response['location'],
                             crinstance.reverse_cradmin_url(instanceid='create_account',
                                                            appname='dashboard'))

The last test to do now is to run all our tests, to make sure everything we have created works together. If we run all
our tests with Coverage, we also see how much of our code which is actually tested by our TestCases.

Next Chapter
------------
TODO