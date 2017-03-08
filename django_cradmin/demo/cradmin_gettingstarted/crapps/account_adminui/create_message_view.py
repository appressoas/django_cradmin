from django_cradmin import viewhelpers
from django_cradmin.demo.cradmin_gettingstarted.crapps.account_adminui import mixins


class CreateMessageView(mixins.MessageCreateUpdateMixin, viewhelpers.formview.WithinRoleCreateView):
    roleid_field = 'account'

    # when saving add the current account to account field
    def save_object(self, form, commit=True):
        self.new_message = super(CreateMessageView, self).save_object(form, commit)
        self.new_message.account = self.request.cradmin_role
        self.new_message.full_clean()
        self.new_message.save()
        return self.new_message


