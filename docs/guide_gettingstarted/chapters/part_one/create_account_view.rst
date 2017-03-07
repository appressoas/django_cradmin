Create Account View
===================
In our view for creating a new account we use the same modelform as for editing an account, thus inheriting from the
`AccountCreateUpdateMixin`. Furthermore we also inherit from `WithinRoleCreateView`. We set the `roleid_field` here to
`create_account` which is the id to the CRadmin instance for create account. The first method is overriding the
`save_object` method and here we create and save an AccountAdministrator at the same time as an Account is created.
Now in the method `get_success_url` we want to be taken to the ``AccountDashboardView``. This view lives inside our
other CRadmin instance, so we need to return the `reverse_cradmin_url` and pass along the cradmin instance id of where
we want to go and which app within the Cradmin instance we want to go to. Since we want to go to a place which demands a
role, we also pass the role id. When doing this, we can go from one CRadmin instance without a role to another CRadmin
instance which have a role. ::

    from django_cradmin.crinstance import reverse_cradmin_url
    from django_cradmin.viewhelpers import formview


    class CreateAccountView(mixins.AccountCreateUpdateMixin, formview.WithinRoleCreateView):
        roleid_field = 'create_account'
        template_name = 'cradmin_gettingstarted/crapps/create_account/create_account.django.html'

        def save_object(self, form, commit=True):
            self.new_account = super(CreateAccountView, self).save_object(form, commit)
            account_administrator = AccountAdministrator(
                user=self.request.user,
                account=self.new_account
            )
            account_administrator.full_clean()
            account_administrator.save()
            return self.new_account

        def get_success_url(self):
            return reverse_cradmin_url(
                instanceid='account_admin',
                appname='account_admin',
                roleid=self.new_account.id
            )

Create Account Template
-----------------------
You can use the template provided from CRadmin, or if you want to change one or more elements in the template you can
create a html file which extends ``django_cradmin/viewhelpers/formview/within_role_create_view.django.html``. I wanted
to override the brand name in header and replace it with something which made a tad more sense for our application. ::

    {% extends "django_cradmin/viewhelpers/formview/within_role_create_view.django.html" %}

    {% block header %}
        <header id="id_django_cradmin_page_header" class="adminui-page-header">
            <div class="adminui-page-header__content">
                <span class="adminui-page-header__brand">
                    <span class="adminui-page-header__brandname">
                        Getting started
                    </span>
                </span>
            </div>
        </header>
    {% endblock header %}

If you just want to override the page heading you would rather override the method `get_pageheading` in our view class
``create_account_view``. For a full explenation about the methods which you can override for a form template, look
at the files in the folder ``viewhelpers/formview``.

I have restructred our template folder so it better matches our crapps structure. ::

    templates
        cradmin_gettingstarted
            crapps
                account_adminui
                    account_dashboard.django.html
                create_account
                    create_account.django.html
                    create_account_dashboard.django.html

Test Create Account View
------------------------
We write two tests for our `create account view` in a new file named ``test_create_account_view`` within our module
``test_create_account``. One test is to see if the form renders as intended and one test which checks that a new
instance of the Account object is saved once in the database with the name we entered in the form. When passing along
form data in CRadmin tests, we use the `requestkwargs` as shown below.
::

    import mock
    from django.conf import settings
    from django.test import TestCase
    from model_mommy import mommy

    from django_cradmin import cradmin_testhelpers
    from django_cradmin.demo.cradmin_gettingstarted.models import Account


    class TestCreateAccountView(TestCase, cradmin_testhelpers.TestCaseMixin):
        viewclass = create_account_view.CreateAccountView

        def test_get_render_form(self):
            mockrespone = self.mock_http200_getrequest_htmls()
            self.assertEqual(mockrespone.selector.one('#id_name_label').text_normalized, 'Account name')

        def test_post_form(self):
            self.mock_http302_postrequest(
                requestkwargs={
                    'data': {
                        'name': 'Flaming Youth'
                    }
                }
            )
            account_in_db = Account.objects.all()
            new_account = Account.objects.filter(name='Flaming Youth').get()
            self.assertEqual(1, account_in_db.count())
            self.assertEqual('Flaming Youth', new_account.name)

Add Links in Template
---------------------
The last thing we need to do before moving on to next part of this guide is to add some links in our templates so a user
can move a little bit back and forth. In the demo `Webdemo` we show you how to create menues with CRadmin. So we are
going to use the `a` -tag styled as buttons and using our CRadmin instances as `href`.

Lets start with the template ``create_account_dashboard.django.html``. We add two buttons under the users email. The
first button takes the user to a view within the current CRadmin instance by using the template tag
``cradmin_appurl 'view name'``. ::

    <a class="button button--secondary-fill button--compact href="{% cradmin_appurl 'create_account' %}">
        Create new Account
    </a>

The second link to be added is going to take the user to our other CRadmin instance. To make this happen we use the
template tag ``cradmin_instanceroot_url instanceid=''``. We can take the user to the root of the CRadmin instance
`account_admin` which will either display a list of accounts to choose from or the administrator page for an account if
the user has just one account. ::

   <a class="button button--secondary-fill button--compact"
       href="{% cradmin_instanceroot_url instanceid='account_admin'%}">
        My Accounts
    </a>

The other template we need to add links to is the ``account_dashboard.django.html`` file. Here we need to take the user
from the CRadmin instance `account_admin` to the CRadmin instance `create_account`. There are several places to put this
link. I just added it underneath the account name, in the page cover content block. ::

    {% block page-cover-content %}
        {{ block.super }}
        <a class="button button--compact"
           href="{% cradmin_instanceroot_url instanceid='create_account' %}">
            Back to start page
        </a>
    {% endblock %}