from __future__ import unicode_literals
from django.utils.translation import ugettext_lazy as _
from django.views.generic import ListView
from django.http import HttpResponseRedirect

from django_cradmin.registry import cradmin_instance_registry


class RoleSelectView(ListView):
    paginate_by = 30
    template_name = 'django_cradmin/roleselect.django.html'
    context_object_name = 'roles'
    pagetitle = _('What would you like to edit?')
    autoredirect_if_single_role = True
    list_cssclass = 'django-cradmin-roleselect-list django-cradmin-roleselect-list-flat'

    def get_queryset(self):
        cradmin_instance = cradmin_instance_registry.get_current_instance(self.request)
        return cradmin_instance.get_rolequeryset()

    def get(self, *args, **kwargs):
        cradmin_instance = cradmin_instance_registry.get_current_instance(self.request)
        if self.get_autoredirect_if_single_role() and self.get_queryset().count() == 1:
            only_role = self.get_queryset().first()
            return HttpResponseRedirect(cradmin_instance.rolefrontpage_url(
                cradmin_instance.get_roleid(only_role)))
        else:
            # Add cradmin_instance to request just like django_cradmin.decorators.cradminview.
            # Convenient when overriding standalone-base.django.html and using the current
            # CrInstance to distinguish multiple crinstances.
            self.request.cradmin_instance = cradmin_instance
            return super(RoleSelectView, self).get(*args, **kwargs)

    def get_autoredirect_if_single_role(self):
        return self.autoredirect_if_single_role

    def get_pagetitle(self):
        return self.pagetitle

    def get_list_cssclass(self):
        return self.list_cssclass

    def get_context_data(self, **kwargs):
        context = super(RoleSelectView, self).get_context_data(**kwargs)
        context['pagetitle'] = self.get_pagetitle()
        context['list_cssclass'] = self.get_list_cssclass()
        return context
