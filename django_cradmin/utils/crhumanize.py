

def human_readable_filesize(size_in_bytes):
    """
    Humanize the given file size in bytes.

    Returns a number suffixed with ``B``, ``KB``, ``MB``,
    ``GB`` or ``TB``.
    """
    if size_in_bytes < 1000:
        return '{}B'.format(size_in_bytes)
    if size_in_bytes < 1000000:
        return '{}KB'.format(int(size_in_bytes / 1000.0))
    elif size_in_bytes < 1000000000:
        return '{:.1f}MB'.format(size_in_bytes / 1000000.0)
    elif size_in_bytes < 1000000000000:
        return '{:.2f}GB'.format(size_in_bytes / 1000000000.0)
    else:
        return '{:.2f}TB'.format(size_in_bytes / 1000000000000.0)
