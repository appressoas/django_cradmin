############################################################
`viewhelpers.listfilter` --- a framework for filtering lists
############################################################

The ``django_cradmin.viewhelpers.listfilter`` framework makes it
easy to add filters to your listviews. It works with any view that
lists items (from the database or other sources).


********************************
Getting started with listbuilder
********************************
In this example we will create a full example using :doc:`listbuilder <viewhelpers_listbuilder>`.
We will skip all the role-related stuff.


Create the models
=================
Create the following model in your models.py:

.. literalinclude:: /../django_cradmin/demo/listfilterdemo/models.py

.. note::

    The ``@python_2_unicode_compatible`` is just there to make the model
    compatible with both python 2 and 3.


Create the view
===============

Create a ``views`` module in your app, and add ``views/personlist.py``
with the following code (adjust the imports for your app):

.. literalinclude:: /../django_cradmin/demo/listfilterdemo/views/personlist.py

We add the filters in the ``add_filterlist_items()``-method.
We add three filters:

- Search by ``name``.
  Uses :class:`~django_cradmin.viewhelpers.listfilter.django.single.textinput.Search`.
- Filter by ``banned_datetime``.
  Uses :class:`~django_cradmin.viewhelpers.listfilter.django.single.select.DateTime`.
- Order by name (descending and ascending). This is defined
  using a class. Some of the provided base classes for filters
  work like this because they need something that can not be
  easily/cleanly defined using parameters.
  Uses :class:`~django_cradmin.viewhelpers.listfilter.django.single.select.AbstractOrderBy`.

The ``get_filterlist_url()``-method is required. Refer to
:meth:`~django_cradmin.viewhelpers.listfilter.listfilter_viewmixin.ViewMixin.get_filterlist_url`
for more details on this method.

The ``get_queryset_for_role``-method is just like it would be for
any listbuildeview except that we add a single line to allow
the filterlist to filter the queryset.


Create a cradmin instance
=========================
Add a ``cradmin.py`` to your app with the following code (adjust the imports for your app):

.. literalinclude:: /../django_cradmin/demo/listfilterdemo/cradmin.py


Add to urls.py
==============
Add something like this to you ``urls.py``::

    url(r'^listfilterdemo/', include(ListfilterDemoCrAdminInstance.urls())),


Try it out
==========
Start up your django development server, and visit the app at the URL you added to your ``urls.py``.

You will have to use the shell to create at least one ``Site`` and one ``Person``.


Full source code
================
See :github_folder:`django_cradmin/demo/listfilterdemo`.


************************************
Gettign started with ObjectTableView
************************************
Works just like the listbuilder example above, but you use
``objecttable.FilterListMixin, objecttable.ObjectTableView`` instead of
``listbuilderview.FilterListMixin, listbuilderview.View`` in the view.


***************
Advanced topics
***************

Test filtering with slow requests
=================================
To test how the filters behave with slow requests, use :doc:`delay_middleware`.



Share data between your filters
===============================
If you want to share data between all of your filtes (such as aqueryset),
you can override one of the AbstractFilterList subclasses
and send the queryset into ``__init__()``. All of the
filters (and other :class:`~django_cradmin.viewhelpers.listfilter.base.abstractfilterlistchild.AbstractFilterListChild`)
has access to the filterlist via their ``filterlist`` attribute.
This can of course be used to share any kind of information that your
filters need.


**********************
Design --- why and how
**********************
The listfilter module is designed to be data store agnostic. This
means that we use general purpose terms and logic that does not
bind the framework to a specific data storage backend.

The most obvious of these strange terms when working with the filters in
``django_cradmin.viewshelpers.listbuilder.django`` is that you
send the model field into the filter via the ``slug`` parameter.
This is much easier to understand when you know the following:

- Each filter has a slug. The slug is the thing added to the URL,
  and reversed to extract the filter values from the URL.
- The base class for all Django filters,
  :class:`~django_cradmin.viewhelpers.listfilter.django.base.DjangoOrmFilterMixin`,
  defines :meth:`~django_cradmin.viewhelpers.listfilter.django.base.DjangoOrmFilterMixin.get_modelfield`,
  which simply defalts to returning the slug of the filter. You can override this if you want
  to have a different slug in the URL than the model field name.


Code structure
==============
The code is organized into these sub-modules of ``django_cradmin.viewhelpers.listfilter``:

    base
        Base classes. Very rarely used directly except when creating completely custom
        components for the framework.
    lists
        Re-usable subclasses of
        :class:`~django_cradmin.viewhelpers.listfilter.base.abstractfilterlist.AbstractFilterList`.
    basefilters
        Re-usable data store agnostic abstract filter classes.
    django
        Re-usable Django ORM specific subclasses of
        :class:`~django_cradmin.viewhelpers.listfilter.base.abstractfilter.AbstractFilter`.
        These are mostly fairly small extensions of classes in ``basefilters`` that just
        add the Django ORM specific stuff.


************
How it works
************
A filter is just a class that lets the user select from a
list of choices and filter a list based on their selection.

The base class (:class:`~django_cradmin.viewhelpers.listfilter.base.abstractfilter.AbstractFilter`)
is completely decoupled from the storage backend, and just provides
methods that any filter needs to override.

A filter is rendered by a :class:`~django_cradmin.viewhelpers.listfilter.base.abstractfilterlist.AbstractFilterList`.
A filterlist is simply a list of :class:`~django_cradmin.viewhelpers.listfilter.base.abstractfilterlistchild.AbstractFilterListChild`,
which is a subclass of :class:`~django_cradmin.renderable.AbstractRenderableWithCss`.

:class:`~django_cradmin.viewhelpers.listfilter.base.abstractfilterlistchild.AbstractFilterListChild` can render anything,
so it is perfect for adding things like sectioning and extra text in your
filterlists. For the actual filters, we have :class:`~django_cradmin.viewhelpers.listfilter.base.abstractfilter.AbstractFilter`
(a subclass of :class:`~django_cradmin.viewhelpers.listfilter.base.abstractfilterlistchild.AbstractFilterListChild`). Subclasses of
this is this gets special treatment by :meth:`~django_cradmin.viewhelpers.listfilter.base.abstractfilterlist.AbstractFilterList`.


To summarize, you do the following to define filters for a view:

- Create an instance of a subclass of :class:`django_cradmin.viewhelpers.listfilter.base.abstractfilterlist.AbstractFilterList`.
- Add subclasses of :class:`django_cradmin.viewhelpers.listfilter.base.abstractfilter.AbstractFilter` to the filter filterlist.
- Call the render() method of the filter filterlist to render all the filters.


URLs generated by filters
=========================

.. todo:: Change this to talk about FiltersHandler

Each filter has a slug (:meth:`~django_cradmin.viewhelpers.listfilter.base.abstractfilter.AbstractFilter.get_slug`).
The slug is used in the URL to identify the filter. Example::

    /my/view/hasimage-true/size-large/tags-a,b/

Here ``tag`` and ``hasimage`` are slugs for the applied filters.

Filters are added to the url with something like ``(?P<filters_string>.*)``.



******************
Django filters API
******************


Singlevalue widgets
===================

.. currentmodule:: django_cradmin.viewhelpers.listfilter.django.single.select
.. automodule:: django_cradmin.viewhelpers.listfilter.django.single.select

.. currentmodule:: django_cradmin.viewhelpers.listfilter.django.single.textinput
.. automodule:: django_cradmin.viewhelpers.listfilter.django.single.textinput


Multivalue widgets
==================

.. currentmodule:: django_cradmin.viewhelpers.listfilter.django.multi.checkbox
.. automodule:: django_cradmin.viewhelpers.listfilter.django.multi.checkbox


Base classes for Django ORM filters
===================================

.. currentmodule:: django_cradmin.viewhelpers.listfilter.django.base
.. automodule:: django_cradmin.viewhelpers.listfilter.django.base



**********************************
Re-usable base classes for filters
**********************************
The following are datastore agnostic abstract base classes for filters.
They deal with rendering, leaving the filtering logic up to
subclasses.

.. currentmodule:: django_cradmin.viewhelpers.listfilter.basefilters.single.abstractselect
.. automodule:: django_cradmin.viewhelpers.listfilter.basefilters.single.abstractselect

.. currentmodule:: django_cradmin.viewhelpers.listfilter.basefilters.single.abstracttextinput
.. automodule:: django_cradmin.viewhelpers.listfilter.basefilters.single.abstracttextinput

.. currentmodule:: django_cradmin.viewhelpers.listfilter.basefilters.multi.abstractcheckbox
.. automodule:: django_cradmin.viewhelpers.listfilter.basefilters.multi.abstractcheckbox


.. _listfilter_lists:

************
Filter lists
************

.. currentmodule:: django_cradmin.viewhelpers.listfilter.lists
.. automodule:: django_cradmin.viewhelpers.listfilter.lists


********
Base API
********

.. note::

  You do not use the ``django_cradmin.viewhelpers.listfilter.base``
  API directly - You can use the classes as superclasses when you
  create custom filters or filterlists.

.. currentmodule:: django_cradmin.viewhelpers.listfilter.base.abstractfilter
.. automodule:: django_cradmin.viewhelpers.listfilter.base.abstractfilter

.. currentmodule:: django_cradmin.viewhelpers.listfilter.base.abstractfilterlistchild
.. automodule:: django_cradmin.viewhelpers.listfilter.base.abstractfilterlistchild

.. currentmodule:: django_cradmin.viewhelpers.listfilter.base.abstractfilterlist
.. automodule:: django_cradmin.viewhelpers.listfilter.base.abstractfilterlist

.. currentmodule:: django_cradmin.viewhelpers.listfilter.base.exceptions
.. automodule:: django_cradmin.viewhelpers.listfilter.base.exceptions

.. currentmodule:: django_cradmin.viewhelpers.listfilter.base.filtershandler
.. automodule:: django_cradmin.viewhelpers.listfilter.base.filtershandler
