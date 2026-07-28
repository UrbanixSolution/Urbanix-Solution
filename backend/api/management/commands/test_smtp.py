from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
import traceback


class Command(BaseCommand):
    help = "Test Django SMTP email sending directly to amardeepgsacademy@gmail.com with raw traceback output."

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("=== Django SMTP Direct Email Test ==="))
        recipient = "amardeepgsacademy@gmail.com"
        
        self.stdout.write(f"EMAIL_BACKEND: {getattr(settings, 'EMAIL_BACKEND', 'Not set')}")
        self.stdout.write(f"EMAIL_HOST: {getattr(settings, 'EMAIL_HOST', 'Not set')}")
        self.stdout.write(f"EMAIL_PORT: {getattr(settings, 'EMAIL_PORT', 'Not set')}")
        self.stdout.write(f"EMAIL_USE_TLS: {getattr(settings, 'EMAIL_USE_TLS', 'Not set')}")
        self.stdout.write(f"EMAIL_HOST_USER: {getattr(settings, 'EMAIL_HOST_USER', 'Not set')}")
        self.stdout.write(f"DEFAULT_FROM_EMAIL: {getattr(settings, 'DEFAULT_FROM_EMAIL', 'Not set')}")
        self.stdout.write("--------------------------------------------------")
        self.stdout.write(f"Attempting to send email to: {recipient}")

        try:
            sent_count = send_mail(
                subject="Urbanix Solution - Direct SMTP Test",
                message="This is a direct SMTP test email sent from Urbanix Solution Django backend management command.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient],
                fail_silently=False,
            )
            self.stdout.write(self.style.SUCCESS(f"SUCCESS! Sent {sent_count} email(s) to {recipient}."))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"SMTP FAILED: {str(e)}"))
            self.stdout.write(self.style.ERROR("=== Full Traceback ==="))
            traceback.print_exc()
