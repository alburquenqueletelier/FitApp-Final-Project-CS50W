from unicodedata import name
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    ## API ##
    path("users", views.users_list, name="users_list"),
    path("exercises", views.menu_exercise, name="menu_exercise"),
    path("exercises/add/<int:id>", views.add_exercise, name="add_exercise"),
    path("exercises/edit/<int:id>", views.edit_exercise, name="add_exercise"),
    path("exercises/info/<int:id>", views.info_exercise, name="info_exercise"),
    path("exercises/remove/<int:id>", views.remove_exercise, name="remove_exercise"),
    path("exercises/track/<int:id>", views.upload_track, name="upload_track"),
    path("plan", views.load_plan, name="load_plan")
    # path("calendar_view", views.calendar_view, name="calendar_view")
]