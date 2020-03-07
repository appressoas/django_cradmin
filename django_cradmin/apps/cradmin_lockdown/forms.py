from lockdown.forms import LockdownForm


class BaseDjangoCradminLockdownForm(LockdownForm):
    """
    Extension of the lockdown form from django-lockdown. To use this form, set the path to it in the setting
    variable `LOCKDOWN_FORM`.

    If you need a more advanced lockdown form, extend this class and add functionality in a project.

    If you only want to change the templates for lockdown, extend the `form.html` from this module.
    Make sure that `lockdown` is added after the app which has the custom template in installed apps. Since lockdown
    searches for the template `form.html` in `lockdown`, we have to use this structure when adding the folders and files
        <app_name>
            <templates>
                <lockdown>
                    <form.html>
    """
