from atexit import register
from tkinter import CASCADE
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _
from django.utils.translation import gettext_lazy as _

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

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "primary_muscles": [muscle.name for muscle in self.primary_muscles.all()],
            "secondary_muscles": [muscle.name for muscle in self.secondary_muscles.all()],
            "imagen": self.imagen.url,
            "video": self.video.url,
            "register_date": self.register_date
        } 


class Day_week(models.Model):
    
    name = models.CharField(max_length=15)

    def __str__(self):
        return f"{self.name}"

class Box_exercise(models.Model):

    owner = models.OneToOneField(User, primary_key=True, on_delete=models.CASCADE)
    exercise = models.OneToOneField(Exercise, on_delete=models.CASCADE)
    reps = models.IntegerField(blank=True)
    series = models.IntegerField(blank=True)
    day = models.ManyToManyField(Day_week, blank=True, related_name="onday")
    register_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.owner, self.exercise}"
    

class Plan(models.Model):

    owner = models.OneToOneField(User, primary_key=True, on_delete=models.CASCADE)
    exercises = models.ManyToManyField(Box_exercise, related_name="added", blank=True)
    register_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.owner}"