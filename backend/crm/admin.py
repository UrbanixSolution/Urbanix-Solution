"""
Admin configuration for the Agency CRM & ERP.

Registers all CRM models with fully-featured ModelAdmin classes so the
agency owner gets a powerful, filterable, searchable Django admin dashboard.
"""

from django.contrib import admin, messages
from django.contrib.auth.models import User
from django.utils.html import format_html
import logging
import secrets

from api.models import UserProfile
from api.signals import generate_secure_password, send_update_credentials_email
from .models import (
    TeamMember,
    Client,
    ProjectTask,
    ContactLead,
)

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Team Member Admin
# ---------------------------------------------------------------------------

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    """Admin view for agency team members and freelancers."""

    list_display  = ('name', 'email', 'phone_number', 'role', 'state', 'district', 'is_freelancer', 'send_update_email', 'standard_charge', 'average_rating', 'total_tasks_completed')
    list_editable = ('send_update_email',)
    list_filter   = ('is_freelancer', 'send_update_email', 'role', 'state')
    search_fields = ('name', 'email', 'phone_number', 'role', 'state', 'district', 'town')
    ordering      = ('name',)

    fieldsets = (
        ('Identity', {
            'fields': ('name', 'email', 'role', 'is_freelancer', 'services', 'send_update_email'),
        }),
        ('Application Details', {
            'fields': ('phone_number', 'state', 'district', 'town', 'portfolio_link', 'why_join_us'),
            'description': 'Information copied automatically from the original Career Application when this person was accepted.',
            'classes': ('collapse',),
        }),
        ('Financials & Performance', {
            'fields': ('standard_charge', 'average_rating', 'total_tasks_completed'),
            'description': 'Financial and performance metrics for this team member.',
        }),
    )

    def save_model(self, request, obj, form, change):
        """
        When 'send_update_email' is checked on a TeamMember record:
        1. Find or create the matching User / UserProfile account.
        2. Generate a new secure 8-character password and update the User.
        3. Dispatch an HTML onboarding/update email with credentials and portal link.
        4. Reset 'send_update_email' to False and show a success/error message in Admin.
        """
        should_send_email = obj.send_update_email and bool(obj.email and str(obj.email).strip())

        if should_send_email:
            email_str = str(obj.email).strip().lower()
            try:
                # 1. Lookup user by email
                user = User.objects.filter(email__iexact=email_str).first()

                # Generate new 8-character password
                new_password = generate_secure_password(8)

                if user:
                    user.set_password(new_password)
                    user.save()

                    profile = UserProfile.objects.filter(user=user).first()
                    if profile:
                        profile.role = obj.role
                        profile.save()
                        employee_id = profile.employee_id
                    else:
                        employee_id = user.username
                else:
                    # Create User & UserProfile if none exists for this email
                    name_parts = obj.name.strip().split(' ', 1) if obj.name else ['Freelancer', '']
                    first_name = name_parts[0]
                    last_name = name_parts[1] if len(name_parts) > 1 else ''
                    
                    # Safe unique username
                    username_base = email_str.split('@')[0][:25]
                    username = username_base
                    counter = 1
                    while User.objects.filter(username=username).exists():
                        username = f"{username_base}{counter}"
                        counter += 1

                    user = User.objects.create_user(
                        username=username,
                        email=email_str,
                        password=new_password,
                        first_name=first_name,
                        last_name=last_name,
                        is_staff=True,
                    )
                    employee_id = f"FL-{user.id:04d}"
                    UserProfile.objects.create(
                        user=user,
                        employee_id=employee_id,
                        role=obj.role,
                        department="Freelance Network",
                        can_view_finance=False,
                        can_view_all_projects=False,
                    )

                # 2. Dispatch credentials email
                send_update_credentials_email(
                    email=email_str,
                    name=obj.name or first_name,
                    role=obj.role,
                    employee_id=employee_id,
                    new_password=new_password,
                )

                # 3. Reset flag to prevent re-triggering
                obj.send_update_email = False
                messages.success(request, f"✅ Credentials update email sent successfully to {email_str} (Employee ID: {employee_id})!")

            except Exception as e:
                logger.exception(f"Failed to send update email to {obj.email}: {e}")
                obj.send_update_email = False
                messages.error(request, f"❌ Failed to send update email to {obj.email}: {str(e)}")

        super().save_model(request, obj, form, change)




# ---------------------------------------------------------------------------
# Client Admin
# ---------------------------------------------------------------------------

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    """Admin view for agency clients."""

    list_display  = ('company_name', 'client_name', 'total_revenue_generated')
    search_fields = ('company_name', 'client_name')
    ordering      = ('company_name',)

    fieldsets = (
        ('Company', {
            'fields': ('company_name', 'client_name'),
        }),
        ('Revenue', {
            'fields': ('total_revenue_generated',),
            'description': 'Cumulative revenue billed to this client.',
        }),
    )


# ---------------------------------------------------------------------------
# Project Task Admin
# ---------------------------------------------------------------------------

@admin.register(ProjectTask)
class ProjectTaskAdmin(admin.ModelAdmin):
    """Admin view for project tasks — shows profitability at a glance."""

    list_display  = (
        'task_name', 'client', 'assigned_to',
        'status', 'display_profit', 'performance_rating',
        'client_charged_amount', 'freelancer_paid_amount',
    )
    list_filter   = ('status', 'performance_rating', 'assigned_to')
    search_fields = ('task_name', 'client__company_name', 'assigned_to__name')
    ordering      = ('-id',)
    readonly_fields = ('display_profit',)

    fieldsets = (
        ('Task Details', {
            'fields': ('task_name', 'client', 'assigned_to', 'status'),
        }),
        ('Financials', {
            'fields': ('client_charged_amount', 'freelancer_paid_amount', 'display_profit'),
            'description': 'Profit = Client Charged − Freelancer Paid',
        }),
        ('Performance', {
            'fields': ('performance_rating',),
        }),
    )

    @admin.display(description='Profit', ordering='client_charged_amount')
    def display_profit(self, obj):
        """Render the computed profit with colour-coded styling."""
        profit = obj.profit
        colour = '#28a745' if profit >= 0 else '#dc3545'
        return format_html(
            '<strong style="color: {};">{}</strong>',
            colour,
            f'₹{profit:,.2f}',
        )


# ---------------------------------------------------------------------------
# Contact Lead Admin
# ---------------------------------------------------------------------------

@admin.register(ContactLead)
class ContactLeadAdmin(admin.ModelAdmin):
    """Admin view for inbound contact / enquiry leads."""

    list_display  = ('name', 'email', 'service_interested', 'submitted_at')
    list_filter   = ('submitted_at', 'service_interested')
    search_fields = ('name', 'email', 'service_interested')
    ordering      = ('-submitted_at',)
    readonly_fields = ('submitted_at',)

    fieldsets = (
        ('Contact', {
            'fields': ('name', 'email'),
        }),
        ('Enquiry', {
            'fields': ('service_interested', 'message', 'submitted_at'),
        }),
    )



