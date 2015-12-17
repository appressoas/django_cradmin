from django import forms

from django_cradmin.superuserui.views import mixins
from django_cradmin.viewhelpers import update


class View(mixins.QuerySetForRoleMixin, update.UpdateView):

    def get_form_class(self):
        me = self

        class Form(forms.ModelForm):
            class Meta:
                model = me.get_model_class()
                fields = me.get_model_fields()

        return Form
