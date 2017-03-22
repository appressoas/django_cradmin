.. _listbuilder_template_view:

=======================
Using Our Own Templates
=======================
In this part of the guide we will create a crapp for a list view where we use other templates than the ones CRadmin
uses as default.

CRadmin Application
-------------------
Just like when working with listbuilder and listbuilderview, we create a class which adds value to the item and a class
which build the list view. In the class for item value we extend the class
:class:`django_cradmin.viewhelpers.listbuilder.base.ItemValueRenderer` and tell it to use our template instead of the
default CRadmin template. Further we set the valuealias to be song, so we can use ``me.song`` in the template.

Our listbuilderview class inherits the rolequeyset for a mixin file in this example and extends the View class from
listbuilderview. Further we set the model, which class to render the item value and which template we want to use.

::

    from django_cradmin.demo.cradmin_listbuilder_guide.crapps import mixins
    from django_cradmin.demo.cradmin_listbuilder_guide.models import Song
    from django_cradmin.viewhelpers import listbuilder

    from django_cradmin.viewhelpers import listbuilderview


    class TemplateItemValue(listbuilder.base.ItemValueRenderer):
        """"""
        template_name = 'cradmin_listbuilder_guide/template_app/my_great_item_value.django.html'
        valuealias = 'song'


    class TemplateListbuilderView(mixins.SongRolequeryMixin, listbuilderview.View):
        """"""
        model = Song
        value_renderer_class = TemplateItemValue
        template_name = 'cradmin_listbuilder_guide/template_app/my_great_listbuilder.django.html'

Templates
---------
If we look at the CRadmin class ``ItemValueRendere`` we see it uses a template named
``django_cradmin/viewhelpers/listbuilder/base/itemvalue.django.html``, so this is the file we want to extend in the
template for our ItemValue class.

Wehn we look at the CRadmin class View it don't have a template, however its super class ViewMixin uses the template
``django_cradmin/viewhelpers/listbuilderview/default.django.html``, which is the file we extend for our listbuilder
view.

Next Chapter
------------
TODO