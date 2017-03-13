.. _view_mixin_classes:

===========
The Classes
===========

The listbuilder functionality in CRadmin consits of the following CRadmin classes:

* ViewMixin
* ViewCreateButtonMixin
* View

The View class inherits from Django's generic list view and the CRadmin class WithinRoleViewMixin to implement the
role functionality explained in the :ref:`gettingstarted_part_one` tutorial. Further does the View class have the
CRadmin ViewMixin class as a super, meaning we most of the time implements the View class to get needed functionality
when we work with lists.

