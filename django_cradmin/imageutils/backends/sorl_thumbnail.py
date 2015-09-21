import mimetypes
from sorl.thumbnail import get_thumbnail
from django_cradmin.imageutils.backends import backendinterface


class SorlThumbnail(backendinterface.Interface):
    """
    Sorl-thumbnail backend for ``django_cradmin.imageutils``.
    """

    def transform_image(self, imageurl, **options):
        width = options.get('width', None)
        height = options.get('height', None)
        quality = options.get('quality', 100)
        crop = options.get('crop', 'limit')

        if not width and not height:
            raise ValueError('At least one of width and height must be specified')
        width = width or ''
        height = height or ''
        size = '{}x{}'.format(width, height)

        if crop == 'limit':
            upscale = False
            sorl_crop = None
        else:
            upscale = True
            sorl_crop = 'center'

        mimetype = mimetypes.guess_type(imageurl)[0]
        if mimetype == 'image/jpeg':
            imageformat = 'JPEG'
        elif mimetype == 'image/png':
            imageformat = 'PNG'
        elif mimetype == 'image/gif':
            imageformat = 'GIF'
        else:
            imageformat = 'JPEG'

        return get_thumbnail(
            imageurl, size,
            upscale=upscale,
            quality=quality,
            crop=sorl_crop,
            format=imageformat).url
