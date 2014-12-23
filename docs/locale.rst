#########################
Updating the translations
#########################

To update the translations::

    $ cd /path/to/reporoot/django_cradmin
    $ python ../manage.py makemessages -l <LANGUAGECODE> -i "static/*"
    ... e.g.:
    $ python ../manage.py makemessages -l nb -i "static/*"

To edit the translations, open ``/path/to/reporoot/django_cradmin/locale/<LANGUAGECODE>/LC_MESSAGES/django.po``
in PoEdit, edit the translation, save and commit the changes (including the compiled ``.mo`` file.
