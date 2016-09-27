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
