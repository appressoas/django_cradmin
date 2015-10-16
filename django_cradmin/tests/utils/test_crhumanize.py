from django.test import TestCase
from django_cradmin.utils import crhumanize


class TestCrhumanize(TestCase):
    def test_less_than_kb(self):
        self.assertEqual('0B', crhumanize.human_readable_filesize(0))
        self.assertEqual('999B', crhumanize.human_readable_filesize(999))

    def test_kb(self):
        self.assertEqual('1KB', crhumanize.human_readable_filesize(1000))
        self.assertEqual('999KB', crhumanize.human_readable_filesize(999999))

    def test_mb(self):
        self.assertEqual('1.0MB', crhumanize.human_readable_filesize(1000000))
        self.assertEqual('55.6MB', crhumanize.human_readable_filesize(55555555))

    def test_gb(self):
        self.assertEqual('1.00GB', crhumanize.human_readable_filesize(1000000000))
        self.assertEqual('55.56GB', crhumanize.human_readable_filesize(55555555555))

    def test_tb(self):
        self.assertEqual('1.00TB', crhumanize.human_readable_filesize(1000000000000))
        self.assertEqual('55.56TB', crhumanize.human_readable_filesize(55555555555555))
