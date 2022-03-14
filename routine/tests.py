import email
from django.test import TestCase, Client
from django.test import LiveServerTestCase
from .models import *
# Create your tests here.

class ModelsTestCase(TestCase):

    def setUp(self):
        ## Creando Admin y Usuarios
        U_admin = User.objects.create(
            username = 'baaltazar',
            email = 'alburquenque.letelier@gmail.com',
            password = 'soyelmejor92',
            is_superuser = True
            )
        U1 = User.objects.create(
            username='prueba1',
            email = 'prueba1@gmail.com',
            password = ''
            )
        U2 = User.objects.create(
            username='prueba2',
            email = 'prueba2@gmail.com',
            password = ''
            )
        U_admin.save()
        U1.save()
        U2.save()

        ## Creando planificacion
        PA = Plan.objects.create(
            owner = U_admin
        )
        P1 = Plan.objects.create(
            owner = U1
        )
        P2 = Plan.objects.create(
            owner = U2
        )
        PA.save()
        P1.save()
        P2.save()
        
        ## Creando grupos musculares
        Dorsal = Muscle.objects.create(name = 'Dorsal')
        Pectoral = Muscle.objects.create(name = 'Pectoral')
        Trapecio = Muscle.objects.create(name = 'Trapecio')
        Tricep = Muscle.objects.create(name = 'Tricep')
        Bicep = Muscle.objects.create(name = 'Bicep')
        Dorsal.save()
        Pectoral.save()
        Trapecio.save()
        Tricep.save()
        Bicep.save()
    
        ## Creando ejercicios
        Pull_up = Exercise.objects.create(
            name = 'Pull Up',
            description = 'Ejercicio que consiste en colgarse de una barra y levantarse hasta...',
            imagen = 'C:/Users/Bryan/Desktop/CS50W/Final_Project/media/images/pull_up.JPEG',
            video = 'C:/Users/Bryan/Desktop/CS50W/Final_Project/media/video/The_Pull-Up.mp4'
        )
        Pull_up.primary_muscles.add(Dorsal)
        Pull_up.secondary_muscles.add(Tricep, Bicep)
        Pull_up.save()

        ## Creando dias de la semana
        #1
        Lunes = Day_week.objects.create(
            name = 'Lunes'
        )
        #2
        Martes = Day_week.objects.create(
            name = 'Martes'
        )
        #3
        Miercoles = Day_week.objects.create(
            name = 'Miercoles'
        )
        #4
        Jueves = Day_week.objects.create(
            name = 'Jueves'
        )
        #5
        Viernes = Day_week.objects.create(
            name = 'Viernes'
        )
        #6
        Sabado = Day_week.objects.create(
            name = 'Sabado'
        )
        #7
        Domingo = Day_week.objects.create(
            name = 'Domingo'
        )
        Lunes.save()
        Martes.save()
        Miercoles.save()
        Jueves.save()
        Viernes.save()
        Sabado.save()
        Domingo.save()

        ## Creando Box de ejercicio
        S_pull_up = Box_exercise.objects.create(
            owner = U_admin,
            exercise = Pull_up,
            reps = 4,
            series = 12
        )
        S_pull_up.day.add(Lunes,Viernes)
        S_pull_up.save()

    def test_index(self):

        c = Client()
        response = c.get("")
        self.assertEqual(response.status_code, 200)

    def test_box_exercise(self):
        box = Box_exercise.objects.all()
        pull_up = Exercise.objects.get(name="Pull Up")
        self.assertIsNotNone(box)
        self.assertEqual(box[0].exercise, pull_up)
