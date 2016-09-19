from django.utils.translation import ugettext_lazy as _
from django_cradmin import crapp


class FormViewMixin:
    """
    Mixin class for form views.

    See :class:`.FormView` for a ready to use view that uses this mixin,
    and see :class:`.PreviewMixin` (the superclass of this class) for docs
    on how to add previews.
    """

    #: Get the view name for the listing page.
    #: You can set this, or implement :meth:`.get_listing_url`.
    #: Defaults to :obj:`django_cradmin.crapp.INDEXVIEW_NAME`.
    listing_viewname = crapp.INDEXVIEW_NAME

    #: The save submit label. See :meth:`~.FormViewMixin.get_submit_save_label`.
    submit_save_label = _('Save')

    #: The save submit label. See :meth:`~.FormViewMixin.get_submit_save_and_continue_edititing_label`.
    submit_save_and_continue_edititing_label = _('Save and continue editing')

    #: See :meth:`~.FormViewMixin.get_submit_save_button_name`.
    submit_save_button_name = 'submit-save'

    #: See :meth:`~.FormViewMixin.get_submit_save_and_continue_edititing_button_name`.
    submit_save_and_continue_edititing_button_name = 'submit-save-and-continue-editing'

    def get_pagetitle(self):
        """
        Get the page title (the title tag).
        """
        return ''

    def get_pageheading(self):
        """
        Get the page heading.

        Defaults to :meth:`.get_pagetitle`.
        """
        return self.get_pagetitle()

    def get_submit_save_label(self):
        """
        Get the save submit label. Not used by this mixin, but you
        can use this in your own ``get_buttons``-method.

        Defaults to :obj:`~.FormViewMixin.submit_save_label`.
        """
        return self.submit_save_label

    def get_submit_save_and_continue_edititing_label(self):
        """
        Get the "save and continue editing" submit label. Not used by this mixin, but you
        can use this in your own ``get_buttons``-method.

        Defaults to :obj:`~.FormViewMixin.submit_save_and_continue_edititing_label`.
        """
        return self.submit_save_and_continue_edititing_label

    def get_submit_save_button_name(self):
        """
        Get the name of the save submit button. Not used by this mixin, but you
        can use this in your own ``get_buttons``-method.

        Defaults to :obj:`~.FormViewMixin.submit_save_button_name`.
        """
        return self.submit_save_button_name

    def get_submit_save_and_continue_edititing_button_name(self):
        """
        Get the "save and continue editing" submit button name.
        Not used by this mixin, but you can use this in your own ``get_buttons``-method.

        Defaults to :obj:`~.FormViewMixin.submit_save_and_continue_edititing_button_name`.
        """
        return self.submit_save_and_continue_edititing_button_name

    def get_form_renderable(self):
        """
        Get a :class:`django_cradmin.renderable.AbstractRenderable` that renders
        the form.

        This will typically be a :doc:`uicontainer` tree containing a
        :class:`django_cradmin.uicontainer.form.Form`, but it can be any
        AbstractRenderable. Not using a :class:`django_cradmin.uicontainer.form.Form`
        (or a subclass of it) is fairly complex when it comes to handling error
        messages and form rendering, so it is generally not recommended.

        See :meth:`django_cradmin.viewhelpers.formview.formview.FormView` for examples.

        Returns:
            django_cradmin.renderable.AbstractRenderable: The renderable object.
        """
        raise NotImplementedError()

    def add_formview_mixin_context_data(self, context):
        """
        Must be used by get_context_data() in subclasses to add the context data required to
        render the view.

        Examples:

            Adding the required context data::

                def get_context_data(self, **kwargs):
                    context = super(MyView, self).get_context_data(**kwargs)
                    self.add_formview_mixin_context_data(context=context)
                    return context
        """
        context['uicontainer'] = self.get_form_renderable()
        context['pagetitle'] = self.get_pagetitle()
        context['pageheading'] = self.get_pageheading()

    def get_listing_url(self):
        """
        Get the URL of the listing view.

        Defaults to :obj:`.listing_viewname`. This is used as the success URL
        by default.
        """
        return self.request.cradmin_app.reverse_appurl(self.listing_viewname)

    def get_default_save_success_url(self):
        if 'success_url' in self.request.GET:
            return self.request.GET['success_url']
        else:
            return self.get_listing_url()

    def get_success_url(self):
        return self.get_default_save_success_url()
