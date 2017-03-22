.. _listbuilder_template_listbuilderview:

============================
Template For Listbuilderview
============================
In the last chapter we worked on the template for how to list item value, now we will work with the template for
the view itself.

Customizing the page heading
----------------------------
The page heading is now just *Songs*. This is not enough information, we want it to say *Songs on album <album.title>*.
To make this happen we need to return some new contex data in the class ``TemplateListbuilderView`` and override a block
in our the template ``my_great_listbuilderview.django.html``.

ListbuilderView
"""""""""""""""
To get the album we can use the CRadmin role to get the correct object instance. After an update of the code, our
listbuilder view class looks like this:
::

    class TemplateListbuilderView(mixins.SongRolequeryMixin, listbuilderview.View):
    """"""
    model = Song
    value_renderer_class = TemplateItemValue
    template_name = 'cradmin_listbuilder_guide/template_app/my_great_listbuilderview.django.html'

    def __get_album(self):
        queryset = Album.objects.filter(id=self.request.cradmin_role.id).get()
        return queryset

    def get_context_data(self, **kwargs):
        context = super(TemplateListbuilderView, self).get_context_data(**kwargs)
        context['album'] = self.__get_album()
        return context

Updating the Template
"""""""""""""""""""""
Our template ``my_great_listbuilderview.django.html`` extends a template which have several blocks we can override. To
get a new page heading we need to override the block heading and make it return the album we got from the context data
in our listbuilder view class. As you see below, this is pretty much as working with any other Django template.
::

    {% extends 'django_cradmin/viewhelpers/listbuilderview/default.django.html' %}

    {% block heading %}
        {{ pageheading }} on album {{ album }}
    {% endblock heading %}

Testing the ListbuilderView
"""""""""""""""""""""""""""
We create a new test class eventhough it uses the same viewclass as the testing done for the item value template, we
want to keep them apart since the content is rendered in different templates. So the first test is a check that our
page is rendered with the new page heading when everything is sane. In the second test we checks that album title is in
the page heading a user is administrator for two albums,  thus, checking our new method in the class
``TemplateListbuilderView``
::

    class TestListbuilderViewTemplate(TestCase, cradmin_testhelpers.TestCaseMixin):
    """Tests of the template for the listbuilder view"""
    viewclass = template_listview.TemplateListbuilderView

    def __set_cradmin_role(self):
        return mommy.make('cradmin_listbuilder_guide.Album', title='My Album')

    def test_render_page_sanity(self):
        """Is the primary h1 rendered with new context from our template"""
        album = self.__set_cradmin_role()
        mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=album)
        self.assertTrue(mockresponse.selector.one('.test-primary-h1'))
        expected_h1 = 'Songs on album {}'.format(album.title)
        actual_h1 = mockresponse.selector.one('.test-primary-h1').text_normalized
        self.assertEqual(expected_h1, actual_h1)

    def test_render_page_when_user_is_admin_for_two_albums(self):
        """Only album which is cradmin role should show as part of primary h1"""
        album = self.__set_cradmin_role()
        user = mommy.make(settings.AUTH_USER_MODEL)
        mommy.make(
            'cradmin_listbuilder_guide.AlbumAdministrator',
            album=album,
            user=user
        )
        album_two = mommy.make('cradmin_listbuilder_guide.Album')
        mommy.make('cradmin_listbuilder_guide.AlbumAdministrator',user=user, album=album_two)
        mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=album)
        self.assertTrue(mockresponse.selector.one('.test-primary-h1'))
        expected_h1 = 'Songs on album {}'.format(album.title)
        actual_h1 = mockresponse.selector.one('.test-primary-h1').text_normalized
        self.assertEqual(expected_h1, actual_h1)

Next Chapter
------------
TODO