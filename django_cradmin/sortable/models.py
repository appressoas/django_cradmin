from __future__ import unicode_literals
from builtins import range
from builtins import object
from django.core.exceptions import ValidationError
from django.db import models


class SortableManagerBase(models.Manager):
    """
    Manager for :class:`.SortableBase`.
    """
    parent_attribute = None

    def _get_filtered_by_parentobject_queryset(self, parentobject):
        filter_kwargs = {self.parent_attribute: parentobject}
        return self.get_queryset().filter(**filter_kwargs).order_by('sort_index')

    def _get_siblings_queryset(self, item):
        """
        Get the queryset for all the items with the same parent as the given
        item.
        """
        parentobject = getattr(item, self.parent_attribute)
        return self._get_filtered_by_parentobject_queryset(parentobject)

    def _get_last_sortindex_within_parentobject(self, item):
        lastitem = self._get_siblings_queryset(item).last()
        if lastitem:
            return lastitem.sort_index + 1
        else:
            return 0

    def set_newitem_sort_index_to_last(self, item):
        """
        Sets ``item.sort_index`` to the sort_index of the last item
        in the parent + 1. Does not save.

        ONLY USE THIS FOR NEWLY CREATED ITEMS.
        """
        if item.sort_index is not None or item.pk is not None:
            raise ValueError('set_newitem_sort_index_to_last should only be used '
                             'when creating new items. sort_index or pk is something '
                             'other than None, which indicates that this is not a new '
                             'item - thus the ValueError.')
        item.sort_index = self._get_last_sortindex_within_parentobject(item)

    def __increase_sort_index_in_range(self, queryset, items, from_index, to_index, distance=1):
        """
        Used by sort_before to increase the sort_index of all items in the given range
        """
        increase_index_for_items = [itm.id for itm in items[from_index:to_index]]
        queryset.filter(id__in=increase_index_for_items).update(sort_index=models.F('sort_index') + distance)

    def __decrease_sort_index_in_range(self, queryset, items, from_index, to_index, distance=1):
        """
        Used by sort_before to decrease the sort_index of all items in the given range
        """
        decrease_index_for_items = [itm.id for itm in items[from_index:to_index]]
        queryset.filter(id__in=decrease_index_for_items).update(sort_index=models.F('sort_index') - distance)

    def sort_before(self, item, sort_before_id):
        """
        Sort a given item before the item with id `sort_before_id`,
        or last if `sort_before_id` is ``None``.

        Fetches all items in the same container, and makes changes in the ordering.
        Only the required updates are made.
        """
        queryset = self._get_siblings_queryset(item)
        items = queryset.all()
        # Get the current position for the item to sort before
        sort_before_index = None
        original_item_index = None

        for index in xrange(0, len(items)):
            cur_item = items[index]
            if index < cur_item.sort_index:
                # Found gap, need to move rest of list <size-of-gap> step(s) down
                self.__decrease_sort_index_in_range(queryset, items, index, len(items), cur_item.sort_index-index)
                items = queryset.all()
            if index > cur_item.sort_index:
                # Found duplicate sort_index, need to move rest of list one step up
                self.__increase_sort_index_in_range(queryset, items, index, len(items))
                items = queryset.all()

            if item.id == cur_item.id:
                original_item_index = cur_item.sort_index

            elif sort_before_id is not None and cur_item.id == sort_before_id:
                sort_before_index = cur_item.sort_index

        item.sort_index = None
        if sort_before_index is None:
            # Place last.
            if original_item_index is not None:
                # fill gap left when moving item to end
                self.__decrease_sort_index_in_range(queryset, items, original_item_index+1, len(items))
                item.sort_index = len(items)-1
            else:
                item.sort_index = len(items)
            item.save()
        else:
            # Place somewhere not last
            if original_item_index is None:
                # new item, move rest of list one step up, and place the new item
                self.__increase_sort_index_in_range(queryset, items, sort_before_index, len(items))
                item.sort_index = sort_before_index
                item.save()
            elif original_item_index < sort_before_index:
                # Move up, and fill gap left behind by moving items in the gap down
                self.__decrease_sort_index_in_range(queryset, items, original_item_index+1, sort_before_index)
                item.sort_index = sort_before_index-1
                item.save()
            elif original_item_index > sort_before_index:
                # Move down, and fill/create gap by moving other objects up
                self.__increase_sort_index_in_range(queryset, items, sort_before_index, original_item_index)
                item.sort_index = sort_before_index
                item.save()

    def sort_last(self, item):
        """
        Just a shortcut for::

            self.sort_before(item, sort_before_id=None)
        """
        self.sort_before(item, sort_before_id=None)


def validate_sort_index(value):
    if value < 0:
        raise ValidationError(u'Sort index must be 0 or higher.')


class SortableBase(models.Model):
    """
    Used with :class:`.SortableManagerBase` to make models sortable.
    """

    #: Sort index - ``0`` or higher.
    sort_index = models.PositiveIntegerField(
        blank=True, null=True,
        default=None,
        verbose_name='index',
        validators=[validate_sort_index]
    )

    class Meta(object):
        abstract = True
