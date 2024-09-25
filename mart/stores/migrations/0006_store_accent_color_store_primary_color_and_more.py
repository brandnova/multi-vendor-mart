# Generated by Django 5.1.1 on 2024-09-25 12:54

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stores', '0005_remove_store_accent_color_remove_store_primary_color_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='store',
            name='accent_color',
            field=models.CharField(default='#808080', max_length=7, validators=[django.core.validators.RegexValidator(message='Enter a valid hex color code', regex='^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')]),
        ),
        migrations.AddField(
            model_name='store',
            name='primary_color',
            field=models.CharField(default='#000000', max_length=7, validators=[django.core.validators.RegexValidator(message='Enter a valid hex color code', regex='^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')]),
        ),
        migrations.AddField(
            model_name='store',
            name='secondary_color',
            field=models.CharField(default='#FFFFFF', max_length=7, validators=[django.core.validators.RegexValidator(message='Enter a valid hex color code', regex='^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')]),
        ),
    ]
