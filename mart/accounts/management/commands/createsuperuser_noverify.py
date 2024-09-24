import getpass
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Create a superuser without email verification'

    def handle(self, *args, **options):
        # Prompt for required fields
        print("Creating a superuser without email verification")
        print("-----------------------------------------------")
        first_name = input("Enter first name: ")
        last_name = input("Enter last name: ")
        username = input("Enter username: ")
        email = input("Enter email: ")

        # Password confirmation step using getpass to hide the password input
        while True:
            password = getpass.getpass("Enter password: ")
            confirm_password = getpass.getpass("Confirm password: ")
            if password == confirm_password:
                break
            else:
                self.stdout.write(self.style.ERROR("Passwords do not match. Please try again."))

        # Create the superuser
        user = User.objects.create_superuser(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        # Optionally set other fields like email verification flag
        user.is_email_verified = True
        user.save()

        self.stdout.write(self.style.SUCCESS(f'Superuser {first_name} {last_name} created successfully with username "{username}"'))
