from django import test

from django_cradmin.tests.sortable.cradmin_sortable_testapp.models import SortableItem
from django_cradmin.tests.sortable.cradmin_sortable_testapp.models import ItemContainer


class TestSortableItem(test.TestCase):
    """
    Test that classes inherit :class:`SortableBase` works as advertised!
    """

    def _create_container(self):
        container = ItemContainer(name='test container')
        container.save()
        return container

    def _create_items(self, num_items, container=None):
        container = container or self._create_container()
        items = []
        for i in range(1, num_items+1, 1):
            items.append(SortableItem(
                container=container,
                name='test{}'.format(i),
                sort_index=i))
        SortableItem.objects.bulk_create(items)
        return SortableItem.objects.all()

    def test_has_sort_index_field(self):
        item = self._create_items(1)[0]
        self.assertTrue(hasattr(item, 'sort_index'))
        self.assertTrue(item.sort_index, 1)

    def test_sort_item_last(self):
        i1, i2, i3, i4, i5, i6 = self._create_items(6)
        SortableItem.objects.sort_last(i1)
        reordered = [si.id for si in SortableItem.objects.all().order_by('sort_index')]
        self.assertEquals(reordered, [2,3,4,5,6,1])

    def test_sort_item_3_last(self):
        i1, i2, i3, i4, i5, i6 = self._create_items(6)
        SortableItem.objects.sort_last(i3)
        reordered = [si.id for si in SortableItem.objects.all().order_by('sort_index')]
        self.assertEquals(reordered, [1,2,4,5,6,3])

    def test_sort_last_item_first(self):
        i1, i2, i3, i4, i5, i6 = self._create_items(6)
        SortableItem.objects.sort_before(i6, i1.id)
        reordered = [si.id for si in SortableItem.objects.all().order_by('sort_index')]
        self.assertEquals(reordered, [6,1,2,3,4,5])

    def test_sort_item_3_first(self):
        i1, i2, i3, i4, i5, i6 = self._create_items(6)
        SortableItem.objects.sort_before(i3, i1.id)
        reordered = [si.id for si in SortableItem.objects.all().order_by('sort_index')]
        self.assertEquals(reordered, [3,1,2,4,5,6])

    def test_sort_item_move_first_before_id_4(self):
        i1, i2, i3, i4, i5, i6 = self._create_items(6)
        SortableItem.objects.sort_before(i1, i4.id)
        reordered = [si.id for si in SortableItem.objects.all().order_by('sort_index')]
        self.assertEquals(reordered, [2,3,1,4,5,6])

    def test_sort_item_move_second_before_id_4(self):
        i1, i2, i3, i4, i5, i6 = self._create_items(6)
        SortableItem.objects.sort_before(i2, i4.id)
        reordered = [si.id for si in SortableItem.objects.all().order_by('sort_index')]
        self.assertEquals(reordered, [1,3,2,4,5,6])

    def test_sort_item_move_second_before_id_4_in_allready_reordered_list(self):
        i1, i2, i3, i4, i5, i6 = self._create_items(6)
        SortableItem.objects.sort_last(i1)
        # now list is [2,3,4,5,6,1]
        SortableItem.objects.sort_before(i2, i4.id)
        reordered = [si.id for si in SortableItem.objects.all().order_by('sort_index')]
        self.assertEquals(reordered, [3,2,4,5,6,1])

    def test_set_sort_index_to_last_no_siblings(self):
        container = self._create_container()
        item = SortableItem(container=container, name='My test')
        SortableItem.objects.set_newitem_sort_index_to_last(item)
        self.assertEquals(item.sort_index, 1)
        self.assertIsNone(item.pk)  # The item was not saved

    def test_set_sort_index_to_last_has_siblings(self):
        container = self._create_container()
        self._create_items(2, container=container)
        item = SortableItem(container=container, name='My test')
        SortableItem.objects.set_newitem_sort_index_to_last(item)
        self.assertEquals(item.sort_index, 3)
        self.assertIsNone(item.pk)  # The item was not saved

    def test_set_sort_index_to_last_refuse_with_sort_index(self):
        container = self._create_container()
        item = SortableItem(container=container, name='My test', sort_index=1)
        with self.assertRaises(ValueError):
            SortableItem.objects.set_newitem_sort_index_to_last(item)

    def test_set_sort_index_to_last_refuse_existing(self):
        container = self._create_container()
        item = SortableItem(container=container, name='My test', sort_index=1)
        item.save()
        item.sort_index = None
        with self.assertRaises(ValueError):
            SortableItem.objects.set_newitem_sort_index_to_last(item)
