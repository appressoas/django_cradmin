from pkg_resources import resource_string
import json
import sys

default_app_config = 'django_cradmin.appconfig.CradminAppConfig'

if sys.version_info.major == 2:
    __version__ = json.loads(resource_string(__name__, 'version.json'))
else:
    __version__ = json.loads(resource_string(__name__, 'version.json').decode('utf-8'))
