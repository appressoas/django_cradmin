#####################################################################
Testhelpers --- Makes it easier to write tests for your cradmin views
#####################################################################


****************
Test case mixins
****************

.. currentmodule:: django_cradmin.cradmin_testhelpers

.. automodule:: django_cradmin.cradmin_testhelpers
    :members:



*********
Utilities
*********

Css classes only for automatic tests
====================================
You should use the :func:`~django_cradmin.templatetags.cradmin_tags.cradmin_test_css_class`
template tag to add css classes that are only used in tests.

If you extend :class:`django_cradmin.renderable.AbstractRenderableWithCss`, you
can add css classes only for tests by overriding
:meth:`~django_cradmin.renderable.AbstractRenderableWithCss.get_test_css_class_suffixes_list`.
