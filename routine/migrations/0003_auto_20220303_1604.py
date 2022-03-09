# Generated by Django 3.1.2 on 2022-03-03 19:04

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
                ('owner', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='routine.user')),
                ('reps', models.IntegerField(blank=True)),
                ('series', models.IntegerField(blank=True)),
                ('register_date', models.DateTimeField(auto_now_add=True)),
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
                ('exercises', models.ManyToManyField(related_name='added', to='routine.Box_exercise')),
            ],
        ),
        migrations.AddField(
            model_name='box_exercise',
            name='exercise',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='routine.exercise'),
        ),
    ]
