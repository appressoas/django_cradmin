import os

from invoke import task, run
from invoke_extras.context_managers import cd

LANGUAGE_CODES = ['en', 'nb']
SQLITE_DATABASE = 'db.sqlite3'
SQL_DUMP_FILE = os.path.join(
    'django_cradmin', 'demo', 'project', 'dumps', 'dev', 'data.sql')


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
    removedb()
    syncmigrate()


@task
def recreate_devdb():
    """
    Recreate the test database.
    """
    removedb()
    _load_devdb_sqldump()
    syncmigrate()


@task
def recreate_devdb_with_randomdata():
    """
    Recreate the test database and create random test data
    """
    recreate_devdb()
    _manage('cradmin_webdemo_autogenerate_data')


def _load_devdb_sqldump():
    run('sqlite3 db.sqlite3 ".read {}"'.format(SQL_DUMP_FILE))


@task
def dump_current_db_to_sql():
    """
    Dump current db into ``django_cradmin/demo/project/dumps/dev/data.sql``.
    """
    result = run('sqlite3 db.sqlite3 ".dump"', echo=False)
    with open(SQL_DUMP_FILE, 'wb') as outfile:
        outfile.write(result.stdout.encode('utf-8'))
    print()
    print("*" * 70)
    print()
    print('{} successfully updated.'.format(SQL_DUMP_FILE))
    print()
    print("*" * 70)
    print()
