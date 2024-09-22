from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Create a superuser without email verification'

    def handle(self, *args, **options):
        username = input("Enter username: ")
        email = input("Enter email: ")
        password = input("Enter password: ")
        
        user = User.objects.create_superuser(username=username, email=email, password=password)
        user.is_email_verified = True
        user.save()
        
        self.stdout.write(self.style.SUCCESS(f'Superuser {username} created successfully'))