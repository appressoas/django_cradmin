.. _guide_pagination:

.. warning:: This is under development and do not work at this time

..
    This is taken from the gettingstarted guide. We removed the pagination section from the guide, and will
    add it back later on when the CRadmin pagination again works. The code below was originaly a part of the
    public UI displaying all messages in system


Pagination in public message list
=================================
In this example we use the Pagination in Django. In our class ``MessageListBuilderView`` we just add the number of
messages we want to show on one page by adding the value to the variable `paginate_by`. ::

    class MessageListBuilderView(listbuilderview.View):
        """Builds the list for the view"""

        model = Message
        value_renderer_class = MessageItemValue
        frame_renderer_class = MessageItemFrameLink
        template_name = 'cradmin_gettingstarted/crapps/publicui/message_listbuilder_view.django.html'
        paginate_by = 10

Template improvement
--------------------
In our template we need to add a if test for the pagination. Further we also need a if test if there is no messages in
the system. For the latter we use the CRadmin ``listbuilder_list`` which is what we told to be rendered with the
CRadmin tag ``cradmin_render_renderable``. If the ``listbuilder_list`` is empty we just display information about this
in the ``block messages`` above the content. Our ``message_listbuilder_view.django.html`` file now looks like this. ::

    {% extends 'django_cradmin/viewhelpers/listbuilderview/default.django.html' %}
    {% load cradmin_tags %}

    {% block title %}
        Gettingstarted
    {% endblock title  %}

    {% block page-cover-title %}
        Messages
    {% endblock page-cover-title %}

    {% block messages %}{% endblock messages %}

    {% block content %}
        <section class="adminui-page-section">
            <div class="container container--wide">
                {% if listbuilder_list %}
                    <div class="blocklist">
                        {% cradmin_render_renderable listbuilder_list %}
                    </div>
                    {% if is_paginated %}
                        <div class="pagination">
                            <span class="page-links">
                                {% if page_obj.has_previous %}
                                    <a href="/gettingstarted/messages?page={{ page_obj.previous_page_number }}">
                                        << previous
                                    </a>
                                {% endif %}
                                <span class="page-current {% cradmin_test_css_class 'number-of-pages' %} ">
                                    Page {{ page_obj.number }} of {{ page_obj.paginator.num_pages }}.
                                </span>
                                {% if page_obj.has_next %}
                                    <a href="/gettingstarted/messages?page={{ page_obj.next_page_number }}">
                                        next >>
                                    </a>
                                {% endif %}
                            </span>
                        </div>
                    {% endif %}
                {% else %}
                    <p class="text-center message message--info {% cradmin_test_css_class 'no-messages' %}">
                        No messages in system
                    </p>
                {% endif %}
            </div>
        </section>

    {% endblock content %}

Test pagination
---------------
It is again time to write some tests to see if both the pagination works as expected and if the if test for no messages
works. Now, I take it for granted that Django writes tests for their code, so there is no need for deep tests of the
pagination. On the other side, we want to be sure that we have implemented the pagination correctly in both the view
and in the template. Thus, a test for handling a certain amount of messages should be written. In the template there is
added two CRadmin test css classes which we use in our test. ::

    def test_pagination(self):
        """
        Paginate_by is sat to 10 in
        :class:`django_cradmin.demo.cradmin_gettingstarted.crapps.publicui.message_list_view.MessageListBuilderView`.
        If this value is changed you must update text in self.assertEqual for test to pass.
        """
        mommy.make('cradmin_gettingstarted.Message', _quantity=1000)
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertTrue(mockresponse.selector.one('.test-number-of-pages'))
        number_of_pages_html_text = mockresponse.selector.one('.test-number-of-pages').text_normalized
        self.assertEqual('Page 1 of 100.', number_of_pages_html_text)

    def test_if_no_messages_in_system(self):
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertTrue(mockresponse.selector.one('.test-no-messages'))
        no_messages_html_text = mockresponse.selector.one('.test-no-messages').text_normalized
        self.assertEqual('No messages in system', no_messages_html_text)

As you can see the tests just checks that the expected text is displayed in the template based on the number of
messages in the system. In both tests we use the ``text_normalized`` since the text is shown in the html-tag which has a
CRadmin test css class. If the html-tag displaying the text was a child of the tag which had a CRadmin css test class,
we would use ``alltext_normalized`` to fetch the text from the template.