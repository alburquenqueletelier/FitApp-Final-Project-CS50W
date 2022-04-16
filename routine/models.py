from atexit import register
from tkinter import CASCADE
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator


class User(AbstractUser):
    def serialize(self):
        return {
            "id":self.id,
            "name":self.username
        }
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
    video = models.FileField(upload_to="video", default='videos', blank=True)
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

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    reps = models.IntegerField(blank=True, validators=[MinValueValidator(1,'Enter # greater than 0'), MaxValueValidator(100,'Enter # less than 100')])
    series = models.IntegerField(blank=True, validators=[MinValueValidator(1,'Enter # greater than 0'), MaxValueValidator(30,'Enter # less than 30')])
    day = models.ManyToManyField(Day_week, blank=True, related_name="onday")
    register_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.owner.username, self.exercise.name}"

    def serialize(self):
        return {
            "id": self.id,
            "owner":self.owner.serialize(),
            "exercise":self.exercise.serialize(),
            "reps":self.reps,
            "series":self.series,
            "day":[d.name for d in self.day.all()]
        }
    
class Tracker(models.Model):

    owner = models.ForeignKey(Box_exercise, on_delete=models.CASCADE)
    reps = models.IntegerField(blank=True, validators=[MinValueValidator(1,'Enter # greater than 0'), MaxValueValidator(100,'Enter # less than 100')])
    series = models.IntegerField(blank=True, validators=[MinValueValidator(1,'Enter # greater than 0'), MaxValueValidator(30,'Enter # less than 30')])
    register_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.owner.exercise.name}"

    def serialize(self):
        return {
            "owner" : self.owner.id,
            "reps" : self.reps,
            "series" : self.series,
            "date" : self.register_date
        }


class Plan(models.Model):

    owner = models.OneToOneField(User, primary_key=True, on_delete=models.CASCADE)
    exercises = models.ManyToManyField(Box_exercise, related_name="added", blank=True)
    register_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.owner}"
    
    def serialize(self):
        return {
            "owner": self.owner.username,
            "exercise" : [box.exercise.name for box in self.exercises.all()],
            # "days" : [box.day.all()[0] for box in self.exercises.all()],
            # "primary_muscles" : [box.exercise.primary_muscles.all() for box in self.exercises.all()],
            # "secondary_muscles" : [box.exercise.secondary_muscles.all() for box in self.exercises.all()],
            "register_date": self.register_date
        } 