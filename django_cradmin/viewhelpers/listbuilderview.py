from django.views.generic import ListView
from django_cradmin.viewhelpers import listbuilder


class ListBuilderView(ListView):
    """
    View using the :doc:`viewhelpers_listbuilder`.

    Examples:

        Minimal::

            class MyView(listbuilderview.ListBuilderView):
                def get_queryset(self):
                    return MyModel.objects.all()

    """
    listbuilder_class = listbuilder.base.List
    value_renderer_class = listbuilder.base.ItemValueRenderer
    frame_renderer_class = None
    # template_name = ''  # TODO

    def get_listbuilder_class(self):
        return self.listbuilder_class

    def get_listbuilder_list_kwargs(self):
        return {}

    def get_value_renderer_class(self):
        return self.value_renderer_class

    def get_frame_renderer_class(self):
        return self.frame_renderer_class

    def get_listbuilder_list(self, context):
        items = context['object_list']
        return self.get_listbuilder_class().from_value_iterable(
            value_iterable=items,
            value_renderer_class=self.get_value_renderer_class(),
            frame_renderer_class=self.get_frame_renderer_class(),
            **self.get_listbuilder_list_kwargs())

    def get_context_data(self, **kwargs):
        context = super(ListBuilderView, self).get_context_data(**kwargs)
        context['listbuilder_list'] = self.get_listbuilder_list(context)
        return context
