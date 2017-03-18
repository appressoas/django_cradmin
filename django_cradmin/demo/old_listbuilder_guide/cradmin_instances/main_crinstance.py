from django_cradmin import crinstance
from django_cradmin.demo.cradmin_listbuilder_guide.crapps import artist_app
from django_cradmin.demo.cradmin_listbuilder_guide.crapps import main_dashboard


class MainCradminInstance(crinstance.NoRoleMixin, crinstance.BaseCrAdminInstance):
    id = 'main_crinstance'

    apps = [
        ('main', main_dashboard.App),
        ('artist', artist_app.App)
    ]

    def get_rolequeryset(self):
        pass

    def has_access(self):
        if self.request.user.is_authenticated:
            return True
