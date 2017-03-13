.. _all_classes:

===========
The Classes
===========
On a higher level the CRadmin listbuilder have two different type of classes which either participate in giving values
to the list items or builds the list. Further we have a third kind of class which handels the frame around each item.
In this chapter we will give an high level overlook of the structure of classes, what they do and how they are connected
together in CRadmin. You can read the :doc:`CRadmin list API <../../viewhelpers_listbuilder>` to get more information
and details about the methods and functionality.

View Classes
============
The listbuilder view functionality in CRadmin consits of the following CRadmin classes:

* ViewMixin
* ViewCreateButtonMixin
* View

The View class inherits from Django's generic list view and the CRadmin class WithinRoleViewMixin to implement the
role functionality explained in the :ref:`gettingstarted_part_one` tutorial. Further does the View class have the
CRadmin ViewMixin class as a super, meaning we most of the time implements the View class to get needed functionality
when we work with lists.

ViewMixin Class
"""""""""""""""
This class do not have a super, but is a super to the Cradmin View class. It is possible to implement this class
directly and skip the CRadmin View class if you overwrite some methods. It is in this class we set the template name
for our view. There is alos possible to customize the template by overriding methods such as hiding the page header, by
changing boolean variables.

ViewCreateButtonMixin Class
"""""""""""""""""""""""""""
This class adds a create button in a template. It presupposes the create view is named ``create``. This is very
practical when we have a list of objects in an admin view and want to add new instances. Just like the CRadmin class
ViewMixin this class do not have a super.

View Class
""""""""""
Very often this is the class we use as a super when working with lists in a template, since it be default inherit from
the ViewMixin class. This class gives us the context data, the model we're working with and it is here we set the
queryset for the role. Further the class has functionality such as hiding the menu by overriding the default value of
a boolean variable. This makes it easy when we don't want a user to accidently click out of the current view.


Listbuilder Classes
===================
When it comes to the listbuilder classes in CRadmin, there is some abstract classes which we normally don't use
directly. For most cases we use the :class:`django_cradmin.viewhelpers.listbuilder.base.List` to build the HTML
lists or other kind of lists we want to create. However in some rather rare cases you will find it easier to write a
new List class. CRadmin allows this as you are not restricted to use the
:class:`django_cradmin.viewhelpers.listbuilder.base.List`. Further we have a set of base classes which works as super
for functionality such as item value and item frame.

Base Classes
------------
* AbstractItemRenderer (abstract)
* ItemValueRenderer (abstract)
* ItemFrameRenderer (abstract)
* List

AbstractItemRenderer
""""""""""""""""""""
This class inherit from the :class:`django_cradmin.renderable.AbstractRenderableWithCss` which again have the class
:class:`django_cradmin.renderable.AbstractRenderable` as a super. The Abstract Item Renderer gives our list items the
variable name ``value``, meaning we can get a hold of an object instance with ``self.value`` in a python file or use
``me.value`` to get the hold of an object instance in a template file. While this is great, it also rises some
difficulties when we're working with nested lists which contains of different objects. This is solved by setting a
string to the variable ``valuealias`` which overrides the ``value``. So if we're working with both albums and songs
in nested lists, we can set one List class to have the ``valuealias`` to band and the other to song. So in the template
we than can say ``me.band`` and ``me.song`` to keep track of which kind of object instance we're currently working on.

ItemValueRenderer
"""""""""""""""""
This class have the class :class:`django_cradmin.viewhelpers.listbuilder.base.AbstractItemRenderer` as a super. The main
purpose of this class is to render the value for the each item in the class
:class:`django_cradmin.viewhelpers.listbuilder.base.List`. Further is helps with setting the name for the CRadmin test
css classes which are used in unittesting to prevent test failure because of removing a css class. In the CRadmin class
ItemValueRenderer we can also add a list of our own base css classes used to style whatever we need to style.

List
""""
This class :class:`django_cradmin.renderable.AbstractRenderableWithCss` as a super, and is usually the class we use
as a super when we want to render a list. It can be used in both an very easy manner and for more complex structures.
It is here we decide which template we want to use for building the list. The CRadmin class List gets an iterator, which
is used to iter over items in the list. We can both append and extend the list with methods from this class. Further
can we extend the list with an iterable of values. On a high level this means we can have different item value classes
for items in a list.


Lists classes
-------------
The Row list class :class:`django_cradmin.viewhelpers.listbuilder.lists.RowList` uses the base List class as a super,
and it's purpose is to allow a creation of a row list instead of the standard list.

Item Value Classes
------------------
There are several item value classes which more or less fulfills out basic needs. However, when we work on more complex
structures we most likely ends up with writing our own subclasses of the class
:class:`django_cradmin.viewhelpers.listbuilder.base.ItemValueRenderer`.

We have the following item value classes

* FocusBox
* TitleDescription
* UseThis
* EditDelete
* EditDeleteWithPreview
* EditDeleteWithArchiveImage

Item Frame Classes
------------------













































