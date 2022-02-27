from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("prueba", views.index2, name="index2"),

    ## API ##
    path("menu_exercise", views.menu_exercise, name="menu_exercise"),
    path("calendar_view", views.calendar_view, name="calendar_view")
]