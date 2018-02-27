from django_cradmin import uicontainer
from django_cradmin.viewhelpers import formview
from django_cradmin.demo.webdemo.models import Page

from . import mixins


class PageCreateUpdateMixin(object):
    model = Page
    roleid_field = 'site'
    fields = [
        'title',
        'intro',
        'body',
        'image',
        # 'publishing_time',
        # 'unpublish_time',
        'attachment',
        'internal_notes'
    ]

    def get_form_renderable(self):
        return uicontainer.layout.AdminuiPageSectionTight(
            children=[
                uicontainer.form.Form(
                    form=self.get_form(),
                    children=[
                        uicontainer.fieldwrapper.FieldWrapper('title'),
                        uicontainer.fieldwrapper.FieldWrapper('intro'),
                        uicontainer.fieldwrapper.FieldWrapper('body'),
                        # uicontainer.fieldwrapper.FieldWrapper('publishing_time'),
                        uicontainer.fieldset.FieldSet(
                            title='Advanced',
                            children=[
                                uicontainer.fieldwrapper.FieldWrapper('internal_notes'),
                            ]
                        ),
                        uicontainer.button.SubmitPrimary(
                            text='Save')
                    ]
                )
            ]
        ).bootstrap()


class PageCreateView(PageCreateUpdateMixin, formview.WithinRoleCreateView):
    """
    View used to create new pages.
    """


class PageUpdateView(mixins.PagesQuerySetForRoleMixin, PageCreateUpdateMixin, formview.WithinRoleUpdateView):
    """
    View used to create edit existing pages.
    """


# class PreviewPageView(TemplateView):
#     template_name = 'webdemo/pages/preview.django.html'
#
#     def __get_page(self):
#         if self.kwargs['pk'] is None:
#             return PageCreateView.get_preview_data(self.request)
#         else:
#             # NOTE: The queryset ensures only admins on the current site gains access.
#             site = self.request.cradmin_role
#             return get_object_or_404(Page.objects.filter(site=site), pk=self.kwargs['pk'])
#
#     def get_context_data(self, **kwargs):
#         context = super(PreviewPageView, self).get_context_data(**kwargs)
#         context['page'] = self.__get_page()
#         return context


class PageDeleteView(mixins.PagesQuerySetForRoleMixin, formview.WithinRoleDeleteView):
    """
    View used to delete existing pages.
    """
