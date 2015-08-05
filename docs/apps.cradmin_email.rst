####################################################
`cradmin_email` --- Utilities for working with email
####################################################

The purpose of this app is to make it easier to work with email, especially
with HTML email.


*****
Usage
*****
Add ``django_cradmin.apps.cradmin_email`` to you ``INSTALLED_APPS``-setting.
See :class:`django_cradmin.apps.cradmin_email.emailutils.AbstractEmail` for example usage.


********
Settings
********
DJANGO_CRADMIN_EMAIL_SUBJECT_PREFIX
    Use this to specify a default prefix for email subjects send with
    :class:`django_cradmin.apps.cradmin_email.emailutils.AbstractEmail`.

DJANGO_CRADMIN_EMAIL_DEFAULT_CONTEXT_DATA
    Documented below.

DJANGO_CRADMIN_EMAIL_LOGO_HTML
    HTML for the logo in HTML emails. Used by the default email header template.
    More documentation below.

DJANGO_CRADMIN_EMAIL_BRANDNAME
    Use this to specify a brand name that you can use in your email
    templates. Used by the default email header template.


***************************
HTML email formatting guide
***************************
HTML formatting in email is **not** like formatting in browsers. You actually need to forget
more or less every good practice from the last 10 years of web development, and instead:

- Use tables for layout (yes, TABLES for layout).
- Avoid images. Many spam engines use the ratio between images and text, so do not
  use many images.
- Set styles directly on elements.


Our solution
============

To make this easier to handle, we suggest the following:

- For the actual content of your emails, use a single ``<p>``-element styled
  with a font suitable for your brand. Use ``<br>`` to emulate paragraphs,
  and keep the formatting to the ``<a>``, ``<strong>``, ``<em>`` and
  ``<big>`` tags.
- Use a common base template that styles the surrounding content for all
  your emails.

We make this easy to do by providing the ``cradmin_email/html_message_base.django.html``
template that you can extend in your html message templates:

- You just have to override the ``contents`` block.
- The template is styled via the ``DJANGO_CRADMIN_EMAIL_DEFAULT_CONTEXT_DATA`` setting.


Styling and tuning the html_message_base template
=================================================
The easiest thing to adjust is the styles. You do this via
the ``DJANGO_CRADMIN_EMAIL_DEFAULT_CONTEXT_DATA`` setting (a dict).
You can set the following values:

    body_style
        The styles of the body element. Note that gmail ignores this.

    outer_table_style
        The CSS styles of the outer table.

    common_paragraph_style
        Common styles for header, contents and footer.
        Make sure this ends with ``;``.
        Example::

            font-family: Arial, sans-serif;
            font-size: 16px;
            line-height: 1.42857143;
            letter-spacing: 0.5px;
            padding-left: 10px;
            padding-right: 10px;

    header_paragraph_style
        The CSS styles of the header block. This is a ``<p>`` element.

    contents_paragraph_style
        The CSS styles of the contents block. This is a ``<p>`` element.

    footer_paragraph_style
        The CSS styles of the footer block. This is a ``<p>`` element.

    header_td_style
        The CSS styles of the ``<td>``-element wrapping the header paragraph.

    contents_td_style
        The CSS styles of the ``<td>``-element wrapping the contents paragraph.

    footer_td_style
        The CSS styles of the ``<td>``-element wrapping the footer paragraph.

    link_style
        This is not used by the base template, but you should use it on all the links
        you create to make it easy to style your links. Example::

            <a href="http://example.com" style="{{ link_style }}">Go to example.com</a>

    footer_link_style
        This is not used by the base template, but you should use it on all the links
        you create in your footer template to make it easy to style your links. Example::

            <a href="http://example.com" style="{{ footer_link_style }}">Go to example.com</a>

    primary_button_link_style
        This is not used by the base template, but you should use it on all the
        primary button styled links you create to make it easy to style your links.
        Example::

            <a href="http://example.com" style="{{ primary_button_link_style }}">Go to example.com</a>

    secondary_button_link_style
        This is not used by the base template, but you should use it on all the
        secondary button styled links you create to make it easy to style your links.
        Example::

            <a href="http://example.com" style="{{ secondary_button_link_style }}">Go to example.com</a>

    logo_style
        Style for the logo. This is a ``<span>`` element. This element is
        rendered by the default header include template if you
        set the ``DJANGO_CRADMIN_EMAIL_LOGO_HTML`` setting.


*********
Templates
*********

cradmin_email/html_message_base.django.html
    The base template for all HTML emails. You should not need to
    override this, but just extend it in all your email templates.
    How to style this template via DJANGO_CRADMIN_EMAIL_DEFAULT_CONTEXT_DATA is
    described above.

cradmin_email/include/html_message_header.django.html
    Included ``cradmin_email/html_message_base.django.html`` to render the header.
    You can override this in one of your own apps - just ensure the app is listed
    before ``django_cradmin.apps.cradmin_email`` in ``INSTALLED_APPS``.

    The template should not need to be overridden if you can render
    your logo/header using HTML and CSS. You should instead adjust
    the ``logo_style``, ``header_paragraph_style`` and perhaps
    the ``header_td_style`` via the ``DJANGO_CRADMIN_EMAIL_DEFAULT_CONTEXT_DATA``
    setting.


************************************
Design/develop/debug email rendering
************************************
To make it easy to visually develop the email template, we provide
a view that you can add to your url config::

    url(r'^cradmin_email/', include('django_cradmin.apps.cradmin_email.urls')),

And go to one of these URLs to debug email rendering:

- http://lokalttest.net:8000/cradmin_email/emaildesign/
- http://lokalttest.net:8000/cradmin_email/emaildesign/plaintext

Remember to test that your styles are responsive, and try to test
with as many clients as possible. https://litmus.com/ is a good
solution for this.


*********
Resources
*********
- http://templates.mailchimp.com/getting-started/html-email-basics/
- http://webdesign.tutsplus.com/articles/build-an-html-email-template-from-scratch--webdesign-12770
- https://www.campaignmonitor.com/dev-resources/guides/coding/
- https://www.campaignmonitor.com/css/

***
API
***

.. currentmodule:: django_cradmin.apps.cradmin_email.emailutils
.. automodule:: django_cradmin.apps.cradmin_email.emailutils
    :members:
