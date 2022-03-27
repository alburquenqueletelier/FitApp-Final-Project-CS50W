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
    if (id):
        exercise = Exercise.objects.filter(id=id)
    else:
        exercise = Exercise.objects.all()
    return JsonResponse([exer.serialize() for exer in exercise], safe=False)

# API para agregar ejercicio a la planificacion
# Consta de creación de box, agregar dias según usuario
# y finalmente agregar box a la planificación del usuario
# Si metodo = POST => Edita información
@csrf_exempt
@login_required
def add_exercise(request, id):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    else:
        exercise = Exercise.objects.get(id=id)
        user = User.objects.get(username = request.user)
        plan = Plan.objects.get(owner=user)
        data_post = json.loads(request.body)
        series = data_post.get('series')
        reps = data_post.get('reps')
        days = data_post.get('days')
    try:
        box_exercise = Box_exercise.objects.create(
            owner =  user,
            exercise = exercise,
            reps = reps,
            series = series
        )
    except AssertionError as error:
        return JsonResponse({"error": error}, status=400)
    
    if days:
        for day in days:
            d = Day_week.objects.get(name=day)
            box_exercise.day.add(d)
        box_exercise.save()
    
    plan.exercises.add(box_exercise)
    return JsonResponse({"message": "Exercise added in your routine."}, status=201)

# API para editar box_exercise del usuario
@csrf_exempt
@login_required
def edit_exercise(request, id):
    # Edit exercise or delete
    if request.method != 'PUT':
        return JsonResponse({"error": "PUT request required."}, status=400)
    
    user = User.objects.get(username = request.user)
    exercise = Exercise.objects.get(id=id)
    box_exercise = Box_exercise.objects.get(owner=user, exercise=exercise)
    plan = Plan.objects.get(owner = user)

    data_post = json.loads(request.body)
    series = data_post.get('series')
    reps = data_post.get('reps')
    days = data_post.get('days')

    if not (days):
        # plan.exercises.remove(box_exercise)
        return remove_exercise(request, id)
    else:
        box_exercise.day.clear()
        box_exercise.reps = reps
        box_exercise.series = series
        for day in days:
            d = Day_week.objects.get(name=day)
            box_exercise.day.add(d)
        box_exercise.save()
        return JsonResponse({"message": "Exercise edited in your routine."}, status=201)

# API para remover un ejercicio del plan
@csrf_exempt
@login_required
def remove_exercise(request, id):
    if request.method != 'GET':
        return JsonResponse({"error": "POST request required."}, status=400) 

    user = User.objects.get(username = request.user)
    exercise = Exercise.objects.get(id=id)
    box_exercise = Box_exercise.objects.get(owner=user, exercise=exercise)
    plan = Plan.objects.get(owner = user)
    plan.exercises.remove(box_exercise)
    box_exercise.delete()
    return JsonResponse({"message": "Exercise remove from your routine."}, status=201)

# API para cargar el box_exercise del usuario en el formulario del menu para añadir ejercicio a rutina
def info_exercise(request, id):
    if request.method != 'GET':
        return JsonResponse({"error": "Bad Request"}, status=400)
    
    exercise = Exercise.objects.get(id=id)
    box_exercise = Box_exercise.objects.get(owner=request.user, exercise=exercise)
    return JsonResponse(box_exercise.serialize())

# API para cargar ejercicios de la planificación
@csrf_exempt
@login_required
def load_plan(request, id=None):
    if request.method != 'GET':
        return JsonResponse({"error": "Bad Request"}, status=400)
    user = request.user
    plan = Plan.objects.get(owner=user)
    all_box = plan.exercises.all()
    box_serialize = []
    all_tracker = []
    for box in all_box:
        box_serialize.append(box.serialize())
        tracker = Tracker.objects.filter(owner=box)
        if tracker:
            for t in tracker:
                all_tracker.append(t.serialize())
    data = {
        "plan":plan.serialize(),
        "exercises":box_serialize,
        "tracker" : all_tracker
    }
    return JsonResponse(data, status=201)


# API para cargar información de la planificación y resultados


# # API para obtener calendario
# def calendar_view(request):
#     cal = HTMLCalendar().formatmonth(2022,2)
#     return JsonResponse(cal, safe=False)