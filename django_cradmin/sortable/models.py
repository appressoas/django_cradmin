from __future__ import unicode_literals

from builtins import object
from builtins import range

from django.core.exceptions import ValidationError
from django.db import models
from django.db import transaction
from django.utils.translation import ugettext_lazy

from django_cradmin.utils.nulls_last_queryset import NullsLastQuerySet


class SortableQuerySetBase(NullsLastQuerySet):
    """
    QuerySet for :class:`.SortableManagerBase`.

    You must use this as a base class if you want to create
    a custom queryset class for models extending :class:`.SortableBase`.
    """
    parent_attribute = None

    def _get_filtered_by_parentobject_queryset(self, parentobject, none_values_order_by):
        filter_kwargs = {self.parent_attribute: parentobject}
        order_by = ['sort_index']
        if none_values_order_by:
            order_by.extend(none_values_order_by)
        return self.filter(**filter_kwargs).order_by(*order_by)

    def _get_siblings_queryset(self, item, none_values_order_by):
        """
        Get the queryset for all the items with the same parent as the given
        item.
        """
        parentobject = getattr(item, self.parent_attribute)
        queryset = self._get_filtered_by_parentobject_queryset(
            parentobject, none_values_order_by)
        return queryset

    def _get_last_sortindex_within_parentobject(self, item, none_values_order_by):
        lastitem = self._get_siblings_queryset(item, none_values_order_by).last()
        if lastitem:
            return lastitem.sort_index + 1
        else:
            return 0

    def set_newitem_sort_index_to_last(self, item, none_values_order_by=None):
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
        item.sort_index = self._get_last_sortindex_within_parentobject(
            item, none_values_order_by)

    def __increase_sort_index_in_range(self, queryset, items, from_index, to_index, distance=1):
        """
        Used by sort_before to increase the sort_index of all items in the given range
        """
        increase_index_for_items = [item.id for item in items[from_index:to_index]]
        queryset.filter(id__in=increase_index_for_items).update(sort_index=models.F('sort_index') + distance)

    def __decrease_sort_index_in_range(self, queryset, items, from_index, to_index, distance=1):
        """
        Used by sort_before to decrease the sort_index of all items in the given range
        """
        decrease_index_for_items = [item.id for item in items[from_index:to_index]]
        queryset.filter(id__in=decrease_index_for_items).update(sort_index=models.F('sort_index') - distance)

    def __fix_sort_order(self, item, sort_before_id, none_values_order_by, option_dict=None):
        """
        Iterate over all the items and remove any gaps, fix any duplicate
        sort indexes and find the correct sort index for the item.

        Parameters:
            item: The item to insert in the list.
            sort_before_id: ID of the item that you want to insert ``item`` before.

        Returns:
            A tuple (itemsqueryset, sort_before_index, original_item_index):

            - ``itemsqueryset`` is a queryset with all the items within the
              :obj:`.parentobject`, sorted by ``sort_index``, without any gaps
              or duplicate sort indexes.
            - ``detected_item_sort_index``: The detected new sort index for the item.
              If this is ``None``, the item should be sorted last.
            - ``original_item_index``: The sort index of the ``item``. This may not
              be the same as ``item.sort_index`` if the item has been moved up or
              down because of gaps or duplicate sort indexes.
        """
        itemsqueryset = self._get_siblings_queryset(item, none_values_order_by)
        detected_item_sort_index = None
        original_item_index = None
        for index in range(0, len(itemsqueryset)):
            current_item = itemsqueryset[index]
            if current_item.sort_index is None:
                current_item.sort_index = index
                current_item._save(option_dict)
            else:
                if index < current_item.sort_index:
                    # Found gap, need to move rest of list <size-of-gap> step(s) down
                    self.__decrease_sort_index_in_range(itemsqueryset, itemsqueryset, index,
                                                        len(itemsqueryset),
                                                        current_item.sort_index - index)
                    itemsqueryset = self._get_siblings_queryset(item, none_values_order_by).all()
                if index > current_item.sort_index:
                    # Found duplicate sort_index, need to move rest of list one step up
                    self.__increase_sort_index_in_range(itemsqueryset, itemsqueryset, index,
                                                        len(itemsqueryset))
                    itemsqueryset = self._get_siblings_queryset(item, none_values_order_by).all()

            if item.id == current_item.id:
                original_item_index = current_item.sort_index
            elif sort_before_id is not None and current_item.id == sort_before_id:
                detected_item_sort_index = current_item.sort_index
        return itemsqueryset, detected_item_sort_index, original_item_index

    def __sort_last(self, itemsqueryset, item, original_item_index, option_dict=None):
        if original_item_index is not None:
            # fill gap left when moving item to end
            self.__decrease_sort_index_in_range(itemsqueryset, itemsqueryset,
                                                original_item_index + 1, len(itemsqueryset))
            item.sort_index = len(itemsqueryset) - 1
        else:
            item.sort_index = len(itemsqueryset)
        item._save(option_dict)

    def __sort_not_last(self, itemsqueryset, item, detected_item_sort_index, original_item_index, option_dict=None):
        if original_item_index is None:
            # new item, move rest of list one step up, and place the new item
            self.__increase_sort_index_in_range(itemsqueryset,
                                                itemsqueryset,
                                                detected_item_sort_index,
                                                len(itemsqueryset))
            item.sort_index = detected_item_sort_index
        elif original_item_index < detected_item_sort_index:
            # Move up, and fill gap left behind by moving items in the gap down
            self.__decrease_sort_index_in_range(itemsqueryset,
                                                itemsqueryset,
                                                original_item_index + 1,
                                                detected_item_sort_index)
            item.sort_index = detected_item_sort_index - 1
        elif original_item_index > detected_item_sort_index:
            # Move down, and fill/create gap by moving other objects up
            self.__increase_sort_index_in_range(itemsqueryset,
                                                itemsqueryset,
                                                detected_item_sort_index,
                                                original_item_index)
            item.sort_index = detected_item_sort_index
        else:
            # Item is already in the correct place
            # - Return without saving
            return
        item._save(option_dict)

    def sort_before(self, item, sort_before_id, none_values_order_by=None, option_dict=None):
        """
        Sort a given item before the item with id `sort_before_id`,
        or last if `sort_before_id` is ``None``.

        Fetches all items in the same container, and makes changes in the ordering.
        Only the required updates are made.
        """
        with transaction.atomic():
            itemsqueryset, detected_item_sort_index, original_item_index = self.__fix_sort_order(
                item, sort_before_id, none_values_order_by, option_dict=option_dict)

            if detected_item_sort_index is None:
                self.__sort_last(itemsqueryset=itemsqueryset, item=item,
                                 original_item_index=original_item_index, option_dict=option_dict)
            else:
                self.__sort_not_last(itemsqueryset=itemsqueryset,
                                     item=item,
                                     detected_item_sort_index=detected_item_sort_index,
                                     original_item_index=original_item_index, option_dict=option_dict)

    def sort_last(self, item, none_values_order_by=None, option_dict=None):
        """
        Just a shortcut for::

            self.sort_before(item, sort_before_id=None)
        """
        self.sort_before(item, sort_before_id=None,
                         none_values_order_by=none_values_order_by, option_dict=option_dict)


def validate_sort_index(value):
    if value < 0:
        raise ValidationError(u'Sort index must be 0 or higher.')


class SortableBase(models.Model):
    """
    Used with :class:`.SortableQuerySetBase` to make models sortable.
    """

    #: Sort index - ``0`` or higher.
    sort_index = models.PositiveIntegerField(
        blank=True, null=True,
        default=None,
        verbose_name=ugettext_lazy('Sort index'),
        validators=[validate_sort_index]
    )

    def perform_extra_actions_on_save(self, option_dict=None):
        if option_dict is not None:
            for key, val in option_dict.items():
                setattr(self, key, val)

    def _save(self, option_dict=None):
        self.perform_extra_actions_on_save(option_dict)
        self.save()

    class Meta(object):
        abstract = True
