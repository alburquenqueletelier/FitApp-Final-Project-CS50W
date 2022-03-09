from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *
# Register your models here.

class MuscleAdmin(admin.ModelAdmin):
    list_display = ("id", "name")

class ExcerciseInLine(admin.StackedInline):
    model = Exercise
    filter_horizontal = ('Muscles',)

class CustomExerciseAdmin(UserAdmin):
    save_on_top = True
    list_display = ('id', 'name', 'description', 'register_date')
    inlines = [ExcerciseInLine]

admin.site.register(User)
admin.site.register(Exercise)
admin.site.register(Plan)
admin.site.register(Box_exercise)
admin.site.register(Muscle, MuscleAdmin)
admin.site.register(Day_week)