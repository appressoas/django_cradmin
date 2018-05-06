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
    - ``searchinput`` BEM block:
        - New ``--size-*`` variants.
        - New ``--width-small`` variant.
    - Fixes and new css classes to make input, searchinput, select and button have the exact same height - for horizontal layouts.
    - Update recommended NPM package versions.


***************************
Migrate from 5.2.x to 6.0.0
***************************

Migrate your form styles
========================
You need to migrate the styles that have been removed/changed as described in the ``django_cradmin_styles`` section
in the _Whats new?_ section above.


Update NPM package versions for your theme(s)
=============================================
You should update the package.json for your themes using ``django_cradmin_styles`` to::

    "autoprefixer": "^8.4.1",
    "cssnano": "^3.10.0",
    "postcss-cli": "^5.0.0",
    "postcss-scss": "^1.0.5",
    "stylelint": "^9.2.0"
