import os
import shutil
import sys
import subprocess

from invoke import task, run


@task
def docs():
    """
    Build the docs.
    """
    run('sphinx-build -b html . _build')


def _open_file(filename):
    if sys.platform == "win32":
        os.startfile(filename)
    else:
        if sys.platform == "darwin":
            opener = "open"
        else:
            opener = "xdg-open"
        subprocess.call([opener, filename])


@task
def opendocs():
    """
    Open docs in the default browser.
    """
    _open_file('_build/index.html')


@task
def clean():
    """
    Remove all files built for the docs.
    """
    if os.path.exists('_build'):
        shutil.rmtree('_build')
