from calendar import HTMLCalendar
import calendar
import json
from django.http import JsonResponse
from multiprocessing import context
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.db import IntegrityError
from django.shortcuts import render
from .models import *
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt, csrf_protect

# Pagina principal
def index(request):
    return render(request, "routine/index.html")

# Pagina de identificacion
def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "routine/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "routine/login.html")

# pagina para cerrar cesion
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

# pagina para registrar usuario
def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "routine/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
            plan = Plan(owner=user)
            plan.save()
        except IntegrityError:
            return render(request, "routine/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "routine/register.html")

# API para obtener info de ejercicios
def menu_exercise(request, id=None):
    exercise = Exercise.objects.all()
    if (id):
        exercise = Exercise.objects.filter()
    return JsonResponse([exer.serialize() for exer in exercise], safe=False)

# API para agregar ejercicio a la planificacion
# Consta de creación de box, agregar dias según usuario
# y finalmente agregar box a la planificación del usuario
@csrf_exempt
@login_required
def add_exercise(request, id):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    exercise = Exercise.objects.get(id=id)
    user = User.objects.get(username = request.user)
    plan = Plan.objects.get(owner=user)
    data_post = json.loads(request.body)
    series = data_post.get('series')
    reps = data_post.get('reps')
    days = data_post.get('days')
    box_exercise = Box_exercise.objects.create(
        owner =  user,
        exercise = exercise,
        reps = reps,
        series = series
    )
    for day in days:
        d = Day_week.objects.get(name=day)
        box_exercise.day.add(d)
    box_exercise.save()
    return JsonResponse({"message": "Exercise added in your routine."}, status=201)




# API para cargar ejercicios de la planificación


# API para cargar información de la planificación y resultados


# API para obtener calendario
def calendar_view(request):
    cal = HTMLCalendar().formatmonth(2022,2)
    return JsonResponse(cal, safe=False)