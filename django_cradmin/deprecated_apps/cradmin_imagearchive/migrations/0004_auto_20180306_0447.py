# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2018-03-06 03:47
from django.db import migrations, models
import django_cradmin.deprecated_apps.cradmin_imagearchive.models


class Migration(migrations.Migration):

    dependencies = [
        ('cradmin_imagearchive', '0003_auto_20151017_0139'),
    ]

    operations = [
        migrations.AlterField(
            model_name='archiveimage',
            name='image',
            field=models.FileField(help_text='Select an image to add to the archive.', max_length=255, null=True, upload_to=django_cradmin.deprecated_apps.cradmin_imagearchive.models.archiveimage_upload_to, verbose_name='image'),
        ),
    ]
