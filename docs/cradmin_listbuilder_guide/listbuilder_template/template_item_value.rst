.. _listbuilder_template_item_value:

=======================
Template For Item Value
=======================
We will demonstrate two ways to add our own content to the template which renders the item value. In the our class
``TemplateItemValue`` we add a new method which return a dict of extra information about the song object.

::

    class TemplateItemValue(listbuilder.base.ItemValueRenderer):
    """"""
    template_name = 'cradmin_listbuilder_guide/template_app/my_great_item_value.django.html'
    valuealias = 'song'

    def get_extra_info(self):
        song_info = {
            'written_by': self.song.written_by,
            'on_album': self.song.album
        }
        return song_info

Next we move over to the template and write some tags to get it in good order. First we must load the CRadmin tags, so
we can add our own test CSS classes. As you can see in the code below we don't call the super for the content block,
because we want the song title to be a heading. In the html-tag <h3> we add a CRadmin test CSS class and say that the
heading should be the title of the song. This is one way to add extra content to a template. Strictly speaking, we
have done pretty much just what the listbuilder class ``TitleDescription`` does, expect it uses a h2 tag as a blocklist
title, while we use use a h3 tag.

Next we add two blocks, named ``extra_info`` and ``extra_info_content``. In the block we loop over the items in the
dict we return in the method ``get_extra_info`` and put both the key and value of each item in a p-tag which is extra
tight to save some white space. Further we add a CRadmin test CSS class which we will use for testing. The template
now looks like this:

::

    {% extends 'django_cradmin/viewhelpers/listbuilder/base/itemvalue.django.html' %}
    {% load cradmin_tags %}

    {% block content  %}
        <h3 class="{% cradmin_test_css_class 'song-heading' %}">{{ me.song.title }}</h3>
        {% block extra_info %}
            {% block extra_info_content %}
                {% for key, value in me.get_extra_info.items %}
                    <p class="paragraph paragraph--xtight {% cradmin_test_css_class 'extra-info-content' %}">
                        {{ key }}: {{ value }}
                    </p>
                {% endfor %}
            {% endblock extra_info_content %}
        {% endblock extra_info %}
    {% endblock content %}

Testing our Code
----------------
In these tests we want to make sure the extented template we created works as inteded, both if there are songs in the
database and without any songs. This is done in the second and third test. As you can see in the second test,
*test_render_list_sanity*, we use the CRadmin test CSS classes we added in the template.
::

    from django.test import TestCase
    from model_mommy import mommy

    from django_cradmin import cradmin_testhelpers
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps.template_app import template_listview


    class TestItemValueTemplate(TestCase, cradmin_testhelpers.TestCaseMixin):
        """Tests for our new template used by the item value class"""
        viewclass = template_listview.TemplateListbuilderView

        def __set_cradmin_role(self):
            return mommy.make('cradmin_listbuilder_guide.Album', title='Andeby')

        def test_render_list_sanity(self):
            """Is the blocks we created inside the template"""
            album = self.__set_cradmin_role()
            mommy.make('cradmin_listbuilder_guide.Song', title='Donald Duck', album=album, written_by='Anton')
            mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=album)
            self.assertTrue(mockresponse.selector.one('.test-song-heading'))
            self.assertTrue(mockresponse.selector.list('.test-extra-info-content'))
            mockresponse.selector.prettyprint()

        def test_message_when_no_songs_in_db(self):
            """Should get a message if no songs is in db"""
            mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=self.__set_cradmin_role())
            mockresponse.selector.prettyprint()
            self.assertTrue(mockresponse.selector.one('.test-cradmin-no-items-message'))
            actual_message = mockresponse.selector.one('.test-cradmin-no-items-message').alltext_normalized
            self.assertEqual('No songs', actual_message)

Next Chapter
------------
TODO
