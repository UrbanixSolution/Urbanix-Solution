import logging
import secrets
import string
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.utils import timezone
from .models import CareerApplication, UserProfile
from crm.models import TeamMember

logger = logging.getLogger(__name__)


def generate_unique_employee_id(applicant_name, date_obj=None):
    """
    Generates a unique Employee ID in format: [First 4 letters Capitalized]/[DDMM]/[Sequential Number]
    Example: Applicant "Rahul" hired on 28-07-2026 -> Rahu/2807/01
    """
    clean_name = "".join(c for c in applicant_name if c.isalpha())
    if not clean_name:
        clean_name = "User"
    name_part = clean_name[:4].capitalize()

    target_date = date_obj or timezone.now()
    date_part = target_date.strftime("%d%m")

    count = User.objects.count() + 1

    while True:
        seq_part = str(count).zfill(2)
        employee_id = f"{name_part}/{date_part}/{seq_part}"

        if not UserProfile.objects.filter(employee_id=employee_id).exists() and not User.objects.filter(username=employee_id).exists():
            return employee_id
        count += 1


def generate_secure_password(length=8):
    """
    Generates a secure random 8-character password.
    """
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def send_update_credentials_email(email, name, role, employee_id, new_password):
    """
    Sends an HTML update email notifying the user of their new role and updated password.
    """
    login_url = "https://www.urbanixsolution.online/agency-portal"
    subject = "Your Urbanix Solution Account & Role Have Been Updated 🚀"
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@urbanixsolution.online')
    to_email = [email]

    html_content = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0f19; color: #f5f5f7; margin: 0; padding: 24px 12px;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <div style="max-width: 600px; width: 100%; background: #111827; border: 1px solid #1f2937; border-radius: 20px; padding: 36px 28px; box-shadow: 0 20px 50px rgba(0,0,0,0.6); text-align: left;">
          
          <!-- Header Branding -->
          <div style="text-align: center; border-bottom: 1px solid #1f2937; padding-bottom: 24px; margin-bottom: 28px;">
            <div style="display: inline-block; background: rgba(6,182,212,0.12); border: 1px solid rgba(6,182,212,0.35); color: #22d3ee; padding: 6px 16px; border-radius: 30px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
              URBANIX SOLUTION • PROFILE & ROLE UPDATE
            </div>
            <h1 style="font-size: 24px; font-weight: 800; color: #ffffff; margin: 16px 0 6px 0; tracking-tight: -0.02em;">
              Your Profile & Role Have Been Updated 🚀
            </h1>
            <p style="font-size: 13px; color: #9ca3af; margin: 0;">
              Elite Digital & Tech Growth Partner
            </p>
          </div>

          <!-- Greeting -->
          <p style="font-size: 15px; line-height: 1.6; color: #e5e7eb; margin-bottom: 16px;">
            Dear <strong>{name}</strong>,
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #9ca3af; margin-bottom: 20px;">
            Your profile/role has been updated. Your new role is <strong style="color: #22d3ee;">{role}</strong>. Here are your updated login credentials:
          </p>

          <!-- Credentials Box -->
          <div style="background: #0b0f19; border: 1px solid #374151; border-radius: 16px; padding: 24px; margin-bottom: 28px;">
            <h3 style="font-size: 12px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 16px 0;">
              🔒 Updated Account Credentials
            </h3>
            
            <div style="margin-bottom: 12px; font-family: monospace; font-size: 14px; color: #d1d5db;">
              <span style="color: #6b7280;">Portal URL:</span> 
              <a href="{login_url}" style="color: #38bdf8; text-decoration: none; font-weight: 600;">{login_url}</a>
            </div>

            <div style="margin-bottom: 12px; font-family: monospace; font-size: 14px; color: #d1d5db;">
              <span style="color: #6b7280;">Employee ID:</span> 
              <span style="color: #22d3ee; font-weight: bold; font-size: 16px; background: rgba(6,182,212,0.1); padding: 2px 8px; border-radius: 6px;">{employee_id}</span>
            </div>

            <div style="font-family: monospace; font-size: 14px; color: #d1d5db;">
              <span style="color: #6b7280;">New Password:</span> 
              <span style="color: #22d3ee; font-weight: bold; font-size: 16px; background: rgba(6,182,212,0.1); padding: 2px 8px; border-radius: 6px;">{new_password}</span>
            </div>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="{login_url}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #0d9488 100%); color: #090d16; font-weight: 800; font-size: 13px; text-decoration: none; padding: 14px 32px; border-radius: 12px; box-shadow: 0 10px 25px rgba(6,182,212,0.3); text-transform: uppercase; letter-spacing: 0.5px;">
              LOG IN TO AGENCY PORTAL →
            </a>
          </div>

          <!-- Social CTA Footer -->
          <div style="border-top: 1px solid #1f2937; text-align: center; padding-top: 24px; margin-top: 28px;">
            <p style="font-size: 12px; font-weight: 600; color: #9ca3af; margin: 0 0 12px 0;">
              Follow our official pages to stay updated with agency news:
            </p>
            <div style="margin-bottom: 20px;">
              <a href="https://www.instagram.com/urbanix_solution/" target="_blank" style="display: inline-block; margin: 0 8px; font-size: 12px; color: #38bdf8; text-decoration: none; font-weight: 600;">Instagram</a>
              <span style="color: #374151;">•</span>
              <a href="https://www.facebook.com/profile.php?id=61592541871468" target="_blank" style="display: inline-block; margin: 0 8px; font-size: 12px; color: #38bdf8; text-decoration: none; font-weight: 600;">Facebook</a>
              <span style="color: #374151;">•</span>
              <a href="https://www.urbanixsolution.online" target="_blank" style="display: inline-block; margin: 0 8px; font-size: 12px; color: #38bdf8; text-decoration: none; font-weight: 600;">Website</a>
            </div>
            <p style="font-size: 11px; color: #4b5563; margin: 0; line-height: 1.5;">
              © 2026 Urbanix Solution. All rights reserved.<br>
              Private & Confidential Security Protocol. Do not forward credentials.
            </p>
          </div>

        </div>
      </td>
    </tr>
  </table>
</body>
</html>
    """
    plain_content = strip_tags(html_content)
    try:
        msg = EmailMultiAlternatives(subject, plain_content, from_email, to_email)
        msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=False)
        logger.info(f"[UPDATE EMAIL] Successfully sent update email to {email}")
        print(f"[UPDATE EMAIL SUCCESS] Sent update email to {email}")
    except Exception as e:
        logger.exception(f"[UPDATE EMAIL ERROR] Failed to send update email to {email}: {e}")
        print(f"[UPDATE EMAIL FAILURE] Exception while sending email to {email}: {e}")


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
    if instance.hire_status == 'Hired' or instance.is_converted:
        if User.objects.filter(email=instance.email).exists():
            return

        employee_id = generate_unique_employee_id(instance.name, getattr(instance, 'created_at', None))
        raw_password = generate_secure_password(8)

        name_parts = instance.name.strip().split(' ', 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        user = User.objects.create_user(
            username=employee_id,
            email=instance.email,
            password=raw_password,
            first_name=first_name,
            last_name=last_name,
            is_staff=True,
        )

        dept = 'Engineering'
        r_lower = instance.role_applied.lower()
        if 'video' in r_lower or 'graphic' in r_lower or 'design' in r_lower:
            dept = 'Creative & Media Production'
        elif 'marketer' in r_lower or 'seo' in r_lower or 'writer' in r_lower:
            dept = 'Growth & Marketing'

        UserProfile.objects.create(
            user=user,
            employee_id=employee_id,
            role=instance.role_applied,
            department=dept,
            can_view_finance=False,
            can_view_all_projects=False,
            is_agency_admin=False,
        )

        TeamMember.objects.get_or_create(
            name=instance.name,
            defaults={
                'role': instance.role_applied,
                'is_freelancer': True,
                'standard_charge': 0.00,
                'average_rating': 5.0,
                'total_tasks_completed': 0,
            }
        )

        if not instance.is_converted or instance.hire_status != 'Hired':
            CareerApplication.objects.filter(id=instance.id).update(
                hire_status='Hired',
                is_converted=True
            )

        login_url = "https://www.urbanixsolution.online/agency-portal"
        subject = "Welcome to Urbanix Solution! You're Hired 🚀"
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@urbanixsolution.online')
        to_email = [instance.email]

        html_content = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0f19; color: #f5f5f7; margin: 0; padding: 24px 12px;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <div style="max-width: 600px; width: 100%; background: #111827; border: 1px solid #1f2937; border-radius: 20px; padding: 36px 28px; box-shadow: 0 20px 50px rgba(0,0,0,0.6); text-align: left;">
          
          <!-- Header Branding -->
          <div style="text-align: center; border-bottom: 1px solid #1f2937; padding-bottom: 24px; margin-bottom: 28px;">
            <div style="display: inline-block; background: rgba(6,182,212,0.12); border: 1px solid rgba(6,182,212,0.35); color: #22d3ee; padding: 6px 16px; border-radius: 30px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
              URBANIX SOLUTION • OFFICIAL ONBOARDING
            </div>
            <h1 style="font-size: 24px; font-weight: 800; color: #ffffff; margin: 16px 0 6px 0; tracking-tight: -0.02em;">
              Welcome to Urbanix Solution! You're Hired 🚀
            </h1>
            <p style="font-size: 13px; color: #9ca3af; margin: 0;">
              Elite Digital & Tech Growth Partner
            </p>
          </div>

          <!-- Greeting -->
          <p style="font-size: 15px; line-height: 1.6; color: #e5e7eb; margin-bottom: 16px;">
            Dear <strong>{instance.name}</strong>,
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #9ca3af; margin-bottom: 20px;">
            We are thrilled to officially welcome you to the <strong>Urbanix Solution</strong> team as a <strong style="color: #22d3ee;">{instance.role_applied}</strong>! After thoroughly reviewing your application and background, we are highly impressed with your capabilities and excited to work together.
          </p>

          <!-- Vetted Network Expectation Box -->
          <div style="background: rgba(6,182,212,0.06); border-left: 4px solid #06b6d4; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
            <p style="font-size: 13px; line-height: 1.6; color: #38bdf8; margin: 0; font-weight: 500;">
              💡 <strong>Vetted Talent Network Expectation:</strong><br>
              You are now officially part of our vetted network. Whenever a new client project arrives that perfectly matches your skillset, we will assign it to you and notify you immediately.
            </p>
          </div>

          <!-- Credentials Box -->
          <div style="background: #0b0f19; border: 1px solid #374151; border-radius: 16px; padding: 24px; margin-bottom: 28px;">
            <h3 style="font-size: 12px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 16px 0;">
              🔒 Your Internal Portal Credentials
            </h3>
            
            <div style="margin-bottom: 12px; font-family: monospace; font-size: 14px; color: #d1d5db;">
              <span style="color: #6b7280;">Portal URL:</span> 
              <a href="{login_url}" style="color: #38bdf8; text-decoration: none; font-weight: 600;">{login_url}</a>
            </div>

            <div style="margin-bottom: 12px; font-family: monospace; font-size: 14px; color: #d1d5db;">
              <span style="color: #6b7280;">Employee ID:</span> 
              <span style="color: #22d3ee; font-weight: bold; font-size: 16px; background: rgba(6,182,212,0.1); padding: 2px 8px; border-radius: 6px;">{employee_id}</span>
            </div>

            <div style="font-family: monospace; font-size: 14px; color: #d1d5db;">
              <span style="color: #6b7280;">Password:</span> 
              <span style="color: #22d3ee; font-weight: bold; font-size: 16px; background: rgba(6,182,212,0.1); padding: 2px 8px; border-radius: 6px;">{raw_password}</span>
            </div>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="{login_url}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #0d9488 100%); color: #090d16; font-weight: 800; font-size: 13px; text-decoration: none; padding: 14px 32px; border-radius: 12px; box-shadow: 0 10px 25px rgba(6,182,212,0.3); text-transform: uppercase; letter-spacing: 0.5px;">
              LOG IN TO AGENCY PORTAL →
            </a>
          </div>

          <!-- Social CTA Footer -->
          <div style="border-top: 1px solid #1f2937; text-align: center; padding-top: 24px; margin-top: 28px;">
            <p style="font-size: 12px; font-weight: 600; color: #9ca3af; margin: 0 0 12px 0;">
              Follow our official pages to stay updated with agency news:
            </p>
            <div style="margin-bottom: 20px;">
              <a href="https://www.instagram.com/urbanix_solution/" target="_blank" style="display: inline-block; margin: 0 8px; font-size: 12px; color: #38bdf8; text-decoration: none; font-weight: 600;">Instagram</a>
              <span style="color: #374151;">•</span>
              <a href="https://www.facebook.com/profile.php?id=61592541871468" target="_blank" style="display: inline-block; margin: 0 8px; font-size: 12px; color: #38bdf8; text-decoration: none; font-weight: 600;">Facebook</a>
              <span style="color: #374151;">•</span>
              <a href="https://www.urbanixsolution.online" target="_blank" style="display: inline-block; margin: 0 8px; font-size: 12px; color: #38bdf8; text-decoration: none; font-weight: 600;">Website</a>
            </div>
            <p style="font-size: 11px; color: #4b5563; margin: 0; line-height: 1.5;">
              © 2026 Urbanix Solution. All rights reserved.<br>
              Private & Confidential Security Protocol. Do not forward credentials.
            </p>
          </div>

        </div>
      </td>
    </tr>
  </table>
</body>
</html>
        """

        plain_content = strip_tags(html_content)

        try:
            msg = EmailMultiAlternatives(subject, plain_content, from_email, to_email)
            msg.attach_alternative(html_content, "text/html")
            msg.send(fail_silently=False)
            logger.info(f"[HIRING AUTOMATION] Sent onboarding email to {instance.email} for {employee_id}")
            print(f"[HIRING AUTOMATION SUCCESS] Sent onboarding email to {instance.email} for {employee_id}")
        except Exception as e:
            logger.exception(f"[HIRING AUTOMATION EMAIL ERROR] Failed to send email to {instance.email}: {e}")
            print(f"[HIRING AUTOMATION EMAIL EXCEPTION] Failed to send email to {instance.email}: {e}")


@receiver(post_save, sender=UserProfile)
def handle_user_profile_update_email(sender, instance, created, **kwargs):
    """
    Triggered when UserProfile.send_update_email is checked.
    Generates a new password, updates the User account, sends an HTML email, and resets the checkbox.
    """
    if instance.send_update_email:
        new_password = generate_secure_password(8)
        
        # Update User password
        user = instance.user
        user.set_password(new_password)
        user.save()

        # Send HTML email with updated role and credentials
        name = user.get_full_name() or user.username
        send_update_credentials_email(
            email=user.email,
            name=name,
            role=instance.role,
            employee_id=instance.employee_id,
            new_password=new_password
        )

        # Reset send_update_email without recursion
        UserProfile.objects.filter(pk=instance.pk).update(send_update_email=False)


@receiver(post_save, sender=TeamMember)
def handle_team_member_update_email(sender, instance, created, **kwargs):
    """
    Triggered when crm.TeamMember.send_update_email is checked.
    Finds matching User/UserProfile, resets password, sends HTML email, and resets the checkbox.
    """
    if instance.send_update_email:
        profile = UserProfile.objects.filter(user__first_name__icontains=instance.name.split()[0]).first()
        if profile:
            new_password = generate_secure_password(8)
            profile.user.set_password(new_password)
            profile.user.save()
            
            # Sync role to profile
            profile.role = instance.role
            profile.save()

            name = profile.user.get_full_name() or instance.name
            send_update_credentials_email(
                email=profile.user.email,
                name=name,
                role=instance.role,
                employee_id=profile.employee_id,
                new_password=new_password
            )

        # Reset send_update_email without recursion
        TeamMember.objects.filter(pk=instance.pk).update(send_update_email=False)
