Enhance our Index View
======================
So far our index view does very little, so lets expand it by fetching the Account and the user which is the Account
Administrator and get this as context data used in our template. We use our `cradmin_role` to get the Account object.
Further we use the CRadmin role of the current account to get the Account Administrator.

Our ``account_dashboard.py`` file now looks something like this::

    from django_cradmin.demo.cradmin_gettingstarted.models import Account
    from django_cradmin.viewhelpers.generic import WithinRoleTemplateView


    class AccountDashboardView(WithinRoleTemplateView):
        template_name = 'cradmin_gettingstarted/account_dashboard.django.html'

        def _get_account_administrator(self):
            account = self.request.cradmin_role
            return AccountAdministrator.objects.get(account=account)

        def get_context_data(self, **kwargs):
            context = super(AccountDashboardView, self).get_context_data()
            context['account_admin'] = self._get_account_administrator()
            context['account'] = self.request.cradmin_role
            return context

Test the View and Expand the Template
-------------------------------------
Now that we have written some more code, it is time to do some testing. Oh yeah, if you now have been infront of your
screen for the last 60 minutes, please do stretch your legs and get some fresh air before continuing.

In these tests we are gonna do one test which is more or less the same test as we did when checking the templates title.
The reason why we do almost the same test one more time is to show some of the smooth functionality in CRadmin. We are
gonna use the ``cradmin_test_css_class`` which is CSS classes only shown in a test environment. In the page cover title
block which we soon add to our template, CRadmin has already added a test css class for us, named `test-primary-h1`.
Another CRadmin test functionality we are going to use is the ``mock_http200_getrequest_htmls``. This method does two
things which we want to point out at this time. First, it automaticly assert the status code, so if we get any other
status code than 200 give a test failure. Second, we do not need to say `htmls_selector=True` since is implemented in
the method.

First we add a page cover title block in our template::

    {% extends "django_cradmin/base.django.html" %}
    {% load cradmin_tags %}

    {% block title %}
        {{ request.cradmin_role.name }}
    {% endblock title %}

    {% block page-cover-title %}
        {{ request.cradmin_role.name }}
    {% endblock page-cover-title %}

Then in our ``test_account_dashboard.py`` file we add a method which tests if we fetch the account name and sets it as a
primary heading::

    def test_get_heading(self):
        account = mommy.make(
            'cradmin_gettingstarted.Account',
            name='Test Account'
        )
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
        self.assertEqual(account.name, heading)

If you use the prettyprint() functionality as explained in the first test, you will see there is a CSS class named
`test-primary-h1`. In the test we first checks that this CSS class exists, so we konw that the loading of CRadmin tags
works as intended in our template. Then we remove whitespaces and strips the string by normalizing the text. Last we
check if the normalized text from the template is equal to the account name.

Now let us add a blocklist item to our template in the content block. We are using CRadmin CSS classes to get a good
admin layout. Further we add a `cradmin_test_css_class` which we are going to use in our test when we check if the
users email is equal to the account administrator's email. We expand our ``account_dashboard.django.html`` file with the
following::

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

In the ``test_account_dashboard`` file we can now write a test where only one of two users email should show in the template
::

    def test_only_account_where_user_is_admin_shows_on_page(self):
        account_one = mommy.make(
            'cradmin_gettingstarted.Account',
            name='Wrong role account'
        )
        account_two= mommy.make(
            'cradmin_gettingstarted.Account',
            name='Right role account'
        )
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