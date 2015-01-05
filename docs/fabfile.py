from shutil import rmtree
import os.path
from glob import glob
from fabric.api import local, task


@task
def docs():
    """
    Build the docs.
    """
    local('sphinx-build -b html . _build')
