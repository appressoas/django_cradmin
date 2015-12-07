# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.utils.timezone import utc
from django.conf import settings
import datetime


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('webdemo', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='page',
            name='subscribers',
            field=models.ManyToManyField(verbose_name='Subscribed users', to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='page',
            name='publishing_time',
            field=models.DateTimeField(verbose_name='Publishing time', default=datetime.datetime(2015, 12, 7, 2, 51, 14, 601552, tzinfo=utc), help_text='The time when this will be visible on the website.'),
            preserve_default=True,
        ),
    ]
