Easy Change Cradmin Application Urls
====================================
In you CRadmin instance for public UI we have an apps with the name ``public_message``. In our App class within the
``__init__.py`` file we have an url with the name ``crapp.INDEXVIEW_NAME``. This points to the url defined in our
project url for the CRadmin instance. In this cause the url for the CRadmin instance is ``gettingstarted/messages``.
::

    apps = [
        ('public_message', publicui.App),
    ]

When we add a new regular expression for a detail view and name it ``detail`` in the ``__init__.py`` file, the name
``detail`` along with the pk will be added to the url for the CRadmin instance. The url looks like this in the browser
``http://localhost/gettingstarted/messages/detail/1``. However, if you have a project where you want to have more
specified browser urls there is an easy way to get a new url. Let us say we want an url which says
``messages/public/detail/1``. All we need to do is to add a new name and point it to the correct App class for the
view in the ``apps`` list in the CRadmin instance. ::

    apps = [
        ('public_message', publicui.App),
        ('public', publicui.App)
    ]

We update our ``get_url`` method in the ``MessageItemFrameLink`` class so it uses the new application name ::

    def get_url(self):
        return reverse_cradmin_url(
            instanceid='cr_public_message',
            appname='public',
            viewname='detail',
            kwargs={
                'pk': self.message.id
            }
        )

When we now go to the detail view for a message, the url in the browser reads
``http://localhost/gettingstarted/messages/public/detail/1``. Now, we are going to stick with the url
``http://localhost/gettingstarted/messages/detail/1`` in our further work.