import warnings

from django.template.loader import render_to_string

from django_cradmin import crsettings


class AbstractRenderable(object):
    """
    An abstract class that implements an interface for
    rendering something.

    Everything is just helpers for the :meth:`.render` method,
    which renders a template with an object of this class as
    input.
    """

    #: The default value for :meth:`.get_template_names`.
    template_name = None

    def get_template_names(self):
        """
        Get the template name(s) for :meth:`.render`.

        Defaults to :obj:`~.AbstractRenderable.template_name`.

        Raises:
            NotImplementedError: If :obj:`~.AbstractRenderable.template_name` is
             not set.
        """
        if self.template_name:
            return self.template_name
        else:
            raise NotImplementedError('You must set template_name or override '
                                      'get_template_names().')

    def get_context_data(self, request=None):
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

    def render(self, request=None, extra_context_data=None):
        """
        Render :obj:`.get_template_names` with
        the context returned by :meth:`.get_context_data`.

        Paramteters:
            request (HttpRequest): If this is provided, we forward it to
                :meth:`.get_context_data`, and to ``render_to_string()``
                (which is used to render the template).
        """
        context_data = {}
        if extra_context_data:
            context_data.update(extra_context_data)
        context_data.update(self.get_context_data(request=request))
        return render_to_string(
            template_name=self.get_template_names(),
            context=context_data,
            request=request)


class AbstractRenderableWithCss(AbstractRenderable):
    """
    Extends :class:`.AbstractRenderable` with a unified
    API for setting CSS classes.
    """
    def get_base_css_classes_list(self):
        return []

    def get_extra_css_classes_list(self):
        return []

    def get_css_classes_list(self):
        """
        Override this to define css classes for the component.

        Must return a list of css classes.

        See :meth:`.get_css_classes_string`.
        """
        css_classes_list = []
        # if hasattr(self, 'get_base_css_classes_list'):
        #     warnings.warn("AbstractRenderableWithCss.get_base_css_classes_list() is deprectated "
        #                   "- override get_css_classes_list() instead.",
        #                   DeprecationWarning)
        #     css_classes_list.extend(self.get_base_css_classes_list())
        # if hasattr(self, 'get_extra_css_classes_list'):
        #     warnings.warn("AbstractRenderableWithCss.get_extra_css_classes_list() is deprectated "
        #                   "- override get_css_classes_list() instead.",
        #                   DeprecationWarning)
        #     css_classes_list.extend(self.get_extra_css_classes_list())
        css_classes_list.extend(self.get_base_css_classes_list())
        css_classes_list.extend(self.get_extra_css_classes_list())
        return css_classes_list

    def get_test_css_class_suffixes_list(self):
        """
        List of css class suffixes to include when running automatic tests.

        These suffixes are filtered through the
        :func:`~django_cradmin.templatetags.cradmin_tags.cradmin_test_css_class`
        template tag.
        """
        return []

    @property
    def css_classes(self):
        """
        Get css classes.

        Joins :meth:`.get_css_classes_list` into a string.

        You should not override this, override :meth:`.get_css_classes_list` instead.
        """
        from django_cradmin.templatetags import cradmin_tags  # Avoid circular import
        css_classes = list(self.get_css_classes_list())
        if crsettings.get_setting('DJANGO_CRADMIN_INCLUDE_TEST_CSS_CLASSES', False):
            for css_class_suffix in self.get_test_css_class_suffixes_list():
                css_classes.append(cradmin_tags.cradmin_test_css_class(css_class_suffix))
        return '  '.join(css_classes)

    def get_css_classes_string(self):
        warnings.warn("AbstractRenderableWithCss.get_css_classes_string() is deprectated "
                      "- use the AbstractRenderableWithCss.css_classes property instead.",
                      DeprecationWarning)
        return self.css_classes
