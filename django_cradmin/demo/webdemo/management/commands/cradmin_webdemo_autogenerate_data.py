from __future__ import unicode_literals
from builtins import range
import random
from django.contrib.auth import get_user_model
from django.contrib.webdesign import lorem_ipsum
from django.core.management.base import BaseCommand

from cradmin_demo.webdemo import models as demomodels


class Command(BaseCommand):
    help = 'Create some testdata.'

    def handle(self, *args, **options):
        self.autoprefix = 'Zauto '
        self._create_user_if_not_exists(
            username='comic',
            email='comic@example.com')
        self._create_user_if_not_exists(
            username='grandma',
            email='grandma@example.com',
            first_name='Elvira "Grandma"',
            last_name='Coot')
        self._create_pages()
        self._create_extra_sites()

    def _create_user_if_not_exists(self, username, **kwargs):
        User = get_user_model()
        try:
            User.objects.get(username=username)
        except User.DoesNotExist:
            user = User.objects.create(username=username, **kwargs)
            user.set_password('test')
            user.save()

    def _create_pages(self):
        demomodels.Page.objects.filter(title__startswith=self.autoprefix).delete()
        site = demomodels.Site.objects.get(name='Demosite')
        pages = []
        for x in range(100):
            pages.append(demomodels.Page(
                site=site,
                title=u'{} {}'.format(self.autoprefix, self._lorem_words(random.randint(1, 4))),
                intro=self._lorem_words(random.randint(3, 10)),
                body=self._lorem_para(random.randint(1, 8))
            ))
        demomodels.Page.objects.bulk_create(pages)

    def _lorem_shortpara(self, count):
        para = []
        for x in range(count):
            para.append(self._lorem_words(random.randint(9, 15)) + '.')
        return ' '.join(para)

    def _lorem_shortparas(self, count):
        return '\n\n'.join([self._lorem_shortpara(random.randint(1, 3)) for x in range(count)])

    def _lorem_words(self, count):
        words = lorem_ipsum.words(count, common=False)
        return u'{0}{1}'.format(words[0].upper(), words[1:])

    def _lorem_para(self, count):
        return u'\n\n'.join(lorem_ipsum.paragraphs(count, common=False))

    def _create_extra_sites(self):
        sites = []
        for site in range(120):
            site = demomodels.Site(
                name=self._lorem_words(random.randint(3, 5)),
                description=self._lorem_para(1))
            sites.append(site)
        demomodels.Site.objects.bulk_create(sites)
