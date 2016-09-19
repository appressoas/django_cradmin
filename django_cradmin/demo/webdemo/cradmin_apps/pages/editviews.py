from django_cradmin import uicontainer
from django_cradmin.viewhelpers import formview
from django_cradmin.demo.webdemo.models import Page

from . import mixins


class PageCreateUpdateMixin(object):
    model = Page
    roleid_field = 'site'
    enable_modelchoicefield_support = True
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

    # def get_preview_url(self):
    #     return self.request.cradmin_app.reverse_appurl('preview')
    #
    # def _get_image_selectview_url(self):
    #     return self.request.cradmin_instance.reverse_url('imagearchive', 'singleselect')

    # def get_form(self, form_class=None):
    #     form = super(PageCreateUpdateMixin, self).get_form(form_class=form_class)
    #     # form.fields['body'].widget = WysiHtmlTextArea(attrs={})
    #     form.fields['body'].widget = AceMarkdownWidget()
    #     preview = '<p class="text-muted">(No image selected)</p>'
    #     if self.object and self.object.image:
    #         preview = self.object.image.get_preview_html(request=self.request)
    #     form.fields['image'].widget = ModelChoiceWidget(
    #         queryset=ArchiveImage.objects.filter_owned_by_role(self.request.cradmin_role),
    #         preview=preview,
    #         selectview_url=self._get_image_selectview_url()
    #     )
    #     form.fields['publishing_time'].widget = DateTimePickerWidget(
    #         # minimum_datetime=datetime(2014, 8, 14, 12, 30),
    #         minimum_datetime=timezone.now(),
    #         maximum_datetime=datetime(2030, 12, 5, 21, 40),
    #         required=False
    #     )
    #     form.fields['unpublish_time'].widget = DatePickerWidget(
    #         no_value_preview_text='No date selected')
    #     # form.fields['unpublish_time'].widget = DateTimePickerWidget(
    #     #     no_value_preview_text='No date selected')
    #     form.fields['attachment'].widget = filewidgets.ImageWidget(request=self.request)
    #     # form.fields['attachment'].widget = filewidgets.FileWidget()
    #     return form

    def get_form_renderable(self):
        return uicontainer.layout.PageSectionTight(
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


class PageCreateView(PageCreateUpdateMixin, formview.CreateView):
    """
    View used to create new pages.
    """


class PageUpdateView(mixins.PagesQuerySetForRoleMixin, PageCreateUpdateMixin, formview.UpdateView):
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


class PageDeleteView(mixins.PagesQuerySetForRoleMixin, formview.DeleteView):
    """
    View used to delete existing pages.
    """
