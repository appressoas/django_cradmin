# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='GenericTokenWithMetadata',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('app', models.CharField(max_length=255, db_index=True)),
                ('token', models.CharField(unique=True, max_length=100)),
                ('created_datetime', models.DateTimeField(verbose_name='Created')),
                ('expiration_datetime', models.DateTimeField(default=None, null=True, verbose_name='Expires', blank=True)),
                ('single_use', models.BooleanField(default=True)),
                ('metadata_json', models.TextField(default='', blank=True)),
                ('object_id', models.PositiveIntegerField()),
                ('content_type', models.ForeignKey(to='contenttypes.ContentType')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
