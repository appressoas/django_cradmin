.. _all_classes:

===========
The Classes
===========
On a higher level the CRadmin listbuilder have two different type of classes which either participate in giving values
to the list items or builds the list. Further we have a third kind of class which handels the frame around each item.
In this chapter we will give an high level overlook of the structure of classes, what they do and how they are connected
together in CRadmin.


View Classes
============
The listbuilder functionality in CRadmin consits of the following CRadmin classes:

* ViewMixin
* ViewCreateButtonMixin
* View

The View class inherits from Django's generic list view and the CRadmin class WithinRoleViewMixin to implement the
role functionality explained in the :ref:`gettingstarted_part_one` tutorial. Further does the View class have the
CRadmin ViewMixin class as a super, meaning we most of the time implements the View class to get needed functionality
when we work with lists.

Listbuilder Classes
===================

