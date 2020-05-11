#################################
Django cradmin 1.1.1 releasenotes
#################################


************
What is new?
************
``django_cradmin.viewhelpers`` can now be imported with ``from django_cradmin import viewhelpers``.
Example::

    from django_cradmin import viewhelpers

    class MyCreateView(viewhelpers.create.CreateView):
        pass  # more code here ...

The imported ``viewhelpers`` object does not include ``listbuilder``, ``listfilter`` or ``multiselect2``,
they should still be imported using ``from django_cradmin.viewhelpers import <module>``.


****************
Breaking changes
****************
There are no breaking changes between 1.1.0 and 1.1.1.
