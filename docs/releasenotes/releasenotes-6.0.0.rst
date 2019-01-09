#################################
Django cradmin 6.0.0 releasenotes
#################################


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
    - ``selectable-list`` BEM block:
        - New ``--outlined`` variant for ``selectable-list__item``.
        - Set ``selectable-list__item`` to text-align left. Makes it work with ``<button>`` too.
        - Set ``selectable-list__itemcontent`` to display block. Makes it work with ``<span>`` too (which is needed
          when the ``selectable-list__item`` is a ``<button>``.
    - ``page-section-mixin``: Make the p:last-child check more explicit. Now it only matches
      if the ``<p>`` is the last child of the last ``.container`` within the page-section.
    - ``column-layout``:
        - Add ``column-layout__column--vertical-center`` variant.
    - ``blocklist``:
        - New styles for generic action sidebar. With these new styles, we no longer need
          the ``blocklist__movable-item-wrapper`` and related BEM elements, so they are deprecated.
    - New ``help`` BEM block.
    - New ``responsive-table`` BEM block - responsive tables.
    - New ``text`` BEM block - for simple text styling.
    - New ``paginator`` BEM block.
    - New ``expandable`` BEM block (expand/collapse, accordion, ...).
    - New ``definition-list`` BEM block (styling for ``<dl>``).
    - Add new date/time picker related BEM blocks: ``datetimepicker``, ``calendar-month``, ``month-picker``.
    - Fixes and new css classes to make input, searchinput, select and button have the exact same height - for horizontal layouts.
    - Update recommended NPM package versions.
- ``django_cradmin_js``:
    - React 16 is now required and fully supported.
    - New date/time picker ReactJS components and ievv-jsbase widgets.


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

Update NPM package versions for your javascript
===============================================
Update to django_cradmin_js 4.
