# Generated by Django 3.1.7 on 2021-06-23 05:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_review_ceatedat'),
    ]

    operations = [
        migrations.RenameField(
            model_name='product',
            old_name='ceatedAt',
            new_name='createdAt',
        ),
        migrations.RenameField(
            model_name='review',
            old_name='ceatedAt',
            new_name='createdAt',
        ),
    ]