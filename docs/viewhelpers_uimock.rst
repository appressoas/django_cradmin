########################################
`viewhelpers.uimock` --- Create UI mocks
########################################

The uimock module is tailored for creating mock views. It is not
ment as a full blown prototyping solution, just as an easy way
to create interactive mockups.


***************
Getting started
***************

Using uimock is farily easy. You can add it to an existing app, but we recommend you create a separate
django app for mocks. With a separate django app, the steps are:

1. Create a new Django app --- a new python module in your project with empty ``__init__.py`` and ``models.py``.
2. Add the app to the ``INSTALLED_APPS`` setting.
3. Add ``urls.py`` to your new app with the following
   content::

      # Replace ``myproject_mymockapp`` with your django app name, and
      # you can use another name than ``myfirstmock``, just make sure
      # you adjust the template directory in the next step.
      from django.conf.urls import url

      from django_cradmin import viewhelpers

      urlpatterns = [
          url(r'^myfirstmock/(?P<mockname>.+)?$',
              viewhelpers.uimock.UiMock.as_view(template_directory='myproject_mymockapp/myfirstmock/'),
              name='myproject_mymockapp_mocks'),
      ]

4. Create the template directory you specified as argument to UiMock.as_view in the previous step,
   and add an ``index.django.html`` template with something like this:

   .. code-block:: django

      {% extends "django_cradmin/viewhelpers/uimock/base.django.html" %}

      {% block content %}
          <div class="adminui-page-section">
              <div class="container container--tight">
                  <p>Hello uimock world</p>
              </div>
          </div>
      {% endblock content %}


      {% block notes %}
          <p>Some notes here!</p>
      {% endblock notes %}

5. Add the urls to your mock app to your project
   urls::

      urlpatterns = [
         # ...
         url(r'^mock/', include('myproject.myproject_mymockapp.urls')),
      ]


Now you should be able to browse your mock at ``/mock/myfirstmock/``.



**************************
Adding more mock templates
**************************
To add more mocks, you just add more templates to the same directory where you added
``index.django.html``. Their URL will be the same as the index template, with
the name of the template without ``.django.html``. Make sure your mock templates
extend ``django_cradmin/viewhelpers/uimock/base.django.html``.


A more full featured example:
=============================
This is more or less the the same as what we have in ``django_cradmin/demo/uimock_demo/``.
We demonstrate linking between mocks using
the :func:`~django_cradmin.templatetags.cradmin_uimock_tags.cradmin_uimock_url` template
tag, some a bit more complex templates, and show a starting point for mocking of form flows.

index.django.html:

.. code-block:: django

   {% extends "django_cradmin/viewhelpers/uimock/base.django.html" %}
   {% load cradmin_uimock_tags %}

   {% block content %}
       <div class="adminui-page-section adminui-page-section--center-md">
           <div class="container container--tight">
               <p>Hello uimock world</p>

               <p>Here is a link to <a href="{% cradmin_uimock_url mockname='ipsum' %}">another mock</a> in the same uimock view</p>
           </div>
       </div>
   {% endblock content %}

   {% block notes %}
       <h3>Some notes</h3>
       <p>Donec sed odio dui. Aenean lacinia bibendum nulla sed consectetur.</p>

       <h3>More notes</h3>
       <p>
           Donec sed odio dui. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh,
           ut fermentum massa justo sit amet risus.
       </p>
   {% endblock notes %}


ipsum.django.html:

.. code-block:: django

   {% extends "django_cradmin/viewhelpers/uimock/base.django.html" %}
   {% load cradmin_uimock_tags %}

   {% block page-cover %}
       <header class="adminui-page-cover">
           <h1 class="adminui-page-cover__title">Justo Vulputate</h1>
           <p class="adminui-page-cover__description">Morbi leo risus, porta ac consectetur ac, vestibulum at eros</p>
       </header>
   {% endblock page-cover %}

   {% block breadcrumbs-below-page-cover %}
       <div class="breadcrumb-item-list-wrapper">
           <div class="container container--tight">
               <nav class="breadcrumb-item-list">
                   <a class="breadcrumb-item-list__item" href="{% cradmin_uimock_url %}">
                       Index
                   </a>
                   <span class="breadcrumb-item-list__separator"></span>
                   <span class="breadcrumb-item-list__item  breadcrumb-item-list__item--active">
                       Ipsum mock
                   </span>
               </nav>
           </div>
       </div>
   {% endblock breadcrumbs-below-page-cover %}

   {% block content %}
       <div class="adminui-page-section">
           <div class="container container--tight">
               <p>Nullam quis risus eget urna mollis ornare vel eu leo. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Nulla vitae elit libero, a pharetra augue. Nullam quis risus eget urna mollis ornare vel eu leo. Cras mattis consectetur purus sit amet fermentum. Curabitur blandit tempus porttitor.</p>

               <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam porta sem malesuada magna mollis euismod. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</p>

               <p>Maecenas faucibus mollis interdum. Donec sed odio dui. Nullam quis risus eget urna mollis ornare vel eu leo. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Nullam quis risus eget urna mollis ornare vel eu leo.</p>

               <p>Etiam porta sem malesuada magna mollis euismod. Donec ullamcorper nulla non metus auctor fringilla. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum.</p>
           </div>
       </div>
   {% endblock content %}

   {% block notes %}
       <p>
           This uimock example demostrates an a bit more complex example than index.django.html.
           We have a page-cover and some breadcrumbs!
       </p>

       <p>
           You may also want to check out <a href="{% cradmin_uimock_url mockname='form' %}">the form mock</a>.
       </p>
   {% endblock notes %}

form.django.html:

.. code-block:: django

   {% extends "django_cradmin/viewhelpers/uimock/base.django.html" %}
   {% load cradmin_tags %}

   {% block content %}
       <div class="adminui-page-section">
           <div class="container container--tight">
               {% if postdata %}
                   <h2>Posted data:</h2>
                   <pre>{{ postdata|cradmin_jsonencode }}</pre>
               {% else %}
                   <form method="POST">
                       {% csrf_token %}

                       <label class="label">
                           Type something
                           <input type="text" name="something" placeholder="Type something ..." class="input  input--outlined" />
                       </label>

                       <button class="button button--primary">
                           Submit form
                       </button>
                   </form>
               {% endif %}
           </div>
       </div>
   {% endblock content %}

   {% block notes %}
       <p>Here we mock a form, and when we submit the form, we show the form data a JSON in a PRE tag.</p>

       <p>A starting point for mocking form flows.</p>
   {% endblock notes %}



*************
Template tags
*************

.. currentmodule:: django_cradmin.templatetags.cradmin_uimock_tags

.. automodule:: django_cradmin.templatetags.cradmin_uimock_tags
   :members:



*************
Mock view API
*************

.. currentmodule:: django_cradmin.viewhelpers.uimock

.. automodule:: django_cradmin.viewhelpers.uimock
   :members:
