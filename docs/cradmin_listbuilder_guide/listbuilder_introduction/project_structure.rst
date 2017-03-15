.. _listbuilder_project_structure:

=================
Project Structure
=================
You may or may not follow the same structure in your project as we do in this guide. So we will show the entire
structure of the project just this once. After implementing the CRadmin instances and applications, adding templates and
perform testing our project structure looks like this:
::

    cradmin_instances
        __init__.py
        artist_crinstance.py
        main_crinstance.py
    crapps
        album_app
            __init__.py
            album_dashboard.py
        artist_app
            __init__.py
            artist_dashboard.py
        song_app
            __init__.py
            song_dashboard.py
        __init__.py
        main_dashboard.py
    templates
        cradmin_listbuilder_guide
            album_dashbaord.django.hmtl
            artist_dashboard.django.html
            main_dashboard.django.html
            song_dashboard.django.html
    tests
        tests_crapps
            test_adlbum_app
                __init__.py
                test_album_dashboard.py
            test_artist_app
                __init__.py
                test_artist_dashboard.py
            test_song_app
                __init__.py
                test_song_dashboard.py
            __init__.py
            test_main_dashboard.py
        test_crinstances
            __init__.py
            test_artist_crinstance.py
        test_models
            __init__.py
            test_album.py
            test_artist.py
            test_song.py
        __init__.py
    __init__.py
    admin.py
    models.py

Next Chapter
============
TODO


