from fabric.context_managers import lcd
from fabric.decorators import task
from fabric.operations import local


@task
def makemessages(language):
    """
    """
    with lcd('django_cradmin'):
        local('python ../manage.py makemessages '
              '-l {language} '
              '-i "node_modules/*" '
              '-i "static/*"'.format(language=language))
