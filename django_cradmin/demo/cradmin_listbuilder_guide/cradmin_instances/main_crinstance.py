from django_cradmin import crinstance
from django_cradmin.demo.cradmin_listbuilder_guide.crapps import main_dashboard


class MainCradminInstance(crinstance.NoRoleMixin, crinstance.BaseCrAdminInstance):
    id = 'main_crinstance'

    apps = [
        ('main', main_dashboard.App)
    ]

    def get_rolequeryset(self):
        pass
