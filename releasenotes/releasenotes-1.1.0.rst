#################################
Django cradmin 1.1.0 releasenotes
#################################


************
What is new?
************
- Django 1.9 support.
    - Also tested with Django 1.10b1, and all tests pass, and everything seems to work as it should.
    - Minumum Django version is still 1.8.
- Minimum version of Django-crispy-forms updated to 1.6.0.



****************
Breaking changes
****************


The ``cradmin_texformatting_tags`` template library was removed
===============================================================
It used deprecated and non-public APIs. It is not in use anywhere in the library,
and was undocumented, so this should hopefully not cause any major issues for any users.


Custom themes must update their cradmin_base-folder
===================================================
Because of some minor changes in form rendering in ``django-crispy-forms`` 1.6.0, all custom
themes must update their ``cradmin_base`` folder to the base folder. The changes was made
in commit d7b0c061e805431d01d4a48dd7def8c6ad2414ba.


Can no longer set button classes using field_classes
====================================================
This is due to changes in ``django-crispy-forms`` 1.6.0. Buttons inheriting from
``django_cradmin.crispylayouts.CradminSubmitButton`` (or PrimarySubmit, DangerSubmit, DefaultSubmit, ...),
must set their CSS classes using the ``button_css_classes`` attribute instead.
