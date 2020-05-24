Django cradmin 6 releasenotes
=============================

> **WARNING**: The 6.x release have a bit of a messy relationship
> with patch and minor releases up to 6.11, so do not assume that minor and patch
> releases mean what semver.org say for <6.11.

6.0
===

## Changes
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


## Migrate from 5.2.x to 6.0.0

### Migrate your form styles
You need to migrate the styles that have been removed/changed as described in the ``django_cradmin_styles`` section
in the _Whats new?_ section above.


### Update NPM package versions for your theme(s)
You should update the package.json for your themes using ``django_cradmin_styles`` to::

    "autoprefixer": "^8.4.1",
    "cssnano": "^3.10.0",
    "postcss-cli": "^5.0.0",
    "postcss-scss": "^1.0.5",
    "stylelint": "^9.2.0"

### Update NPM package versions for your javascript
Update to django_cradmin_js 4.


## 6.0: Patch releases

### 6.0.1

- ``CrAdmin_js``:
    - `cradmin_js.html5datetimepicker.Html5FromToDateSelectors`
    - `cradmin_js.filterlist.components.filters.Html5FromToDateFilter`
- ``Styles``:
    - Possibility to have input fieldwrappers aligned horizontally
        - `fieldwrapper-line`
        - `fieldwrapper-line__item`


### 6.0.2

- ``django_cradmin_js``:
    - Use npm dependency for ievv_jsbase, not github url.
- ``Styles``:
    - page-cover-mixin: Fix button variables (was not in use).
    - columnlayout: Add a new columnlayout-lg with breakpoint at `lg` instead of `md`.


### 6.0.3

#### Changes
- More blocks in the templates for crbreadcrumb. To make it easier to extend.


6.1
===

## Changes
- Add cut, copy, paste and to the default icon set.


6.2
===

## Changes
- Add new `image` bem block to styles.


6.3
===
## Changes
- New size variants for `dateinput` css BEM block.
- New --primary and --secondary variants for `text` css BEM block.


6.4
===
> **WARNING:** Release notes missing


6.5
===
> **WARNING:** Release notes missing


6.6
===

## Changes
- New API for change password

## 6.6: Patch releases

### 6.6.1
> **WARNING:** Release notes missing

### 6.6.2
> **WARNING:** Release notes missing

### 6.6.3
- Improved django_cradmin.apps.cradmin_email.emailutils.AbstractEmail with support for sending emails with other
  content encodings (fetched from the new `DJANGO_CRADMIN_EMAIL_ENCODING` setting).

### 6.6.4
- SortableQuerySetBase now supports passing a dictionary with additional attributes to set on the item(s) that
  are sorted when the items are saved/updated.


6.7
===

## Changes
- styles:
    - Add the --xwide container variant.
    - Include a new --no-wrapping-layout variant for tilelayout.
      This should probably have been the default base style, while the current
      default should have been a variant, buuut have to avoid breaking existing code.
    - Include color variants for tilelayout (in addition to just neutral).
    - Add a new $default-colors variable, and update color function to lookup in $colors
      as always, but fall back to looking up colors in $default-colors. The colors
      function is also updated with much better error handling. Add new deep-map-merge
      function for deep merging two SASS maps. If you get SASS build errors relating to colors
      after this update, you probably have a bug where you are using an undefined color
      that was previously silently ignored.


6.8
===

## Changes
- styles:
    - Add new black-or-white-contrast-color function
    - Introduce the get-background-color function, and use it for page-section color variants.
    - Better support for light backgrounds in page-cover.

6.9
===
> **WARNING:** Release notes missing


6.10
====

## Changes
- styles:
    - New text-size BEM block.
    - Add --weight and --no-shrink-or-grow variants to columnlayout columns.
    - Improve cricon support within .list, and improve fixed-width calculations for cricon.


6.11
====

## Changes
- Support for gzipped CSS via new support in ievv_opensource.
- Requires ievv_opensource>=5.20.2.

## 6.11: Patch releases

### 6.11.1

- styles:
    - Add a new article css class.

### 6.11.2

- ``templates/django_cradmin/crmenu/menu/default-expandable.django.html``:
    - Add more template blocks to make it easier to override.


6.12
====

## Changes
- New development setup with Pipenv.
    - Removed requirements.txt and ``requirements/``.
    - See ``docs/develop.rst`` for help developing with pipenv.
    - Only relevant for the people actually developing django_cradmin, not the ones using it.
- Correct dependencies (not too many, and correct versions) in ``setup.py``.
    - Avoids pulling in stuff that was not required to use django_cradmin.
    - Requires ``ievv_opensource>=5.22.1,<6``


## 6.12: Patch releases

### 6.12.1
Add new xsmall and small spacing variants for columnlayout CSS.
