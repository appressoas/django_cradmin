from django_cradmin import crapp
from django_cradmin.superuserui.views import createview
from django_cradmin.superuserui.views import deleteview
from django_cradmin.superuserui.views import editview
from django_cradmin.superuserui.views import listview


class DjangoModelCrApp(crapp.App):
    """
    Cradmin App that provides list, create, update and delete views
    for a Django model.
    """

    #: The :class:`django_cradmin.superuserui.superuserui_registry.ModelConfig` this
    #: app belongs to.
    #: This is set automatically in
    #: :meth:`django_cradmin.superuserui.superuserui_registry.ModelConfig.make_crapp_class`
    modelconfig = None

    @classmethod
    def get_listview_class(cls):
        return listview.View

    @classmethod
    def get_editview_class(cls):
        return editview.View

    @classmethod
    def get_createview_class(cls):
        return createview.View

    @classmethod
    def get_deleteview_class(cls):
        return deleteview.View

    @classmethod
    def get_appurls(cls):
        appurls = []
        listview_class = cls.get_listview_class()
        if listview_class:
            appurls.append(crapp.Url(
                r'^$',
                listview_class.as_view(),
                name=crapp.INDEXVIEW_NAME))
            appurls.append(crapp.Url(
                r'^filter/(?P<filters_string>.+)?$',
                listview_class.as_view(),
                name='filter'))
        else:
            raise NotImplementedError('You must return a view class from get_listview_class(). '
                                      'Note that it can be something other than a list view, '
                                      'such as an overview of with information/stats for the model.')

        createview_class = cls.get_createview_class()
        if createview_class:
            appurls.append(crapp.Url(
                r'^create/$',
                createview_class.as_view(),
                name="create"))

        editview_class = cls.get_editview_class()
        if editview_class:
            appurls.append(crapp.Url(
                r'^edit/(?P<pk>\d+)$',
                editview_class.as_view(),
                name="edit"))

        deleteview_class = cls.get_deleteview_class()
        if deleteview_class:
            appurls.append(crapp.Url(
                r'^delete/(?P<pk>\d+)$',
                deleteview_class.as_view(),
                name="delete"))
        return appurls
