from django.http import QueryDict
from future.standard_library import install_aliases
install_aliases()

from urllib.parse import urlsplit, urlunsplit


def update_querystring(url, querystringargs, ignore_none_values=True):
    """
    Update the querystring portion of the given ``url``.

    Parameters:
        querystringargs (dict): The querystring args to add/replace.
        ignore_none_values (bool): If this is ``True`` (default),
            we ignore ``None`` values in ``querystringargs``.

    Returns:
        The updated url.

    Examples:

        Add querystring argument::

            from django_cradmin import urlutils
            urlutils.update_querystring('http://example.com', {'search': 'test'})

        Update querystring argument::

            urlutils.update_querystring('http://example.com?search=something&page=2',
                {'search': 'updated'})
    """
    parsed_url = urlsplit(url)
    querydict = QueryDict(parsed_url.query, mutable=True)
    for key, value in querystringargs.items():
        if ignore_none_values and value is None:
            continue
        querydict[key] = value
    return urlunsplit((
        parsed_url.scheme,
        parsed_url.netloc,
        parsed_url.path,
        querydict.urlencode(),
        parsed_url.fragment
    ))
