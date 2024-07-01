import os

__version__ = "10.4.1"


def get_static_version():
    """
    The static version is the one used for static file paths. It
    is just the same as the actual version, but with ``+`` replaced
    with ``-`` to make it more URL friendly (for versions like ``4.5.0a1+mybranch``)
    """
    if os.environ.get('LOCAL_DEV_MODE', 'False') == 'True':
        return 'local-dev-static-build'
    else:
        return __version__.replace('+', '-')
