
class QuerySetForRoleMixin(object):
    def get_model_class(self):
        return self.request.cradmin_app.modelconfig.get_model_class()
        # return self.modelconfig.get_modelclass()

    def get_queryset_for_role(self, role=None):
        return self.get_model_class().objects.all()
