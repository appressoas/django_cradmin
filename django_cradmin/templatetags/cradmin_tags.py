from __future__ import unicode_literals

import json

import django_cradmin
from django import template
from django.conf import settings
from django.contrib.staticfiles.templatetags.staticfiles import static
import warnings
from django.urls import reverse

from django_cradmin import crapp
from django_cradmin import crsettings
from django_cradmin.crinstance import reverse_cradmin_url

register = template.Library()


@register.simple_tag(takes_context=True)
def cradmin_titletext_for_role(context, role):
    """
    Template tag implementation of
    :meth:`django_cradmin.crinstance.BaseCrAdminInstance.get_titletext_for_role`.
    """
    request = context['request']
    cradmin_instance = request.cradmin_instance
    return cradmin_instance.get_titletext_for_role(role)


@register.assignment_tag(takes_context=True)
def cradmin_descriptionhtml_for_role(context, role):
    """
    Template tag implementation of
    :meth:`django_cradmin.crinstance.BaseCrAdminInstance.get_titletext_for_role`.
    """
    request = context['request']
    cradmin_instance = request.cradmin_instance
    return cradmin_instance.get_descriptionhtml_for_role(role)


@register.simple_tag(takes_context=True)
def cradmin_rolefrontpage_url(context, role):
    """
    Template tag implementation of
    :meth:`django_cradmin.crinstance.BaseCrAdminInstance.rolefrontpage_url`.
    """
    request = context['request']
    cradmin_instance = request.cradmin_instance
    return cradmin_instance.rolefrontpage_url(cradmin_instance.get_roleid(role))


@register.simple_tag(takes_context=True)
def cradmin_appurl(context, viewname, *args, **kwargs):
    """
    Template tag implementation of :meth:`django_cradmin.crapp.App.reverse_appurl`.

    Examples:

        Reverse the view named ``"edit"`` within the current app:

        .. code-block:: htmldjango

            {% load cradmin_tags %}

            <a href='{% cradmin_appurl "edit" %}'>Edit</a>

        Reverse a view with keyword arguments:

        .. code-block:: htmldjango

            {% load cradmin_tags %}

            <a href='{% cradmin_appurl "list" mode="advanced" orderby="name" %}'>
                Show advanced listing ordered by name
            </a>
    """
    request = context['request']
    return request.cradmin_app.reverse_appurl(viewname, args=args, kwargs=kwargs)


@register.simple_tag(takes_context=True)
def cradmin_appindex_url(context, *args, **kwargs):
    """
    Template tag implementation of :meth:`django_cradmin.crinstance.BaseCrAdminInstance.appindex_url`.

    Examples:

        Reverse index (frontpage) of current app:

        .. code-block:: htmldjango

            {% load cradmin_tags %}

            <a href='{% cradmin_appindex_url %}'>
                Go to pages-app
            </a>

        Reverse a view with keyword arguments:

        .. code-block:: htmldjango

            {% load cradmin_tags %}

            <a href='{% cradmin_appindex_url mode="advanced" orderby="name" %}'>
                Show advanced listing ordered by name
            </a>
    """
    request = context['request']
    return request.cradmin_app.reverse_appurl(
        viewname=crapp.INDEXVIEW_NAME, args=args, kwargs=kwargs)


@register.simple_tag(takes_context=True)
def cradmin_instance_appindex_url(context, appname, *args, **kwargs):
    """
    Template tag implementation of :meth:`django_cradmin.crinstance.BaseCrAdminInstance.appindex_url`.

    Examples:

        Reverse index (frontpage) of the ``"pages"`` app:

        .. code-block:: htmldjango

            {% load cradmin_tags %}

            <a href='{% cradmin_instance_appindex_url appname="pages" %}'>
                Go to pages-app
            </a>

        Reverse a view with keyword arguments:

        .. code-block:: htmldjango

            {% load cradmin_tags %}

            <a href='{% cradmin_instance_appindex_url appname="pages" mode="advanced" orderby="name" %}'>
                Show advanced listing ordered by name
            </a>
    """
    request = context['request']
    return request.cradmin_instance.reverse_url(
        appname=appname, viewname=crapp.INDEXVIEW_NAME, args=args, kwargs=kwargs)


@register.simple_tag(takes_context=True)
def cradmin_instanceindex_url(context, appname):
    warnings.warn("cradmin_instanceindex_url is deprecated. Use cradmin_instance_appindex_url instead.",
                  DeprecationWarning)
    return cradmin_instance_appindex_url(context, appname)


@register.simple_tag(takes_context=True)
def cradmin_instance_url(context, appname, viewname, *args, **kwargs):
    """
    Template tag implementation of :meth:`django_cradmin.crinstance.BaseCrAdminInstance.reverse_url`.

    Examples:

        Reverse the view named ``"edit"`` within the app named ``"pages"``:

        .. code-block:: htmldjango

            {% load cradmin_tags %}

            <a href='{% cradmin_instance_url appname="pages" viewname="edit" %}'>
                Edit
            </a>

        Reverse a view with keyword arguments:

        .. code-block:: htmldjango

            {% load cradmin_tags %}

            <a href='{% cradmin_instance_url appname="pages" viewname="list" mode="advanced" orderby="name" %}'>
                Show advanced pages listing ordered by name
            </a>
    """
    request = context['request']
    return request.cradmin_instance.reverse_url(
        appname=appname, viewname=viewname, args=args, kwargs=kwargs)


@register.simple_tag
def cradmin_instanceroot_url(instanceid):
    """
    Get the URL of the cradmin instance with the provided ``instanceid``.

    Args:
        instanceid: The :obj:`~django_cradmin.crinstance.BaseCrAdminInstance.id`
            if a :class:`django_cradmin.crinstance.BaseCrAdminInstance`.
    """
    return reverse(instanceid)


@register.simple_tag(takes_context=True)
def cradmin_instance_rolefrontpage_url(context):
    request = context['request']
    return request.cradmin_instance.rolefrontpage_url()


@register.simple_tag(takes_context=True)
def cradmin_url(context, instanceid=None, appname=None, roleid=None, viewname=crapp.INDEXVIEW_NAME, *args, **kwargs):
    """
    Template tag implementation of :meth:`django_cradmin.crinstance.reverse_cradmin_url`.

    Examples:

        Reverse the view named ``"edit"`` within the app named ``"pages"`` in the
        cradmin-instance with id ``"my_cradmin_instance"`` using roleid ``10``:

        .. code-block:: htmldjango

            {% load cradmin_tags %}

            <a href='{% cradmin_instance_url instanceid="my_cradmin_instance" appname="pages"
            roleid=10 viewname="edit" %}'>
                Edit
            </a>

        Reverse a view with keyword arguments:

        .. code-block:: htmldjango

            {% load cradmin_tags %}

            <a href='{% cradmin_instance_url instanceid="my_cradmin_instance" appname="pages"
            roleid=10 viewname="list" mode="advanced" orderby="name" %}'>
                Show advanced pages listing ordered by name
            </a>
    """
    if instanceid is None:
        request = context['request']
        instanceid = request.cradmin_instance.id
    return reverse_cradmin_url(
        instanceid=instanceid,
        appname=appname,
        roleid=roleid,
        viewname=viewname,
        args=args, kwargs=kwargs)


@register.filter
def cradmin_jsonencode(json_serializable_pythonobject):
    """
    Template filter that converts a json serializable object
    to a json encoded string.
    """
    return json.dumps(json_serializable_pythonobject)


@register.simple_tag(takes_context=True)
def cradmin_theme_staticpath(context):
    """
    """
    if 'request' in context:
        request = context['request']
        theme_path = None
        if hasattr(request, 'cradmin_instance'):
            theme_path = request.cradmin_instance.get_cradmin_theme_path()
            if theme_path:
                theme_path = str(theme_path)
        if not theme_path:
            theme_path = getattr(settings,
                                 'DJANGO_CRADMIN_THEME_PATH',
                                 'django_cradmin/{version}/styles/cradmin_theme_full/main.css'.format(
                                     version=django_cradmin.__version__
                                 ))
        return static(theme_path)
    else:
        raise Exception('The cradmin_theme_staticpath requires "request" to be in the template '
                        'context. You can get this using the "django.template.context_processors.request" '
                        'context processor.')


@register.simple_tag(takes_context=True)
def cradmin_render_renderable(context, renderable, include_context=False, **kwargs):
    """
    Render a :class:`django_cradmin.renderable.AbstractRenderable`.

    Unlike just using ``{{ renderable.render }}``, this
    sends the ``request`` into render (so this is the same
    as calling ``renderable.render(request=context['request'])``.

    Examples:

        Render a renderable named ``renderable`` in the current template context:

        .. code-block:: htmldjango

            {% load cradmin_tags %}

            {% cradmin_render_renderable renderable %}
    """
    request = context.get('request', None)
    full_kwargs = {}
    if include_context:
        full_kwargs['extra_context_data'] = context.flatten()
    full_kwargs.update(kwargs)
    return renderable.render(request=request, **full_kwargs)


@register.simple_tag
def cradmin_test_css_class(suffix):
    """
    Adds a CSS class for automatic tests. CSS classes added using this
    template tag is only included when the the :setting:`DJANGO_CRADMIN_INCLUDE_TEST_CSS_CLASSES`
    setting is set to ``True``.

    To use this template tag, you provide a ``suffix`` as input,
    and the output will be `` test-<suffix> ``. Notice that we
    include space before and after the css class - this means that you do not need to
    add any extra spaces within your class-attribute to make room for the
    automatic test only css class.

    Examples:

        Use the template tag to add test only css classes:

        .. code-block:: django

            {% load cradmin_tags %}

            <p class="paragraph paragraph--large{% cradmin_test_css_class 'introduction' %}">
                The introduction
            </p>

        Ensure that your test settings have ``DJANGO_CRADMIN_INCLUDE_TEST_CSS_CLASSES = True``.

        Write tests based on the test css class::

            from django import test
            import htmls

            class TestCase(test.TestCase):

                def test_introduction(self):
                    response = some_code_to_get_response()
                    selector = htmls.S(response.content)
                    with self.assertEqual(
                        'The introduction',
                        selector.one('test-introduction')

    Args:
        suffix: The suffix for your css class. The actual css class will be `` test-<suffix> ``.
    """
    include_test_css_classes = crsettings.get_setting('DJANGO_CRADMIN_INCLUDE_TEST_CSS_CLASSES', False)
    if include_test_css_classes:
        return '  test-{}  '.format(suffix)
    else:
        return ''
