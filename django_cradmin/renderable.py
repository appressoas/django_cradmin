from django.template import RequestContext
from django.template.loader import render_to_string


class AbstractRenderable(object):
    """
    An abstract class that implements an interface for
    rendering something.

    Everything is just helpers for the :meth:`.render` method,
    which renders a template with an object of this class as
    input.
    """
    template_name = None

    def get_template_name(self):
        """
        Get the template name for :meth:`.render`.

        Defaults to :obj:`~.AbstractRenderable.template_name`.

        Raises:
            NotImplementedError: If :obj:`~.AbstractRenderable.template_name` is
             not set.
        """
        if self.template_name:
            return self.template_name
        else:
            raise NotImplementedError('You must set template_name or override '
                                      'get_template_name().')

    def get_context_data(self):
        """
        Get context data for :meth:`.render`.

        Defaults to::

            {
                'me': self
            }
        """
        return {
            'me': self
        }

    def get_template_context_object(self, request=None):
        """
        Get the template context object returned by
        :meth:`.render`.

        See the docs for the ``request`` parameter for
        :meth:`.render` for more details.
        """
        context = self.get_context_data()
        if request:
            context = RequestContext(request, context)
        return context

    def render(self, request=None):
        """
        Render :obj:`.get_template_name` with
        the context returned by :meth:`.get_context_data`.

        Paramteters:
            request (HttpRequest): If this is provided, we create
                wrap the response from :meth:`.get_context_data`
                in a ``RequestContext``.

                You can override this behavior in
                :meth:`.get_template_context_object`.
        """
        return render_to_string(
            self.get_template_name(),
            self.get_template_context_object(request=request))

