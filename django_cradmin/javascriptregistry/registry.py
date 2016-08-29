# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from ievv_opensource.utils.singleton import Singleton


class Registry(Singleton):
    """
    Registry of :class:`.JsComponent` objects.

    Examples:

        First, define a subclass of :class:`~django_cradmin.javascriptregistry.component.AbstractJsComponent`.
        Then register the javascript component in the registry via an AppConfig for your
        Django app::

            from django.apps import AppConfig
            from django_cradmin import javascriptregistry

            class MyJsComponent(javascriptregistry.component.AbstractJsComponent):
                @classmethod
                def get_component_id(cls):
                    return 'my_cool_app'

                def get_head_sourceurls(self):
                    return [
                        self.get_static_url('myapp/js/myapp.js')
                    ]

            class MyAppConfig(AppConfig):
                name = 'myapp'

                def ready(self):
                    javascriptregistry.Registry.get_instance().add(jscomponent_class=MyJsComponent)
    """

    def __init__(self):
        super(Registry, self).__init__()
        self._jscomponent_classes = {}

    def add(self, jscomponent_class):
        """
        Add the given ``jscomponent_class`` to the registry.

        Parameters:
            jscomponent_class (django_cradmin.javascriptregistry.component.AbstractJsComponent):
                The javascript component class to add
                to the registry.
        """
        if jscomponent_class.get_component_id() in self._jscomponent_classes:
            raise KeyError('Duplicate component ID in javascriptregistry: {}'.format(
                jscomponent_class.get_component_id()))
        self._jscomponent_classes[jscomponent_class.get_component_id()] = jscomponent_class

    def __getitem__(self, component_id):
        """
        Get the :class:`~django_cradmin.javascri~ptregistry.component.AbstractJsComponent`
        registered with ``component_id``.
        """
        return self._jscomponent_classes[component_id]

    def _get_component_object(self, request, component_id):
        component_class = self._jscomponent_classes[component_id]
        component = component_class(request=request)
        return component

    def get_component_objects(self, request, component_ids):
        added_component_ids = set()
        components = []

        def add_component(component_id):
            if component_id in added_component_ids:
                return
            added_component_ids.add(component_id)
            component_object = self._get_component_object(request=request, component_id=component_id)
            components.append(component_object)
            return component_object

        for requested_component_id in component_ids:
            component = add_component(requested_component_id)
            for dependency_component_id in component.get_dependencies():
                add_component(dependency_component_id)


class MockableRegistry(Registry):
    """
    A non-singleton version of :class:`.Registry`. For tests.

    Typical usage in a test::

        from django_cradmin.utils import javascriptregistry

        class MockJsComponent(javascriptregistry.component.AbstractJsComponent):
            @classmethod
            def get_component_id(cls):
                return 'mock_js_component'

        mockregistry = javascriptregistry.MockableRegistry()
        mockregistry.add(MockJsComponent)

        with mock.patch('django_cradmin.javascriptregistry.registry.Registry.get_instance',
                        lambda: mockregistry):
            pass  # ... your code here ...
    """

    def __init__(self):
        self._instance = None  # Ensure the singleton-check is not triggered
        super(MockableRegistry, self).__init__()
