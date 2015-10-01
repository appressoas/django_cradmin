#############################################
`renderable` --- Unified renderable interface
#############################################

When you build decoupled modules where separate items is rendered, you
often need to render several different templates into one output.
One approach is to just use the ``{% include %}`` tag, but that
is not a very object oriented approach. To make this object oriented,
we use the :class:`django_cradmin.renderable.AbstractRenderable`
class to provide a unified interface inspired by the TemplateView
class in Django.

To provide a renderable object, you simply subclass
:class:`django_cradmin.renderable.AbstractRenderable`, specify
a template name, and add methods, attributes and properties to
the class to make them available to the template.


.. currentmodule:: django_cradmin.renderable

.. automodule:: django_cradmin.renderable
    :members:
