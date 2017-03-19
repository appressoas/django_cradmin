.. _listbuilder_crinstance:

================
CRadmin Instance
================
In ths guide we will use one CRadmin instance which will hold all our crapps. We will only render templates which
will require a role, so we extend the Base CRadmin instance class and set the roleclass to Album. Further we implement
the abstract methods from the super class. The role queryset is that we only return albums where the logged in user is
an administrator. For now we just pass the title text for role.

Since we only have once CRadmin instance for this project, we can create the file ``listbuilder_crinstance.py`` at the
same level as our models and admin files. Before we have created any Cradmin applications, our CRadmin instance file
looks like this.

::

    from django_cradmin import crinstance
    from django_cradmin.demo.cradmin_listbuilder_guide.models import Album


    class ListbuilderCradminInstance(crinstance.BaseCrAdminInstance):
        """"""
        id = 'listbuilder_crinstance'
        roleclass = Album
        rolefrontpage_appname = ''
        apps = [
            ()
        ]

        def get_titletext_for_role(self, role):
            pass

        def get_rolequeryset(self):
            queryset = Album.objects.all()
            if not self.request.user.is_superuser:
                queryset = queryset.filter(albumadministrator__user=self.request.user)
            return queryset

Next Chapter
------------
TODO