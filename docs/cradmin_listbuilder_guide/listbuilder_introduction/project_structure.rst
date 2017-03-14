.. _listbuilder_project_structure:

=================
Project Structure
=================

In the previous chapter, :ref:`listbuilder_introduction` we created three simple models which we will use when creating
lists with CRadmin. As you read in the getting startedd tutorial we need to create one or more CRadmin applications,
know as crapps, and one or more CRadmin instances to make it all work. In this guide we will create crapps for each
model (Artist, Album, Song), one admin UI and one pubic UI.

::

    cradmin_instances
        __init__.py
        main_crinstance.py
    crapps
        __init__.py
        main_dashboard.py
    templates
        cradmin_listbuilder_guide
        main_dashboard.django.html
    tests
        tests_crapps
            __init__.py
            test_main_dashboard.py


Next Chapter
============
TODO


