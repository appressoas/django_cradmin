from django.http import QueryDict
from future.standard_library import install_aliases
install_aliases()

from urllib.parse import urlsplit, urlunsplit


def update_querystring(url, **querystringargs):
    """
    Update the querystring portion of the given ``url``.

    Parameters:
        querystringargs: The querystring args to add/replace.

    Returns:
        The updated url.

    Examples:

        Add querystring argument::

            from django_cradmin import urlutils
            urlutils.update_querystring('http://example.com', search='test')

        Update querystring argument::

            urlutils.update_querystring('http://example.com?search=something&page=2',
                search='updated')
    """
    parsed_url = urlsplit(url)
    querydict = QueryDict(parsed_url.query, mutable=True)
    for key, value in querystringargs.items():
        querydict[key] = value
    return urlunsplit((
        parsed_url.scheme,
        parsed_url.netloc,
        parsed_url.path,
        querydict.urlencode(),
        parsed_url.fragment
    ))
