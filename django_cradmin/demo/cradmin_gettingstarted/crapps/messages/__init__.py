from django_cradmin import crapp
from django_cradmin.demo.cradmin_gettingstarted.crapps.messages import message_edit_views
from django_cradmin.demo.cradmin_gettingstarted.crapps.messages import message_list_view


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            message_list_view.MessageListBuilderView.as_view(),
            name=crapp.INDEXVIEW_NAME
        ),
        crapp.Url(
            r'^create$',
            message_edit_views.CreateMessageView.as_view(),
            name='create'
            ),
        crapp.Url(
            r'^edit/(?P<pk>\d+)$',
            message_edit_views.MessageEditView.as_view(),
            name='edit'
        ),
        crapp.Url(
            r'^delete/(?P<pk>\d+)$',
            message_edit_views.MessageDeleteView.as_view(),
            name='delete'
        )
    ]
