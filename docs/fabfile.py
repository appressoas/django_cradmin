from shutil import rmtree
import os.path
from glob import glob
from fabric.api import local, task


@task
def docs():
    """
    Build the docs.
    """
    apidocdir = '_apidoc'
    if os.path.exists(apidocdir):
        rmtree(apidocdir)

    exclude = glob('../django_cradmin/*/migrations/') \
            + glob('../django_cradmin/*/tests/')
    exclude = map(os.path.abspath, exclude)

    local('sphinx-apidoc -o develop/_apidoc/ --no-toc ../django_cradmin {exclude}'.format(
        exclude=' '.join(exclude)
    ))
    local('sphinx-build -b html . _build')
