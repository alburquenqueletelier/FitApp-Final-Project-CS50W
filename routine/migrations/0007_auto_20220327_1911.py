# Generated by Django 3.1.2 on 2022-03-27 22:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('routine', '0006_tracker'),
    ]

    operations = [
        migrations.AlterField(
            model_name='exercise',
            name='video',
            field=models.FileField(blank=True, default='videos', upload_to='video'),
        ),
    ]