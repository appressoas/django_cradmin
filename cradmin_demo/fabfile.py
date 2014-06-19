from fabric.api import task, local
from fabric.context_managers import shell_env
from os import remove
from os.path import exists


SQLITE_DATABASE = 'db.sqlite3'


def _manage(args):
    local('python manage.py {0} --traceback'.format(args))



@task
def syncmigrate():
    """
    Runs the syncdb and migrate django management commands.
    """
    _manage('syncdb --noinput')

@task
def removedb():
    """
    Remove the database.
    """
    if exists(SQLITE_DATABASE):
        remove(SQLITE_DATABASE)

@task
def resetdb():
    """
    Remove db.sqlite if it exists, and run the ``syncmigrate`` task.
    """
    if exists(SQLITE_DATABASE):
        remove(SQLITE_DATABASE)
    syncmigrate()


@task
def recreate_devdb():
    """
    Recreate the test database.
    """
    resetdb(djangoenv)
    _manage('runscript cradmin_demo.project.dumps.dev.data')
