import secrets
import string
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from .models import CareerApplication, UserProfile
from crm.models import TeamMember


from django.utils import timezone


def generate_unique_employee_id(applicant_name, date_obj=None):
    """
    Generates a unique Employee ID in format: [First 4 letters Capitalized]/[DDMM]/[Sequential Number]
    Example: Applicant "Rahul" hired on 28-07-2026 -> Rahu/2807/01
    """
    # 1. Extract first 4 non-space letters & capitalize first letter
    clean_name = "".join(c for c in applicant_name if c.isalpha())
    if not clean_name:
        clean_name = "User"
    name_part = clean_name[:4].capitalize()

    # 2. Format Date as DDMM
    target_date = date_obj or timezone.now()
    date_part = target_date.strftime("%d%m")

    # 3. Count existing users for sequential padding
    count = User.objects.count() + 1

    while True:
        seq_part = str(count).zfill(2)
        employee_id = f"{name_part}/{date_part}/{seq_part}"

        # Uniqueness check
        if not UserProfile.objects.filter(employee_id=employee_id).exists() and not User.objects.filter(username=employee_id).exists():
            return employee_id
        count += 1


def generate_secure_password(length=8):
    """
    Generates a secure random 8-character password.
    """
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


@receiver(post_save, sender=CareerApplication)
def handle_hired_candidate_automation(sender, instance, created, **kwargs):
    """
    Triggered when a CareerApplication is saved.
    When hire_status is 'Hired' or is_converted is True, automatically:
      1. Generates Employee ID & Password.
      2. Creates Django User & UserProfile.
      3. Creates CRM TeamMember.
      4. Sends congratulatory HTML onboarding email.
    """
    # Trigger condition: Candidate status is 'Hired' or is_converted is True
    if instance.hire_status == 'Hired' or instance.is_converted:
        # Check if user account already exists for this email or candidate
        if User.objects.filter(email=instance.email).exists():
            # User already hired/created
            return

        employee_id = generate_unique_employee_id(instance.name, getattr(instance, 'created_at', None))
        raw_password = generate_secure_password(8)

        name_parts = instance.name.strip().split(' ', 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        # 1. Create Django User
        user = User.objects.create_user(
            username=employee_id,
            email=instance.email,
            password=raw_password,
            first_name=first_name,
            last_name=last_name,
            is_staff=True,  # Allow Django Admin access
        )

        # Infer department
        dept = 'Engineering'
        r_lower = instance.role_applied.lower()
        if 'video' in r_lower or 'graphic' in r_lower or 'design' in r_lower:
            dept = 'Creative & Media Production'
        elif 'marketer' in r_lower or 'seo' in r_lower or 'writer' in r_lower:
            dept = 'Growth & Marketing'

        # 2. Create User Profile
        UserProfile.objects.create(
            user=user,
            employee_id=employee_id,
            role=instance.role_applied,
            department=dept,
            can_view_finance=False,  # Regular employee default
            can_view_all_projects=False,
            is_agency_admin=False,
        )

        # 3. Create or Link CRM TeamMember
        TeamMember.objects.get_or_create(
            name=instance.name,
            defaults={
                'role': instance.role_applied,
                'is_freelancer': False,
                'standard_charge': 0.00,
                'average_rating': 5.0,
                'total_tasks_completed': 0,
            }
        )

        # Ensure instance flags are marked in DB without infinite recursion
        if not instance.is_converted or instance.hire_status != 'Hired':
            CareerApplication.objects.filter(id=instance.id).update(
                hire_status='Hired',
                is_converted=True
            )

        # 4. Automated Congratulatory Email
        login_url = "http://localhost:3000/agency-portal"
        subject = f"Welcome to Urbanix Solution! Your Official Account Credentials ({employee_id})"
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@urbanixsolution.online')
        to_email = [instance.email]

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0f19; color: #f5f5f7; margin: 0; padding: 20px; }}
            .card {{ max-width: 600px; margin: 0 auto; background: #111827; border: 1px solid #1e2c44; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }}
            .header {{ text-align: center; border-b: 1px solid #1e2c44; padding-bottom: 20px; }}
            .badge {{ display: inline-block; background: rgba(6,182,212,0.15); border: 1px solid rgba(6,182,212,0.4); color: #22d3ee; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }}
            .title {{ font-size: 24px; font-weight: 800; color: #ffffff; margin-top: 12px; }}
            .creds-box {{ background: #0b0f19; border: 1px solid #374151; border-radius: 12px; padding: 20px; margin: 24px 0; }}
            .cred-item {{ margin-bottom: 12px; font-family: monospace; font-size: 14px; color: #e5e7eb; }}
            .cred-val {{ font-weight: bold; color: #22d3ee; font-size: 16px; }}
            .btn {{ display: block; width: 220px; margin: 24px auto 0; text-align: center; background: linear-gradient(135deg, #22d3ee, #14b8a6); color: #0b0f19; font-weight: bold; text-decoration: none; padding: 14px 24px; border-radius: 10px; box-shadow: 0 4px 20px rgba(6,182,212,0.3); }}
            .footer {{ text-align: center; font-size: 11px; color: #6b7280; margin-top: 24px; }}
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <span class="badge">Urbanix Solution Onboarding</span>
              <h1 class="title">Congratulations, {instance.name}! 🎉</h1>
            </div>
            <p style="color: #9ca3af; font-size: 14px; line-height: 1.6;">
              We are thrilled to officially welcome you to the <strong>Urbanix Solution</strong> team as a <strong>{instance.role_applied}</strong>.
            </p>
            <p style="color: #9ca3af; font-size: 14px; line-height: 1.6;">
              Your internal agency CRM workspace account has been provisioned. Please find your secure login credentials below:
            </p>
            
            <div class="creds-box">
              <div class="cred-item">Portal URL: <span style="color: #60a5fa;">{login_url}</span></div>
              <div class="cred-item">Employee ID: <span class="cred-val">{employee_id}</span></div>
              <div class="cred-item">Password: <span class="cred-val">{raw_password}</span></div>
            </div>

            <a href="{login_url}" class="btn">LOG IN TO CRM PORTAL</a>

            <div class="footer">
              Urbanix Solution Security Protocol • Do not share your password with anyone.
            </div>
          </div>
        </body>
        </html>
        """

        plain_content = strip_tags(html_content)

        try:
            msg = EmailMultiAlternatives(subject, plain_content, from_email, to_email)
            msg.attach_alternative(html_content, "text/html")
            msg.send(fail_silently=False)
            print(f"[HIRING AUTOMATION] Congratulatory email sent to {instance.email} for {employee_id}")
        except Exception as e:
            print(f"[HIRING AUTOMATION EMAIL ERROR] Failed to send email to {instance.email}: {e}")
