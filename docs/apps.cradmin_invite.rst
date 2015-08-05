##################################################
`cradmin_invite` --- A generalized invite workflow
##################################################

The purpose of the :mod:`django_cradmin.apps.cradmin_invite` app is to provide a
general purpose invite workflow.

*******
Install
*******
Add the following to ``INSTALLED_APPS``::

    INSTALLED_APPS = (
        # ...
        'django_cradmin',
        'django_cradmin.apps.cradmin_generic_token_with_metadata',
        'django_cradmin.apps.cradmin_invite',
    )

Set the ``DJANGO_CRADMIN_SITENAME`` setting::

    DJANGO_CRADMIN_SITENAME = 'Testsite'


********
Tutorial
********
In this tutorial we will create a workflow/process that can be used to
invite a user to become administrator for a Site. Our example assumes
you have a Django app named ``myapp``.


The Site model
==============
Lets say we have the following model::

    from django.db import models
    from django.conf import settings

    class Site(models.Model):
        name = models.CharField(max_length=255)
        admins = models.ManyToManyField(settings.AUTH_USER_MODEL)


Create the invite email
=======================
Create a subclass of :class:`django_cradmin.apps.cradmin_invite.invite_url.InviteUrl`::

    from django_cradmin.apps.cradmin_invite.invite_url import InviteUrl

    class SiteAdminInviteUrl(InviteUrl):
        def get_appname(self):
            return 'myapp'

        def get_confirm_invite_url(self, generictoken):
            # URL of the AcceptSiteAdminInviteView shown below
            return reverse('siteadmin-invite-accept', kwargs={
                'token': generictoken.token
            })


And use it to send the invite email to ``test@example.com``::

    from django.views.generic import View
    from myapp.models import Site

    class CreateInviteView(View):
        def get(self, request):
            # NOTE: You will most likely want to put this code in a post() method
            #       and use a form as input.
            site = Site.objects.first()  # Code to get at Site object
            invite = SiteAdminInviteUrl(request=request, private=True, content_object=site)
            invite.send_email('test@example.com')

Notice that we add the ID of the site as metadata. We need this to know which site
to add the user accepting the invite to.


Create the view responsible for adding the user as admin
========================================================
Create a subclass of :class:`django_cradmin.apps.cradmin_invite.baseviews.AbstractAcceptInviteView`::

    from django.http import HttpResponseRedirect
    from django.shortcuts import get_object_or_404
    from django.conf import settings

    from django_cradmin.apps.cradmin_invite.baseviews.accept import AbstractAcceptInviteView
    from myapp.models import Site

    class AcceptSiteAdminInviteView(AbstractAcceptInviteView):
        description_template_name = 'myapp/invite_description.django.html'

        def get_appname(self):
            return 'myapp'

        def invite_accepted(self, generictoken):
            site = generictoken.content_object
            site.admins.add(self.request.user)
            messages.success(self.request, 'You are now admin on %(site)s' % {'site': site})
            return HttpResponseRedirect(settings.LOGIN_URL)


Add to urls
===========
Add the views to your url patterns::

    urlpatterns = patterns(
        # ...
        url(r'^siteadmin/invite/create$',
            CreateInviteView.as_view(),
            name="siteadmin-invite-accept"),
        url(r'^siteadmin/invite/accept/(?P<token>.+)$',
            AcceptSiteAdminInviteView.as_view(),
            name="siteadmin-invite-accept"),
        # ...
    )



***************************
Private vs public InviteUrl
***************************
See :meth:`~django_cradmin.apps.cradmin_invite.invite_url.InviteUrl.get_share_url`
and :meth:`~django_cradmin.apps.cradmin_invite.invite_url.InviteUrl.send_email`.


*******************
The InviteUrl class
*******************

.. autoclass:: django_cradmin.apps.cradmin_invite.invite_url.InviteUrl
    :members:



.. _invite_emailtemplates:

****************************************
Email templates and how to override them
****************************************
You can override the following templates:

cradmin_invite/email/subject.django.txt
    Override this to set the email subject.

cradmin_invite/email/message.django.txt
    Override this to change the email message.

All of the email templates get the following context variables:

- ``DJANGO_CRADMIN_SITENAME``: The value of the setting with the same name.
- ``activate_url``: The URL that users should click to activate their account.


*******************************************
UI messages/labels and how to override them
*******************************************

.. currentmodule:: django_cradmin.apps.cradmin_invite.baseviews.accept

You do not have to override the entire template to adjust
the text in the :class:`~.AbstractAcceptInviteView` UI.
We provide the following class methods for you to override:

.. autosummary::

    ~django_cradmin.apps.cradmin_invite.baseviews.accept.AbstractAcceptInviteView.get_pagetitle
    ~django_cradmin.apps.cradmin_invite.baseviews.accept.AbstractAcceptInviteView.get_description_template_name
    ~django_cradmin.apps.cradmin_invite.baseviews.accept.AbstractAcceptInviteView.get_accept_as_button_label
    ~django_cradmin.apps.cradmin_invite.baseviews.accept.AbstractAcceptInviteView.get_register_account_button_label
    ~django_cradmin.apps.cradmin_invite.baseviews.accept.AbstractAcceptInviteView.get_login_as_different_user_button_label
    ~django_cradmin.apps.cradmin_invite.baseviews.accept.AbstractAcceptInviteView.get_login_button_label


************************
The token error template
************************
When the token fails to validate because it has expired or because
the user does not copy the entire URL into their browser, we
respond with :meth:`~.AbstractAcceptInviteView.token_error_response`.
You normally do not want to override this method, but instead
override :obj:`~.AbstractAcceptInviteView.token_error_template_name`
or :meth:`~.AbstractAcceptInviteView.get_token_error_template_name`.

Instead of creating a completely custom template, you can extend
``cradmin_invite/accept/token_error.django.html`` and just
override the ``invalid_token_message`` and ``expired_token_message`` blocks:

.. sourcecode:: django

    {% extend "cradmin_invite/accept/token_error.django.html" %}
    {% load i18n %}

    {% block invalid_token_message %}
        {% trans "Invalid invite URL. Are you sure you copied the entire URL from the email?" %}
    {% endblock invalid_token_message %}

    {% block expired_token_message %}
        {% trans "This invite link has expired." %}
    {% endblock expired_token_message %}


**********************************
The AbstractAcceptInviteView class
**********************************

.. autoclass:: django_cradmin.apps.cradmin_invite.baseviews.accept.AbstractAcceptInviteView
    :members:


********
Settings
********

Required settings:
    DJANGO_CRADMIN_SITENAME
        The name of the site.
        You **must set this setting** unless you override the email subject
        and message templates as explained in :ref:`invite_emailtemplates`.


Optional settings:
    DJANGO_CRADMIN_INVITE_FROM_EMAIL
        Defaults to the ``DEFAULT_FROM_EMAIL`` setting.

