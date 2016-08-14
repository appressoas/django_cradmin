#######################
Creating a custom theme
#######################

..
    To create a custom theme, you need to copy the ``cradmin_base`` LESS library
    into your own project. You will most likely also want to copy one of the
    provided themes and extend that instead of just the common styles.


    ******************************
    Prepartion - install bootstrap
    ******************************
    You need to install Twitter bootstrap and ensure that you
    have the bootstrap LESS files on your LESS path. You need
    to have the following directory structure where ``somefolder``
    is on your LESS path::

        somefolder/
            less/
                variables.less
                scaffolding.less
                .. and all the other bootstrap less files ..

    In LESS terms this means that you should have a LESS setup
    where bootstrap styles can be imported like this:

    .. code-block:: css

        @import "bootstrap/less/something.less"

    The easiest way of getting this is to use Bower::

        $ bower install bootstrap

    and add ``bower_components/`` to your LESS path.


    ****************
    Create the theme
    ****************
    For this example we will assume you want to extend the default theme::

        $ cd django_cradmin_reporoot/django_cradmin/static/django_cradmin/src/less/
        $ cp -r cradmin_base cradmin_theme_default /path/where/you/store/your/less/files/

    Next, create a directory for your theme, and add a ``theme.less`` file containing

    .. code-block:: css

        @import "../cradmin_theme_default/theme";

        // Your custom styles here

    You will typically want to mirror the structure of ``cradmin_base``, and create
    a .less file in your theme directory for each file in ``cradmin_base/`` you override.
    You will also typically want to use variables as much as possible. Lots of things
    can be adjusted by just changing a couple of bootstrap and cradmin LESS variables.

    How you build the theme is up to you, but you need to build ``yourtheme/theme.less``
    and update the ``DJANGO_CRADMIN_THEME_PATH``-setting to point to your theme
    (see :setting:`DJANGO_CRADMIN_THEME_PATH`).


***************
Getting started
***************
TODO



****************
SASS style guide
****************
- Indent with 4 spaces.
- Use BEM naming syntax. See http://getbem.com/ and http://cssguidelin.es/#bem-like-naming.
- Document everything with `PythonKSS <http://pythonkss.readthedocs.io/en/latest/style_documentation_syntax.html>`_.


****************
HTML style guide
****************

- **Never** use ID for styling.
- Prefix IDs with ``id_``, and write ids in all lowercase with words separated by a single ``_``.
  Example: ``id_my_cool_element``.
- Separate css classes with two spaces. Example: ``<div class=class1  class2>``
