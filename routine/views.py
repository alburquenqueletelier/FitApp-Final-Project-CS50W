import json
from django.http import JsonResponse
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.db import IntegrityError
from django.shortcuts import render
from .models import *
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect

######################################################################################
##################################### ONLY VIEWS #####################################
######################################################################################

# Principal view
@ensure_csrf_cookie
def index(request):
    return render(request, "routine/index.html")

# Identification view
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

# View to close assignment
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

# View to register user
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
            # Create plan for the new user
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

# View of the results of the specific user
# The info is fetch from others.js
def others_page(request, name):
    return render(request, "routine/others.html")

####################################################################################
##################################### ONLY API #####################################
####################################################################################

# API to get exercise info
def menu_exercise(request, id=None):
    if (id):
        exercise = Exercise.objects.filter(id=id)
    else:
        exercise = Exercise.objects.all()
    return JsonResponse([exer.serialize() for exer in exercise], safe=False)

# API to add exercise to the plan
# It consists of box creation, add days according to user
# and finally add box to the user schedule
# ONLY allow Post method
@login_required
def add_exercise(request, id):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    else:
        # Load User and Exercise info
        exercise = Exercise.objects.get(id=id)
        user = User.objects.get(username = request.user)
        plan = Plan.objects.get(owner=user)
        # load received data packet
        data_post = json.loads(request.body)
        series = data_post.get('series')
        reps = data_post.get('reps')
        days = data_post.get('days')
    try:
        # Create new box exercise
        box_exercise = Box_exercise.objects.create(
            owner =  user,
            exercise = exercise,
            reps = reps,
            series = series
        )
    except AssertionError as error:
        return JsonResponse({"error": error}, status=400)

    # Add selected days of workout
    if days:
        for day in days:
            d = Day_week.objects.get(name=day)
            box_exercise.day.add(d)
        box_exercise.save()
    else:
        return JsonResponse({"error": "You've to at last mark 1 day"}, status=400)
    
    # Add box exercise to plan
    plan.exercises.add(box_exercise)
    return JsonResponse({"message": "Exercise added in your routine."}, status=201)

# API to edit user's box_exercise
@login_required
def edit_exercise(request, id):
    # Edit exercise or delete
    if request.method != 'PUT':
        return JsonResponse({"error": "PUT request required."}, status=400)
    # Load User and exercise info
    user = User.objects.get(username = request.user)
    exercise = Exercise.objects.get(id=id)
    box_exercise = Box_exercise.objects.get(owner=user, exercise=exercise)
    plan = Plan.objects.get(owner = user)
    # load received data packet
    data_post = json.loads(request.body)
    series = data_post.get('series')
    reps = data_post.get('reps')
    days = data_post.get('days')

    # (decrepited: It is handled by model and front-end permissions.) 
    # Call remove_exercise if user don't select at last one day
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

# API to remove an exercise from the plan
@login_required
def remove_exercise(request, id):
    # ONLY allow Get method
    if request.method != 'GET':
        return JsonResponse({"error": "POST request required."}, status=400) 
    # Load user and exercise info
    user = User.objects.get(username = request.user)
    exercise = Exercise.objects.get(id=id)
    box_exercise = Box_exercise.objects.get(owner=user, exercise=exercise)
    plan = Plan.objects.get(owner = user)
    # Remove and delete box exercise from de plan
    plan.exercises.remove(box_exercise)
    box_exercise.delete()
    return JsonResponse({"message": "Exercise remove from your routine."}, status=201)

# API to load the user's box_exercise in the menu form to add exercise to routine
@login_required
def info_exercise(request, id):
    # Only allow Get method
    if request.method != 'GET':
        return JsonResponse({"error": "Bad Request"}, status=400)
    
    exercise = Exercise.objects.get(id=id)
    box_exercise = Box_exercise.objects.get(owner=request.user, exercise=exercise)
    return JsonResponse(box_exercise.serialize())

# API to load planning exercises
@login_required
def load_plan(request, name=None):
    # Only allow Get method
    if request.method != 'GET':
        return JsonResponse({"error": "Bad Request"}, status=400)
    if name:
        user = User.objects.get(username=name)
    else:
        user = request.user
    # Load user info and his plan exercises
    plan = Plan.objects.get(owner=user)
    # Serialize all the load models to send info to the user
    all_box = plan.exercises.all()
    box_serialize = []
    all_tracker = []
    for box in all_box:
        box_serialize.append(box.serialize())
        # Tracker only loads if exist. This is create only when
        # user add his results
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

# API to update the tracking of the specified exercise
@login_required
def upload_track(request, id):
    if request.method != 'POST':
        return JsonResponse({"error": "Bad Request"}, status=400)
    
    data_put = json.loads(request.body)
    series = data_put.get('series')
    reps = data_put.get('reps')

    exercise = Exercise.objects.get(id=id)
    user = request.user
    box_exercise = Box_exercise.objects.get(owner=user, exercise=exercise)
    # Create new track for the box exercise that contain the value of series and reps 
    # enter by the user. Every time the user add a result, create a new tracker with
    # the values.
    tracker = Tracker.objects.create(owner=box_exercise, series=series, reps=reps)
    tracker.save()
    return JsonResponse({'message':'Se actualizo los resultados de tu ejercicio'}, status=201)

# API to load all users except request user
@login_required
def users_list(request):
    users = User.objects.exclude(username = request.user)
    return JsonResponse([user.serialize() for user in users], safe=False)