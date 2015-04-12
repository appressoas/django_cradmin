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
            return 1

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
        before_item_found_index = 0
        # Get the current position for the item to move
        item_current_index = 0
        # Loop over all items to find `before_item_found_index` and `item_current_index`,
        # and to set the new value of sort_index on the item we are moving
        for i in range(0, len(items), 1):
            cur_item = items[i]
            # sorting last is a special case
            if sort_before_id is None and i == len(items) - 1:
                item.sort_index = cur_item.sort_index
                item.save()
                before_item_found_index = i + 1
            # set new sort_order for item
            elif cur_item.id == sort_before_id:
                item.sort_index = cur_item.sort_index
                item.save()
                before_item_found_index = i
            # set the current item index
            if cur_item.id == item.id:
                item_current_index = i

        # first move if item should be last - the special case
        if sort_before_id is None:
            add_on_index_for_items = []
            for itm in items[item_current_index:before_item_found_index]:
                if itm != item:
                    add_on_index_for_items.append(itm.id)
            queryset.filter(id__in=add_on_index_for_items).update(sort_index=models.F('sort_index') - 1)

        elif item_current_index > before_item_found_index:
            # Moving item up
            add_on_index_for_items = []
            for itm in items[before_item_found_index:item_current_index]:
                add_on_index_for_items.append(itm.id)
            queryset.filter(id__in=add_on_index_for_items).update(sort_index=models.F('sort_index') + 1)

        elif item_current_index < before_item_found_index:
            # Moving item down
            subtract_on_index_for_items = []
            for itm in items[item_current_index:before_item_found_index]:
                subtract_on_index_for_items.append(itm.id)
            queryset.filter(id__in=subtract_on_index_for_items).update(sort_index=models.F('sort_index') - 1)

    def sort_last(self, item):
        """
        Just a shortcut for::

            self.sort_before(item, sort_before_id=None)
        """
        self.sort_before(item, sort_before_id=None)


def validate_sort_index(value):
    if value < 1:
        raise ValidationError(u'Sort index must be 1 or higher.')


class SortableBase(models.Model):
    """
    Used with :class:`.SortableManagerBase` to make models sortable.
    """

    #: Sort index - ``1`` or higher.
    sort_index = models.PositiveIntegerField(
        blank=False, null=False,
        verbose_name='index',
        validators=[validate_sort_index]
    )

    class Meta(object):
        abstract = True
