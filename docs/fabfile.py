from fabric.api import local, task


@task
def docs():
    """
    Build the docs.
    """
    local('sphinx-build -b html . _build')
