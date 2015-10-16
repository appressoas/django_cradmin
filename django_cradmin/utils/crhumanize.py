

def human_readable_filesize(size):
    if size < 1000:
        return '{}B'.format(size)
    if size < 1000000:
        return '{}KB'.format(int(size / 1000.0))
    elif size < 1000000000:
        return '{:.1f}MB'.format(size / 1000000.0)
    elif size < 1000000000000:
        return '{:.2f}GB'.format(size / 1000000000.0)
    else:
        return '{:.2f}TB'.format(size / 1000000000000.0)
