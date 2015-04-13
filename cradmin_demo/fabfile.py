from __future__ import unicode_literals
from fabric.api import task, local
import os


SQLITE_DATABASE = 'db.sqlite3'
DUMPSCRIPT_DATAFILE = os.path.join(
    'cradmin_demo', 'project', 'dumps', 'dev', 'data.py')


def _manage(args, capture=False):
    command = 'python manage.py {0} --traceback'.format(args)
    if capture:
        return local(command, capture=True)
    else:
        local(command)


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
    if os.path.exists(SQLITE_DATABASE):
        os.remove(SQLITE_DATABASE)


@task
def resetdb():
    """
    Remove db.sqlite if it exists, and run the ``syncmigrate`` task.
    """
    if os.path.exists(SQLITE_DATABASE):
        os.remove(SQLITE_DATABASE)
    syncmigrate()


@task
def recreate_devdb():
    """
    Recreate the test database.
    """
    resetdb()
    _manage('runscript cradmin_demo.project.dumps.dev.data')


@task
def recreate_devdb_with_randomdata():
    """
    Recreate the test database and create random test data
    """
    recreate_devdb()
    _manage('cradmin_webdemo_autogenerate_data')


@task
def dump_current_db_to_dumpscript_datafile():
    """
    Dump current db to the dumpscript dataset.
    """
    dump = _manage('dumpscript auth.User webdemo', capture=True)
    with open(DUMPSCRIPT_DATAFILE, 'wb') as outfile:
        outfile.write(dump + '\n')
