import urllib
from django import forms
from django import http
from django.core import serializers

from crispy_forms import layout
from crispy_forms.helper import FormHelper

from django_cradmin import crapp


class CreateUpdateViewMixin(object):
    """
    Mixin class for Update and Create views.
    """

    #: The model class.
    model = None

    #: List of field names.
    #: See :meth:`.get_field_layout`.
    fields = None

    #: The name of the submit button used for preview.
    #: Only used when :meth:`.preview_url` is defined.
    submit_preview_name = 'submit-preview'

    #: Get the view name for the listing page.
    #: You can set this, or implement :meth:`.get_listing_url`.
    #: Defaults to :obj:`django_cradmin.crapp.INDEXVIEW_NAME`.
    listing_viewname = crapp.INDEXVIEW_NAME

    #: The field that should always be set to the current role.
    #: Adds a hidden field with the correct value for the current
    #: role. See :meth:`.get_hidden_fields`.
    roleid_field = None

    def get_field_layout(self):
        """
        Get a list/tuple of fields. These are added to a ``crispy_forms.layout.Layout``.
        Defaults to a all fields on the model. If :obj:`.fields`, we use those fields.

        Simple example (same as specifying the fields in :obj:`.fields`)::

            from crispy_forms import layout
            
            class MyCreateView(CreateView):
                def get_field_layout(self):
                    return [
                        layout.Div(
                            'title', 'name', 'size', 'tags',
                            css_class='cradmin-globalfields')
                    ]

        A slightly more complex example::
            
            from crispy_forms import layout
            
            class MyCreateView(CreateView):
                def get_field_layout(self):
                    return [
                        layout.Div('title', css_class="cradmin-formfield-like-fieldset"),
                        layout.Div('description', css_class="cradmin-formfield-like-fieldset"),
                        layout.Fieldset('Metadata',
                            'size',
                            'tags'
                        )

                    ]

        """
        fields = forms.fields_for_model(self.model, fields=self.fields).keys()
        if self.roleid_field and self.roleid_field in fields:
            fields.remove(self.roleid_field)
        return [layout.Div(*fields, css_class='cradmin-globalfields')]

    def get_hidden_fields(self):
        """
        Get hidden fields for the form.

        If you set :obj:`.roleid_field`, a hidden field named whatever you
        specify in :obj:`.roleid_field` with value set to the current role ID
        is added automatically.

        Returns:
            An iterable of :class:`crispy_forms.layout.Hidden` objects.
        """
        fields = []
        if self.roleid_field:
            roleid = self.request.cradmin_instance.get_roleid(self.request.cradmin_role)
            fields.append(layout.Hidden(self.roleid_field, roleid))
        return fields

    def get_buttons(self):
        """
        Get buttons for the form, normally one or more submit button.

        Each button must be a crispy form layout object, typically some
        subclass of :class:`crispy_forms.layout.Submit`.

        See:
            This method is used by :meth:`.get_button_layout`.
        """
        return []

    def get_button_layout(self):
        """
        Get the button layout. This is added to the crispy form layout.

        Defaults to a :class:`crispy_forms.layout.Div` with css class
        ``django_cradmin_submitrow`` containing all the buttons
        returned by :meth:`.get_buttons`.
        """
        return [
            layout.Div(*self.get_buttons(),
                css_class="django_cradmin_submitrow")
        ]

    def get_formhelper(self):
        """
        Get a :class:`crispy_forms.helper.FormHelper`.

        You normally do not need to override this directly. Instead
        you should override:

        - :meth:`.get_field_layout`.
        - :meth:`.get_hidden_fields`
        - :meth:`.get_buttons` (or perhaps :meth:`.get_button_layout`)
        """
        helper = FormHelper()
        helper.form_class = 'django_cradmin_form'
        layoutargs = list(self.get_field_layout()) + list(self.get_button_layout()) + list(self.get_hidden_fields())
        helper.layout = layout.Layout(*layoutargs)
        helper.form_action = self.request.get_full_path()
        return helper

    def get_context_data(self, **kwargs):
        context = super(CreateUpdateViewMixin, self).get_context_data(**kwargs)
        context['formhelper'] = self.get_formhelper()
        context['model_verbose_name'] = self.model._meta.verbose_name
        if getattr(self, 'show_preview', False):
            context['preview_url'] = self.get_preview_url()
            context['show_preview'] = True
        return context

    def get_listing_url(self):
        """
        Get the URL of the listing view.

        Defaults to :obj:`.listing_viewname`.
        """
        return self.request.cradmin_app.reverse_appurl(self.listing_viewname)

    def get_default_save_success_url(self):
        if 'success_url' in self.request.GET:
            return self.request.GET['success_url']
        else:
            return self.get_listing_url()

    def get_editurl(self, obj):
        """
        Get the edit URL for ``obj``.

        Defaults to::

            self.request.cradmin_app.reverse_appurl('edit', args=[obj.pk])
        """
        url = self.request.cradmin_app.reverse_appurl('edit', args=[obj.pk])
        if 'success_url' in self.request.GET:
            url = '{}?{}'.format(
                url, urllib.urlencode({
                    'success_url': self.request.GET['success_url']}))
        return url

    def get_success_url(self):
        if 'submit-save' in self.request.POST:
            return self.get_default_save_success_url()
        else:
            return self.get_editurl(self.object)

    def form_valid(self, form):
        """
        If the form is valid, save the associated model.
        """
        if self.preview_requested():
            self.show_preview = True
            self._store_preview_in_session(self.serialize_preview(form))
            return self.render_to_response(self.get_context_data(form=form))
        else:
            self.object = form.save()
            self.form_saved(self.object)
        return http.HttpResponseRedirect(self.get_success_url())

    def form_saved(self, object):
        """
        Called after the form has been saved.
        The ``object`` is the saved object.

        Does nothing by default, but you can override it.
        """
        pass

    def preview_requested(self):
        """
        Determine if a preview was requested.

        Defaults to checking if :obj:`.submit_preview_name` is
        in ``request.POST``.
        """
        return self.submit_preview_name in self.request.POST

    def get_preview_url(self):
        """
        Get the URL of the preview view.
        """
        return None

    def _store_preview_in_session(self, data):
        self.request.session[self.__class__.get_preview_sessionkey()] = data

    def serialize_preview(self, form):
        """
        Seralize for preview.

        Defaults to serializing the object as JSON using ``django.core.serializers``.
        You can safely override this, but you will also have to override
        :meth:`deserialize_preview`.
        """
        return serializers.serialize('json', [form.save(commit=False)])

    @classmethod
    def deserialize_preview(self, serialized):
        """
        Deseralize a preview serialized with :meth:`.serialize_preview`.
        """
        return list(serializers.deserialize('json', serialized))[0].object

    @classmethod
    def get_preview_sessionkey(cls):
        """
        Get the session key used for preview. You should not
        need to override this.
        """
        return 'django_cradmin__{module}.{classname}'.format(
            module=cls.model.__module__,
            classname=cls.model.__name__)

    @classmethod
    def get_preview_data(cls, request):
        """
        Get the preview data.

        You should use this in the preview view to get the
        data for the preview.

        You normally do not override this. If you want to manage
        serialization yourself, see :meth:`.serialize_preview`.
        """
        serialized = request.session.pop(cls.get_preview_sessionkey())
        return cls.deserialize_preview(serialized)
