# Generated by Django 3.1.2 on 2022-03-19 06:00

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('routine', '0002_exercise_muscle'),
    ]

    operations = [
        migrations.CreateModel(
            name='Box_exercise',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reps', models.IntegerField(blank=True, validators=[django.core.validators.MinValueValidator(1, 'Enter # greater than 0'), django.core.validators.MaxValueValidator(100, 'Enter # less than 100')])),
                ('series', models.IntegerField(blank=True, validators=[django.core.validators.MinValueValidator(1, 'Enter # greater than 0'), django.core.validators.MaxValueValidator(30, 'Enter # less than 30')])),
                ('register_date', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Day_week',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=15)),
            ],
        ),
        migrations.AlterField(
            model_name='exercise',
            name='imagen',
            field=models.ImageField(blank=True, default='images', upload_to='images'),
        ),
        migrations.AlterField(
            model_name='exercise',
            name='video',
            field=models.FileField(blank=True, upload_to='video'),
        ),
        migrations.CreateModel(
            name='Plan',
            fields=[
                ('owner', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='routine.user')),
                ('register_date', models.DateTimeField(auto_now_add=True)),
                ('exercises', models.ManyToManyField(blank=True, related_name='added', to='routine.Box_exercise')),
            ],
        ),
        migrations.AddField(
            model_name='box_exercise',
            name='day',
            field=models.ManyToManyField(blank=True, related_name='onday', to='routine.Day_week'),
        ),
        migrations.AddField(
            model_name='box_exercise',
            name='exercise',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='routine.exercise'),
        ),
        migrations.AddField(
            model_name='box_exercise',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
