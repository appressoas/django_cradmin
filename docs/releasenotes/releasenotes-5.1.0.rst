#################################
Django cradmin 5.1.0 releasenotes
#################################


************
What is new?
************
- Various bug fixes in django_cradmin_js.
- ``crmenu`` module: Use cricon for the menu toggle.
- ``delay_middleware`` module: Use the "new" django middleware format.
- loading-indicator (both css and javascript): Support visible message, not just screenreader message.
- button styles: Make it easier to create custom button styles with some new mixins.
- ``page-cover-mixin`` SASS mixin: Add __button BEM element.
- Add new ``block`` BEM block.


***************************
Migrate from 5.0.0 to 5.1.0
***************************

The only thing that may cause problems would be the cricon in the crmenu menu toggle if you have
customized that a lot. In that case, you will probably have to create your own
subclass of :class:`django_cradmin.crmenu.MenuToggleItemItemRenderable`.
