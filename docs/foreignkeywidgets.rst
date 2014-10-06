###########################
How foreignkey widgets work
###########################

Selecting a foreignkey can be handled in multiple ways:

- *Typing in the foreignkey value* - Rarely user
  friendly since foreignkeys usually are internal values.
- *A simple HTML select element* - Works if we have very few items,
  but not a general or scalable solution.
- *Javascript popupwindow (like django admin)* - Not built into
  django-cradmin at this time since it does not provide a good
  user experience (can be blocked, confuse users, etc.)
- *A more fancy javascript based select element with search* - This
  can scale very well, but it is not built into django-cradmin at this
  time.
- **Iframe in popover div** - This is built into django-cradmin, and
  this is what we will discuss in this guide.



The components that make up forkeignkey selection
=================================================
- A model choice widget that renders itself in a form and shows some kind of
  preview/representation of the current value and some way of
  triggering/opening the UI to change the foreignkey value.
- A view that makes it possible to browse and select the foreignkey.
  Preferrable this view should also support adding the item in addition
  to selecting an existing one.
  :class:`django_cradmin.viewhelpers.objecttable.ObjectTableView`
  supports this.
- A comination of javascript and querystring arguments to transport the
  information between the views:

  - We send the current value and ID of the field into the foreignkey select
    view as the ``foreignkey_select_value`` and ``foreignkey_select_fieldid``
    querystring arguments.
  - The foreignkey select view sends the selected value, the fieldid and a preview
    HTML blob back to the parent window of the iframe using ``window.postMessage()``
    with the following JSON encoded data::

        {
          'postmessageid': 'django-cradmin-use-this',
          'value': '<the selected value>',
          'fieldid': '<the fieldid>',
          'preview': '<preview HTML>',
        }

    See the docs for the ``django-cradmin-use-this`` angularjs directive for more
    info about how this works.


Model choice widgets
====================
We currently only have one model choice widget: :class:`django_cradmin.widgets.ModelChoiceWidget`.
It shows a preview and a button that allows the user to trigger the foreignkey select
overlay/popover.



Making a ObjectTableView foreignkey selection view
==================================================
TODO
