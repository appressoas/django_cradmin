.. _listbuilder_template_item_value:

==================================
Content in Template For Item Value
==================================
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
have done pretty much just what the listbuilder class ``TitleDescription`` does, expect it uses a h2 tag, while we use
a h3 tag.

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
TODO tomorrow.