.. _listbuilder_artist_dashboard:

================
Artist Dashboard
================
The dashboard for an artist is a straight forward creation of CRadmin application and instance.

CRadmin Application
-------------------

.. literalinclude:: /../django_cradmin/demo/cradmin_listbuilder_guide/crapps/artist/artist_dashboard.py

CRadmin Instance
----------------

.. literalinclude:: /../django_cradmin/demo/cradmin_listbuilder_guide/cradmin_instances/artist_crinstance.py

Template
--------

.. literalinclude:: /../django_cradmin/demo/cradmin_listbuilder_guide/templates/cradmin_listbuilder_guide/artist_dashboard.django.html


Urls
----

::

    class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            artist_dashboard.ArtistBashboardView.as_view(),
            name=crapp.INDEXVIEW_NAME
        )
    ]

Tests
-----
Beside from testing the view, we add tests for the CRadmin instance to make sure our role queryset works as intended.

CRadmin Instance Test
"""""""""""""""""""""

.. literalinclude:: /../django_cradmin/demo/cradmin_listbuilder_guide/tests/test_crinstances/test_artist_crinstance.py

Dashboard View Test
"""""""""""""""""""

.. literalinclude:: /../django_cradmin/demo/cradmin_listbuilder_guide/tests/test_crapps/test_artist/test_artist_dashboard.py
