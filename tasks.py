import os

from invoke import task, run
from invoke_extras.context_managers import cd

LANGUAGE_CODES = ['en', 'nb']


def _manage(args, echo=True, cwd=None, **kwargs):
    management_script = 'manage.py'
    if cwd:
        cwd = os.path.abspath(cwd)
        management_script = os.path.relpath(os.path.abspath(management_script), cwd)
    command = 'python {} {} --traceback'.format(management_script, args)
    if cwd:
        with cd(cwd):
            result = run(command, echo=echo, **kwargs)
    else:
        result = run(command, echo=echo, **kwargs)
    return result


@task
def makemessages():
    for languagecode in LANGUAGE_CODES:
        _manage('makemessages -l {} '
                '-i "node_modules/*" '
                '-i "demo/*" '
                '-i "static/*"'.format(languagecode),
                cwd='django_cradmin')


@task
def compilemessages():
    _manage('compilemessages', cwd='django_cradmin')
