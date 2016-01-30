import sys

try:
    from unittest import mock  # noqa
except ImportError:
    import mock  # noqa


def is_python2():
    return sys.version_info[0] == 2


__all__ = ['mock', 'is_python2']
