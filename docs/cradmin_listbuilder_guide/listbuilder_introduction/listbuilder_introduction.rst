.. _listbuilder_introduction:

############
Introduction
############

In this tutorial we will focus on building lists in different ways and demonstrate, if not all, most of the
functionality for lists in CRadmin in an easy way. If you just need to read the documentation about about CRadmin lists,
you'll find this at :doc:`CRadmin lists <../../viewhelpers_listbuilder>`.

This tutorial requires a basic understanding of CRadmin. If you are new to CRadmin, please do the
:ref:`index_gettingstarted` guide before continuing.

We start by creating the some models wich we later on will use to create object instances in our lists. After that we
start by giving a high level overlook of the classes and how they are connected together in CRadmin when we work with
lists. The next part of this tutorial will be in more in depth details about methods and opportunities for lists in
CRadmin.


===========
Models File
===========
When we create the models there is one thing we must keep in mind, and that is the verbose name. As you know Django
sets this to the field name if we don't specific otherwise. In CRadmin the class
:class:`django_cradmin.viewhelpers.listbuilderview.View` expects you to set the model class to display in our list. When
the page with the list, or lists, is rendered CRadmin uses the verbose name as the page title.







