from django.utils.translation import ugettext_lazy

from django_cradmin import renderable
from django_cradmin.viewhelpers.listfilter.base import abstractfilterlistchild


class Target(renderable.AbstractRenderableWithCss,
             abstractfilterlistchild.FilterListChildMixin):
    template_name = 'django_cradmin/viewhelpers/multiselect2/targetrenderables/target.django.html'
    default_target_dom_id = 'django_cradmin_multiselect2_select_target'

    def __init__(self, dom_id=None,
                 with_items_title=None,
                 submitbutton_text=None,
                 without_items_text=None):
        self.dom_id = dom_id
        self.with_items_title = with_items_title
        self.submitbutton_text = submitbutton_text
        self.without_items_text = without_items_text

    def get_dom_id(self):
        if self.dom_id:
            return self.dom_id
        else:
            return self.default_target_dom_id

    def get_with_items_title(self):
        if self.with_items_title:
            return self.with_items_title
        else:
            return ugettext_lazy('Selected items')

    def get_submit_button_text(self):
        if self.submitbutton_text:
            return self.submitbutton_text
        else:
            return ugettext_lazy('Submit selection')

    def get_without_items_text(self):
        if self.without_items_text:
            return self.without_items_text
        else:
            return ''

    def get_form_action(self, request):
        return request.get_full_path()

    def get_context_data(self, request=None):
        context = super(Target, self).get_context_data(request=request)
        context['form_action'] = self.get_form_action(request=request)
        return context


class ManyToManySelectTarget(Target):
    template_name = 'django_cradmin/viewhelpers/multiselect2/targetrenderables/manytomanyselect-target.django.html'
