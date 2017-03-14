.. _listbuilder_main_dashboard:

==================
The Main Dashboard
==================
In this chapter we build the main dashboard which will serve as a gateway to our different kind of lists views. We
assume you allready are familiar with Cradmin applications and instances, so we just show the finished code.

CRadmin Application
-------------------
Since this application lives alone as a file inside the crapps folder, we add the App class directly in this file
rather than using the folders init file.

.. literalinclude:: /../django_cradmin/demo/cradmin_listbuilder_guide/crapps/main_dashboard.py


CRadmin Instance
----------------
This CRadmin instance do not require a role.

.. literalinclude:: /../django_cradmin/demo/cradmin_listbuilder_guide/cradmin_instances/main_crinstance.py


Template
--------
When we don't require a role, the template can extend the ``standalone-base`` html file in CRadmin.

.. literalinclude:: /../django_cradmin/demo/cradmin_listbuilder_guide/templates/cradmin_listbuilder_guide/main_dashboard.django.html


Test
----

.. literalinclude:: /../django_cradmin/demo/cradmin_listbuilder_guide/tests/test_crapps/test_main_dashboard.py