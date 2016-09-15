# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json

import django_cradmin
import re

from django.contrib.staticfiles.templatetags import staticfiles
from django.template.loader import render_to_string

COMPONENT_ID_REGEX = re.compile(r'^[a-z][a-z0-9_]*[a-z0-9]$')


class ComponentIdFormatError(Exception):
    """
    Raised by :class:`.AbstractJsComponent` if the component_id is
    not formatted according to the rules.
    """


class AbstractJsComponent(object):
    """
    Base class for all javascript components.

    .. attribute:: component_id

        Set to :meth:`.get_component_id` in __init__ if the component ID passes
        the validation checks.
    """
    @classmethod
    def get_component_id(cls):
        """
        Get a unique ID for this javascript component.

        Can only contain a-z, 0-9 and ``_``. The first letter can only be a-z,
        and the last letter can not be ``_``.

        Must be overridden in subclasses.
        """
        raise NotImplementedError()

    def __init__(self, request):
        self.request = request
        self.component_id = self.get_component_id()
        if not COMPONENT_ID_REGEX.match(self.component_id):
            raise ComponentIdFormatError(
                'Invalid component_id: {}. Must start with a-z, end with a-z or 0-9, and'
                'the letters between the start and end can only be a-z, 0-9 and _. Must '
                'be at least 2 letters.'.format(
                    self.component_id))

    def get_dependencies(self):
        """
        Get a list of :meth:`component ids <.get_component_id>` that this javascript
        component depends on.
        """
        return []

    def get_static_url(self, path):
        """
        Works just like the ``static`` template tag.

        Args:
            path (str): The path relative to the static directory.

        Returns:
            str: The static URL.

        """
        return staticfiles.static(path)

    def get_sourceurls(self):
        """
        Get a list of javascript source files to load for this component.

        These URLs are added using ``<script>`` tags at the end of ``<body>``
        by the base cradmin templates.

        .. note:: If other components load the same source files, the template tags
            in the ``cradmin_javascriptregistry_tags`` template tag library
            ensures that one unique sources are loaded.
        """
        return []

    def get_head_sourceurls(self):
        """
        Just like :meth:`.get_sourceurls`, but added in the ``<head>`` tag.

        You should normally avoid using this because adding scripts to the
        head tag blocks page loading.
        """
        return []

    def get_javascript_code_after_sourceurls(self):
        """
        Javascript code to add inline in the body of the HTML page
        after loading the source URLs (see :meth:`.get_sourceurls`).

        See :meth:`.get_javascript_code_before_sourceurls` for more details.
        """
        return None

    def get_javascript_code_before_sourceurls(self):
        """
        Javascript code to add inline in the body of the HTML page
        before loading the source URLs (see :meth:`.get_sourceurls`).

        Should return javascript code as a string (no HTML tags).
        """
        return None

    def __eq__(self, other):
        """
        Javascript components are considered equal if their :attr:`~.AbstractJsComponent.component_id` match.
        """
        return other.component_id == self.component_id


class CradminAngular1(AbstractJsComponent):
    def get_target_domelement_selector(self):
        raise NotImplementedError()

    def get_head_sourceurls(self):
        return [
            self.get_static_url('django_cradmin/dist/vendor/cradmin-vendorjs.js'),
            self.get_static_url('django_cradmin/dist/js/cradmin.min.js'),
        ]

    def get_angularjs_modules(self):
        return []

    def get_angularjs_modules_json(self):
        return json.dumps(self.get_angularjs_modules())

    def get_javascript_code_after_sourceurls(self):
        return render_to_string('django_cradmin/utils/jsregistry/cradmin-angular1-jscomponent.django.js',
                                request=self.request,
                                context={
                                    'me': self
                                })


class CradminJavascript(AbstractJsComponent):
    @classmethod
    def get_component_id(cls):
        return 'django_cradmin_javascript'

    def get_sourceurls(self):
        return [
            self.get_static_url('django_cradmin/{version}/scripts/django_cradmin.js'.format(
                version=django_cradmin.__version__
            ))
        ]
