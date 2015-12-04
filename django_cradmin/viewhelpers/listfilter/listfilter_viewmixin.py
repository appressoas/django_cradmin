from __future__ import unicode_literals


class ViewMixin(object):
    def get_filterlist_url(self, filters_string):
        """
        Get the URL for the given ``filters_string``.

        This will typically involve reversing the current view
        URL and insert ``filters_string`` as the ``filters_string``
        kwarg.
        """
        raise NotImplementedError()

    def get_filter_unprotected_querystring_arguments(self):
        """
        Get a set of names querystring arguments/attributes
        that should be not be kep when a filter is applied.

        Lets say you store the current page as ``?page=2``.
        Then you would want to return ``{'p'}`` here make sure
        applying a filter returns the user to the first page.
        """
        return set()

    def filterlist_urlbuilder(self, filters_string):
        """
        Get an urlbuilder for :class:`django_cradmin.viewhelpers.listfilter.base.AbstractFilterList`.

        You should not override this. Override :meth:`.get_filterlist_url` instead.
        If you override this, you have to ensure you handle querystring correctly.
        """
        querydict = self.request.GET.copy()
        unprotected_querystring_arguments = self.get_filter_unprotected_querystring_arguments()
        if unprotected_querystring_arguments:
            for unprotected_querystring_argument in unprotected_querystring_arguments:
                if unprotected_querystring_argument in querydict:
                    del querydict[unprotected_querystring_argument]

        url = self.get_filterlist_url(filters_string)
        querystring = querydict.urlencode()
        if querystring:
            url = '{}?{}'.format(url, querystring)
        return url

    def get_filters_string(self):
        return self.kwargs.get('filters_string', '')

    def build_filterlist(self):
        """
        Override this to add filtering with :doc:`listbuilder <viewhelpers_listbuilder>`.

        Should return an instance of a subclass of
        :class:`django_cradmin.viewhelpers.listfilter.base.AbstractFilterList`.
        """
        raise NotImplementedError()

    def get_filterlist(self):
        """
        Returns the result of :meth:`.build_filterlist`, but
        ensures the method is only called once for a request.

        This means that you should override :meth:`.build_filterlist`,
        but when you need to use it, you should call this method instead.
        """
        if not hasattr(self, '_filterlist'):
            self._filterlist = self.build_filterlist()
        return self._filterlist

    def get_filterlist_position(self):
        """
        Get the position where you want to place the filterlist.

        The supported values are defined in the mixins implemented
        in the various modules that support filterlist
        (such as :class:`django_cradmin.viewhelpers.listbuilderview.FilterListMixin`).
        """
        raise NotImplementedError()

    def get_filterlist_template_name(self):
        """
        Get the template to use based on what :meth:`.get_filterlist_position`.

        You will want to call this from the ``get_template_names`` method.
        This is just the interface, refer to the mixins implemented in
        various modules (such as :class:`django_cradmin.viewhelpers.listbuilderview.FilterListMixin`)
        for details on how to use this method.
        """
        raise NotImplementedError()

    def get_template_names(self):
        return [self.get_filterlist_template_name()]

    def add_filterlist_to_context_data(self, context_data):
        """
        Add the context data required to render the filterlist.
        You may need to use this if you have some strange inheritance
        where get_context_data() is not called for all superclasses
        of your view.
        """
        context_data['filterlist'] = self.get_filterlist()

    def get_context_data(self, **kwargs):
        context = super(ViewMixin, self).get_context_data(**kwargs)
        context['filterlist'] = self.get_filterlist()
        return context
