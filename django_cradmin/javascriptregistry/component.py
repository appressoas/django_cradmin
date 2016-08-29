# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import re

from django.contrib.staticfiles.templatetags import staticfiles
from django.template.loader import render_to_string

COMPONENT_ID_REGEX = re.compile(r'^[a-z][a-z0-9_]*[a-z0-9]$')


class ComponentIdFormatError(Exception):
    pass


class AbstractJsComponent(object):
    @classmethod
    def get_component_id(cls):
        raise NotImplementedError()

    def __init__(self, request):
        self.request = request
        self.component_id = self.get_component_id()
        if not COMPONENT_ID_REGEX.match(self.component_id):
            raise ComponentIdFormatError('Invalid component_id: {}. Must start with a-z, end with a-z or 0-9, and'
                                         'the letters between the start and end can only be a-z, 0-9 and _.')

    def get_dependencies(self):
        return []

    def get_static_url(self, path):
        return staticfiles.static(path)

    def get_head_sourceurls(self):
        return []

    def get_end_of_body_sourceurls(self):
        return []

    def get_end_of_body_javascript_code(self):
        return None


class CradminAngular1(AbstractJsComponent):
    def get_target_domelement_selector(self):
        raise NotImplementedError()

    def get_angularjs_appname(self):
        return '{}App'.format(
            ''.join(word.capitalize() for word in self.component_id.split('_')))

    def get_head_sourceurls(self):
        return [
            self.get_static_url('django_cradmin/dist/vendor/cradmin-vendorjs.js')
        ]

    def get_angularjs_modules(self):
        return []

    def get_end_of_body_javascript_code(self):
        return render_to_string('django_cradmin/utils/jsregistry/cradmin-angular1-jscomponent.django.html',
                                request=self.request,
                                context={
                                    'me': self
                                })


class CradminMenu(CradminAngular1):
    @classmethod
    def get_component_id(cls):
        return 'django_cradmin_mainmenu'

    def get_target_domelement_selector(self):
        return '#id_django_cradmin_mainmenu'

    def get_angularjs_modules(self):
        return [
            'djangoCradmin.menu'
        ]
