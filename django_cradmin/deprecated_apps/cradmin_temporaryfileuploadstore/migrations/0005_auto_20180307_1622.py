# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2018-03-07 15:22
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):
    atomic = False

    dependencies = [
        ('cradmin_temporaryfileuploadstore', '0004_auto_20151017_1947'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='TemporaryFileCollection',
            new_name='TemporaryFileCollectionDeprecated',
        ),
    ]
