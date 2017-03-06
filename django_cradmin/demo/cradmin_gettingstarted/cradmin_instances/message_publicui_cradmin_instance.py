from django_cradmin import crinstance
from django_cradmin.demo.cradmin_gettingstarted.crapps import publicui


class MessagePublicUiCradminInstance(crinstance.NoRoleNoLoginCrAdminInstance):
    id = 'cr_public_message'
    rolefrontpage_appname = 'public_message'

    apps = [
        ('public_message', publicui.App)
    ]

    def get_rolequeryset(self):
        pass
