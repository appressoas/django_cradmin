from django_cradmin import crinstance


class CreateAccountCradminInstance(crinstance.NoRoleMixin, crinstance.BaseCrAdminInstance):
    id = 'account_create'
    rolefrontpage_appname = 'default'

    apps = [
        'deault',
    ]