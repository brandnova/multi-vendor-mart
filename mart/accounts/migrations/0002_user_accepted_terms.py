# Generated by Django 5.1.1 on 2024-10-04 16:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='accepted_terms',
            field=models.BooleanField(default=False),
        ),
    ]
