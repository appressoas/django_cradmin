#######################
Creating a custom theme
#######################


***************
Getting started
***************
TODO



****************
SASS style guide
****************
- Indent with 4 spaces.
- Use BEM naming syntax. See http://getbem.com/ and http://cssguidelin.es/#bem-like-naming.
- Document everything with `PythonKSS <http://pythonkss.readthedocs.io/en/latest/style_documentation_syntax.html>`_.
- Use ``md``, ``lg``, ``xl``, ... (as part of modifier name) for breakpoints.
- Use ``small``, ``large``, ``xlarge``, ... (as part of modifier name) for sizes.
- Never use ``@extend`` to extend a component. Components should be
  as isolated as possible. They may require another component to be
  useful, but they should not extend another component.


***********************************
PythonKSS documentation style guide
***********************************

Never use numbers for section references
========================================
Use ``<setting|generic|base|comonent>.<BEM-block>``.

E.g: ``component.modal``.


Define dependencies last in the description
===========================================
Define dependencies last in the description as follows:

.. code-block:: css

    /* Something

    Some description.

    # Depends on
    - component.modal
    - component.backdrop

    Styleguide something.something
    */


****************
HTML style guide
****************

- **Never** use ID for styling.
- Prefix IDs with ``id_``, and write ids in all lowercase with words separated by a single ``_``.
  Example: ``id_my_cool_element``.
- Separate css classes with two spaces. Example: ``<div class="class1  class2">``



*****
Icons
*****


How it works
============
Icon names are virtual (icon package agnostic). The default icon names are defined in::

    django_cradmin/apps/django_cradmin_styles/staticsources/django_cradmin_styles/styles/basetheme/1__settings/_cricon.scss

When adding support for an icon package (font-awesome, ionicons, ...), we need
to implement a set of mixins, and import those mixins before we import ``basetheme/3__base/all``.
We supply an implementation for font-awesome by default. If you just want to use fon


Extending the default font-awesome icon set
===========================================
This is fairly easy. You just need to add mapping from a virtual name
to a font-awesome variable for the icon in ``$cricon-font-awesome-free-icon-map``,
and add the virtual names to ``$cricon-extra-icon-names``.

Example - adding the align right and align center icons from font-awesome:

.. code-block:: scss

    @import 'basetheme/3__base/cricon/cricon-font-awesome';
    $cricon-font-awesome-free-icon-map: map-merge($cricon-font-awesome-free-icon-map, (
        align-center: $fa-var-align-center,
        align-right: $fa-var-align-right
    ));
    $cricon-extra-icon-names: align-center, align-right;
    @import 'basetheme/3__base/all';

With this, ``cricon--align-center`` and ``cricon--align-right`` css classes will be available.


Adding support for another icon set
===================================
Take a look at the ``_cricon-font-awesome.scss`` file - you need to implement all of the
mixins from that, and import your custom icon mixins instead of ``_cricon-font-awesome.scss``.
