# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2017-02-08 20:52
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cradmin_javascript_demos', '0005_auto_20170127_1900'),
    ]

    operations = [
        migrations.AddField(
            model_name='fictionalfigure',
            name='rating',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
