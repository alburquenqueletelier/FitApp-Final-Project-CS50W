# Generated by Django 3.1.2 on 2022-03-19 06:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('routine', '0004_auto_20220319_0307'),
    ]

    operations = [
        migrations.AlterField(
            model_name='box_exercise',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
