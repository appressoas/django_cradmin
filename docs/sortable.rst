######################################
`sortable` --- Making objects sortable
######################################

To make a model sortable, you need the following two additions to your model:

#. You need to inherit from :class:`.SortableBase` (an abstract model) instead of ``django.db.Model``,
#. You need to create a subclass of :class:`.SortableItemQuerySet` and attach that subclass
   as a queryset for your model.

Example::

    from django_cradmin.sortable.models import SortableBase
    from django_cradmin.sortable.models import SortableQuerySetBase

    class MySortableItemQuerySet(SortableQuerySetBase):
        parent_attribute = 'container'

    class MySortableItem(SortableBase):
        objects = MySortableItemQuerySet.as_manager()
        container = models.ForeignKey(ItemContainer, blank=False, null=False)
        name = models.CharField(...)


The class that inherits ``SortableBase`` gets an attribute ``sort_index``. If you want the default ordering
for this model to be this attribute, you should add the following meta option on the model::

    class Meta:
        ordering = ['sort_index']


***********
How to sort
***********

Sorting is done by using these methods:

- :meth:`django_cradmin.sortable.models.SortableQuerySetBase.sort_before`
- :meth:`django_cradmin.sortable.models.SortableQuerySetBase.sort_last`
- :meth:`django_cradmin.sortable.models.SortableQuerySetBase.set_newitem_sort_index_to_last`

Example::

    # Make a new item and put it last in the list
    myitem = MySortableItem(container=somecontainer, name='Some name')
    MySortableItem.objects.set_newitem_sort_index_to_last(myitem)
    myitem.save()

    # Move the given item before the item with id 777
    # NOTE: Unlike set_newitem_sort_index_to_last(), sort_before() and sort_last()
    #       saves the item.
    MySortableItem.objects.sort_before(someitem, sort_before_id=777)

    # Move the given item last in the list
    MySortableItem.objects.sort_last(someitem)
    # ... or ...
    MySortableItem.objects.sort_before(someitem, sort_before_id=None)


**************************************************************
Makin an Admin UI that automatically adds items last in parent
**************************************************************
Making an Admin UI that automatically adds items last in parent is easy. Just extend
:class:`django_cradmin.sortable.admin.SortableModelAdmin` instead of
``django.contrib.admin.ModelAdmin``::

    from django_cradmin.sortable.admin import SortableModelAdmin

    class MySortableItemAdmin(SortableModelAdmin):
        pass

    admin.site.register(models.MySortableItem, MySortableItemAdmin)

You may also want to show the sort order by default in the admin UI listing,
with something like this::

    class MySortableItemAdmin(SortableModelAdmin):
        ordering = ['container__name', 'sort_index']


***
API
***

.. autoclass:: django_cradmin.sortable.models.SortableQuerySetBase
    :members:

.. autoclass:: django_cradmin.sortable.models.SortableBase
    :members:

.. autoclass:: django_cradmin.sortable.admin.SortableModelAdmin
    :members:
