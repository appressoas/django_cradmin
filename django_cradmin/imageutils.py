import os
from sorl.thumbnail import get_thumbnail


def request_thumbnail(
        image, width=None, height=None, format='auto', colorspace='RGB',
        upscale=True, quality=95,
        scalemethod='contain'):
    """
    Thin wrapper around sorl-thumbnail (``sorl.thumbnail.get_thumbnail``).

    Requires that you have sorl-thumbnail installed.

    Parameters:
        image: A django ImageField object.
        width:
            The maximum width of the resulting image.
            How this is handled depends on the ``scalemethod``.
            Can be ``None`` if ``height`` is specified.
        height:
            The maximum height of the resulting image.
            How this is handled depends on the ``scalemethod``.
            Can be ``None`` if ``width`` is specified.
        format:
            Must be one of
        upscale:
            Upscale is a boolean and controls if the image can be upscaled or not.
            For example if your source is 100x100 and you request a thumbnail of size
            ``200x200`` and upscale is False this will return a thumbnail of size ``100x100``.
            If upscale was True this would result in a thumbnail size ``200x200`` (upscaled).
            The default value is ``True``.
        quality:
            Quality is a value between 0-100 and controls the thumbnail write quality.
            Default value is 95.
        colorspace:
            This controls the resulting thumbnails color space, valid values
            are: ``'RGB'`` and ``'GRAY'``. Default value is ``'RGB'``.
        scalemethod:
            How do we scale the image. Possible values:

            - ``contain``: Scale the image down so the entire image fits within
              the ``width`` and ``height``.
            - ``cover``: Scale down and crop the image to make it fill the
              ``width`` and ``height`` box.

            The default is ``contain``.
    """
    if width is None and height is None:
        raise ValueError('At least one of width and height must be specified')
    size = '{}x{}'.format(width, height)

    if scalemethod == 'contain':
        crop = None
    elif scalemethod == 'cover':
        crop = 'center'
    else:
        raise ValueError('{!r} is an invalid value for scalemethod. Valid values: "contain", "cover".')

    if format == 'auto':
        name, extension = os.path.splitext(image.name)
        if extension in ('.png', '.gif'):
            detected_format = 'PNG'
        else:
            detected_format = 'JPEG'
    elif format not in ('JPEG', 'PNG'):
        raise ValueError('{!r} is an invalid value for format. Valid values: "auto", "JPEG", "PNG".')
    else:
        detected_format = format
    return get_thumbnail(
        image, size, upscale=upscale, quality=quality, crop=crop, format=detected_format)
