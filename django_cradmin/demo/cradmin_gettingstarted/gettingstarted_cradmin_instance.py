from django_cradmin import crinstance
from django_cradmin.demo.cradmin_gettingstarted.models import Account


class GettingStartedCradminInstance(crinstance.BaseCrAdminInstance):
    roleclass = Account

    def get_rolequeryset(self):
        return Account.objects.all()

    def get_titletext_for_role(self, role):
        pass
