from django import template
from django.template.loader import render_to_string

from django_cradmin.registry import cradmin_instance_registry


register = template.Library()


@register.simple_tag(takes_context=True)
def cradmin_titletext_for_role(context, role):
    """
    Template tag implementation of
    :meth:`django_cradmin.crinstance.BaseCrAdminInstance.get_titletext_for_role`.
    """
    request = context['request']
    cradmin_instance = cradmin_instance_registry.get_current_instance(request)
    return cradmin_instance.get_titletext_for_role(role)


@register.assignment_tag(takes_context=True)
def cradmin_descriptionhtml_for_role(context, role):
    """
    Template tag implementation of
    :meth:`django_cradmin.crinstance.BaseCrAdminInstance.get_titletext_for_role`.
    """
    request = context['request']
    cradmin_instance = cradmin_instance_registry.get_current_instance(request)
    return cradmin_instance.get_descriptionhtml_for_role(role)


@register.simple_tag(takes_context=True)
def cradmin_rolefrontpage_url(context, role):
    """
    Template tag implementation of
    :meth:`django_cradmin.crinstance.BaseCrAdminInstance.rolefrontpage_url`.
    """
    request = context['request']
    cradmin_instance = cradmin_instance_registry.get_current_instance(request)
    return cradmin_instance.rolefrontpage_url(cradmin_instance.get_roleid(role))


@register.simple_tag(takes_context=True)
def cradmin_appurl(context, viewname, *args, **kwargs):
    """
    Template tag implementation of :meth:`django_cradmin.crapp.App.reverse_appurl`.
    """
    request = context['request']
    return request.cradmin_app.reverse_appurl(viewname, args=args, kwargs=kwargs)


@register.simple_tag(takes_context=True)
def cradmin_render_menu(context):
    """
    Template tag that renders the cradmin menu.

    We use this instead of an include tag to handle some issues
    with mocking tests.
    """
    request = context['request']
    if hasattr(request, 'cradmin_instance'):
        menu_template_name = request.cradmin_instance.get_menu_template_name()
        # isinstance(menu_template_name, basestring) is to make the
        # cradmin_instance easier to mock. Without this, we would have
        # to mock __getitem__ of cradmin_instance for all tests of
        # views with the menu (basically all apps).
        if menu_template_name and isinstance(menu_template_name, basestring):
            return render_to_string(menu_template_name, context)
    return ''
