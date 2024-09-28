# Generated by Django 5.1.1 on 2024-09-28 12:12

import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Store',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('slug', models.SlugField(max_length=120, unique=True)),
                ('location', models.CharField(max_length=255)),
                ('contact_email', models.EmailField(max_length=254)),
                ('contact_phone', models.CharField(max_length=20)),
                ('banner_image', models.ImageField(blank=True, null=True, upload_to='store_banners/')),
                ('tag_line', models.CharField(blank=True, max_length=200)),
                ('is_active', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('primary_color', models.CharField(default='#000000', max_length=7, validators=[django.core.validators.RegexValidator(message='Enter a valid 6-digit hex color code', regex='^#([A-Fa-f0-9]{6})$')])),
                ('secondary_color', models.CharField(default='#FFFFFF', max_length=7, validators=[django.core.validators.RegexValidator(message='Enter a valid 6-digit hex color code', regex='^#([A-Fa-f0-9]{6})$')])),
                ('accent_color', models.CharField(default='#808080', max_length=7, validators=[django.core.validators.RegexValidator(message='Enter a valid 6-digit hex color code', regex='^#([A-Fa-f0-9]{6})$')])),
                ('owner', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('quantity', models.PositiveIntegerField()),
                ('image', models.ImageField(blank=True, null=True, upload_to='product_images/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('store', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='products', to='stores.store')),
            ],
        ),
        migrations.CreateModel(
            name='BankDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bank_name', models.CharField(max_length=100)),
                ('account_number', models.CharField(max_length=50)),
                ('account_name', models.CharField(max_length=100)),
                ('store', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bank_details', to='stores.store')),
            ],
        ),
    ]
