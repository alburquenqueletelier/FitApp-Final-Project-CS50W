from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass

class Muscle(models.Model):

    name = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name}"

class Exercise(models.Model):

    name = models.CharField(max_length=100)
    description = models.TextField(max_length=1000)
    primary_muscles = models.ManyToManyField(Muscle, related_name="primary")
    secondary_muscles = models.ManyToManyField(Muscle, related_name="secondary")
    imagen = models.ImageField(upload_to='images', default='images', blank=True)
    video = models.FileField(upload_to="video", blank=True)
    register_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}"

