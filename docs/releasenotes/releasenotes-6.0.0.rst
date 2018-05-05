#################################
Django cradmin 6.0.0 releasenotes
#################################


.. warning:: This version is not released yet.

************
What is new?
************
- ``django_cradmin_styles``:
    - ``input`` BEM block:
        - ``input--small``, ``input--xsmall`` and ``input--xxsmall``: Removed. Replaced by ``input--width-<size>``
          variants instead.
          This means that you need to refactor to ``input--width-<small|xsmall|xxsmall>``.
        - ``input--half``: Removed. If you need this, you probably want to use coloumnlayout instead.
        - ``input--inline-xxsmall``: Removed. Can be refactored to ``input--inline input--width-xxsmall input--size-small``.
        - New ``--size-*`` variants.
        - New ``--width-*`` variants.
    - ``select`` BEM block:
        - ``select--small``: Removed. Was not in the styleguide/docs, so should not be in use many places.
        - New ``--size-*`` variants.
        - New ``--width-*`` variants.
    - ``button`` BEM block:
        - New ``--form-size-*`` variants.
    - Fixes and new css classes to make input, select and button have the exact same height - for horizontal layouts.


***************************
Migrate from 5.2.x to 6.0.0
***************************

You need to migrate the styles that have been removed/changed as described in the ``django_cradmin_styles`` section
in the _Whats new?_ section above.
