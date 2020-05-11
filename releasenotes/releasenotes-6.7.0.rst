##################################
Django cradmin 6.7.0 release notes
##################################


************
What is new?
************
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
