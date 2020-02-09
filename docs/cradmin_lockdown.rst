##############################################################
`cradmin_lockdown` --- Project specific templates for lockdown
##############################################################


The purpose of the :mod:`django_cradmin.apps.cradmin_lockdown` app is to make possible with different templates on
staging for different projects which require lockdown.


*********
Configure
*********

Required settings:
    If you only want to change the templates for lockdown, extend the `form.html` from this module.
    Make sure that `lockdown` is added after the app which has the custom template in installed apps. Since lockdown
    searches for the template `form.html` in `lockdown`, we have to use this structure when adding the folders and files
        <app_name>
            <templates>
                <lockdown>
                    <form.html>

Optional settings:
    LOCKDOWN_FORM
        The name of the form if you don't want to use the default form class. Cradmin_lockdown has a base form class
        named `BaseDjangoCradminLockdownForm` which you ought to extend in the project.
