"""
Admin configuration for the API app.

Includes Lead Conversion Pipeline actions that promote records from the
raw api inbox into the CRM app (crm.Client and crm.TeamMember).
"""

import logging
from django.contrib import admin
from django.contrib import messages
from django.utils.html import format_html

from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

logger = logging.getLogger(__name__)

from .models import (
    Service,
    Category,
    PortfolioProject,
    ContactLead,
    CareerApplication,
    WebsiteFeedback,
    PricingTier,
    AgencyPartnerLead,
    CallbackRequest,
    UserProfile,
    DashboardPermission,
    CoreTeam,
)

# Unregister default User model from admin
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass


@admin.register(CoreTeam)
class CoreTeamAdmin(UserAdmin):
    """
    Custom UserAdmin for Core Team members.
    Displays as "Core Team" under Authentication section in Django Admin.
    """
    pass


class DashboardPermissionInline(admin.StackedInline):
    """
    Inline Admin Checkboxes for Dashboard Card Permissions.
    Appears directly inside User Profile in Django Admin.
    """
    model = DashboardPermission
    can_delete = False
    verbose_name = "Dashboard Card Permission"
    verbose_name_plural = "Granular Dashboard Card Display Permissions (Checkboxes)"
    fields = [
        'can_view_active_projects_card',
        'can_view_pending_tasks_card',
        'can_view_financials_and_payouts',
        'can_view_project_timeline',
        'can_view_priority_queue',
    ]


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """
    Admin view for User Profiles & RBAC Permissions.
    Agency Admin can enable/disable financial access and administrative privileges per user.
    """
    inlines = [DashboardPermissionInline]
    list_display = ['employee_id', 'user_full_name', 'user_email', 'role', 'department', 'send_update_email', 'can_view_finance', 'can_view_all_projects', 'is_agency_admin']
    list_editable = ['send_update_email', 'can_view_finance', 'can_view_all_projects', 'is_agency_admin']
    list_filter = ['send_update_email', 'can_view_finance', 'can_view_all_projects', 'is_agency_admin', 'department']
    search_fields = ['employee_id', 'user__username', 'user__email', 'user__first_name', 'user__last_name', 'role']
    ordering = ['employee_id']

    @admin.display(description='User Name')
    def user_full_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

    @admin.display(description='Email')
    def user_email(self, obj):
        return obj.user.email


@admin.register(DashboardPermission)
class DashboardPermissionAdmin(admin.ModelAdmin):
    """
    Direct Admin view for Dashboard Card Permissions.
    """
    list_display = ['user', 'can_view_active_projects_card', 'can_view_pending_tasks_card', 'can_view_financials_and_payouts', 'can_view_project_timeline', 'can_view_priority_queue']
    list_editable = ['can_view_active_projects_card', 'can_view_pending_tasks_card', 'can_view_financials_and_payouts', 'can_view_project_timeline', 'can_view_priority_queue']
    search_fields = ['user__username', 'user__email', 'user__first_name', 'user__last_name']


def approve_and_hire(modeladmin, request, queryset):
    """
    Admin Action: Hire selected CareerApplications as crm.TeamMember records.

    For each selected application that has NOT already been converted:
      - Creates a crm.TeamMember using the applicant's name and role.
      - Sets standard_charge to 0.00 as a sensible placeholder (edit later).
      - Marks the original api.CareerApplication as is_converted = True and hire_status = 'Hired'.

    Already-converted applications are silently skipped (idempotent).
    """
    from crm.models import TeamMember

    hired_count = 0
    skipped_count = 0

    for application in queryset:
        if application.is_converted or application.hire_status == 'Hired':
            skipped_count += 1
            continue

        TeamMember.objects.update_or_create(
            name=application.name,
            defaults={
                'email': application.email,
                'role': application.role_applied,
                'is_freelancer': True,
                'standard_charge': 0.00,
                'average_rating': 5.0,
                'total_tasks_completed': 0,
            },
        )

        application.hire_status = 'Hired'
        application.is_converted = True
        application.save()
        hired_count += 1

    parts = []
    if hired_count:
        parts.append(f"{hired_count} applicant(s) hired as CRM Freelance Team Members")
    if skipped_count:
        parts.append(f"{skipped_count} already-hired applicant(s) skipped")

    modeladmin.message_user(request, " | ".join(parts) if parts else "Nothing to process.")


approve_and_hire.short_description = "Hire selected applicants -> Freelance Team"


@admin.register(CareerApplication)
class CareerApplicationAdmin(admin.ModelAdmin):
    """
    Job applications pipeline.
    Hired candidates are automatically excluded from the default changelist view.
    """

    actions = [approve_and_hire]

    list_display  = ['name', 'email', 'phone', 'role_applied', 'hire_status', 'send_hired_email', 'hire_badge', 'created_at']
    list_editable = ['hire_status', 'send_hired_email']
    list_filter   = ['hire_status', 'send_hired_email', 'is_converted', 'role_applied', 'created_at']
    search_fields = ['name', 'email', 'phone', 'role_applied', 'cover_letter']
    ordering      = ['-created_at']
    readonly_fields = ['created_at']

    fieldsets = (
        ('Applicant Details', {
            'fields': ('name', 'email', 'phone'),
        }),
        ('Application', {
            'fields': ('role_applied', 'state', 'district', 'town', 'portfolio_link', 'cover_letter', 'created_at'),
        }),
        ('Hiring Pipeline Status', {
            'fields': ('hire_status', 'is_converted', 'send_hired_email'),
            'description': 'Setting Hire Status to "Hired" and checking "send_hired_email" generates Employee credentials and dispatches the Hired email.',
        }),
    )

    def save_model(self, request, obj, form, change):
        from crm.models import TeamMember
        from .signals import (
            generate_unique_employee_id,
            generate_secure_password,
            send_hired_onboarding_email,
        )

        super().save_model(request, obj, form, change)

        # Process hiring & email explicitly when hire_status == 'Hired' and send_hired_email is True
        if obj.hire_status == 'Hired' and obj.send_hired_email:
            try:
                user_exists = User.objects.filter(email=obj.email).exists()
                if not user_exists:
                    employee_id = generate_unique_employee_id(obj.name, getattr(obj, 'created_at', None))
                    raw_password = generate_secure_password(8)

                    name_parts = obj.name.strip().split(' ', 1)
                    first_name = name_parts[0]
                    last_name = name_parts[1] if len(name_parts) > 1 else ''

                    user = User.objects.create_user(
                        username=employee_id,
                        email=obj.email,
                        password=raw_password,
                        first_name=first_name,
                        last_name=last_name,
                        is_staff=True,
                    )

                    dept = 'Engineering'
                    r_lower = obj.role_applied.lower()
                    if 'video' in r_lower or 'graphic' in r_lower or 'design' in r_lower:
                        dept = 'Creative & Media Production'
                    elif 'marketer' in r_lower or 'seo' in r_lower or 'writer' in r_lower:
                        dept = 'Growth & Marketing'

                    UserProfile.objects.create(
                        user=user,
                        employee_id=employee_id,
                        role=obj.role_applied,
                        department=dept,
                        can_view_finance=False,
                        can_view_all_projects=False,
                        is_agency_admin=False,
                    )
                else:
                    user = User.objects.get(email=obj.email)
                    profile = UserProfile.objects.filter(user=user).first()
                    employee_id = profile.employee_id if profile else user.username
                    raw_password = generate_secure_password(8)
                    user.set_password(raw_password)
                    user.save()

                # Always create or update Freelance Team (TeamMember) profile
                TeamMember.objects.update_or_create(
                    name=obj.name,
                    defaults={
                        'email': obj.email,
                        'role': obj.role_applied,
                        'is_freelancer': True,
                        'standard_charge': 0.00,
                        'average_rating': 5.0,
                        'total_tasks_completed': 0,
                    }
                )

                CareerApplication.objects.filter(id=obj.id).update(
                    hire_status='Hired',
                    is_converted=True
                )

                # Generate Token for Magic Link
                from rest_framework.authtoken.models import Token
                token_obj, _ = Token.objects.get_or_create(user=user)

                # Send Hired Email with Magic Link
                send_hired_onboarding_email(
                    email=obj.email,
                    name=obj.name,
                    role_applied=obj.role_applied,
                    employee_id=employee_id,
                    raw_password=raw_password,
                    magic_token=token_obj.key
                )
                messages.success(request, f"Account created and email sent successfully to {obj.email}!")

            except Exception as e:
                logger.exception(f"Failed to process hired candidate email for {obj.email}: {e}")
                messages.error(request, f"Error: Failed to process - {str(e)}")

            finally:
                # Reset send_hired_email checkbox safely
                CareerApplication.objects.filter(id=obj.id).update(send_hired_email=False)

    def delete_model(self, request, obj):
        """Hard delete single CareerApplication record from Supabase PostgreSQL database."""
        obj.delete()

    def delete_queryset(self, request, queryset):
        """Hard delete selected CareerApplication records from Supabase PostgreSQL database."""
        queryset.delete()

    def get_queryset(self, request):
        """
        OVERRIDE get_queryset:
        Excludes candidates with hire_status == 'Hired' or is_converted == True
        from the default changelist view unless explicitly filtered.
        """
        qs = super().get_queryset(request)
        # Check if request parameters explicitly filter by hire_status or is_converted
        is_filtering = any(k.startswith('hire_status') or k.startswith('is_converted') for k in request.GET.keys())
        if not is_filtering:
            qs = qs.exclude(hire_status='Hired').exclude(is_converted=True)
        return qs

    @admin.display(description='Status Badge', boolean=False)
    def hire_badge(self, obj):
        if obj.hire_status == 'Hired' or obj.is_converted:
            return format_html('<span style="color:#007bff;font-weight:bold;background:#e6f0ff;padding:3px 8px;border-radius:4px;">Hired</span>')
        elif obj.hire_status == 'Interviewing':
            return format_html('<span style="color:#ffc107;font-weight:bold;background:#fff9e6;padding:3px 8px;border-radius:4px;">Interviewing</span>')
        elif obj.hire_status == 'Rejected':
            return format_html('<span style="color:#dc3545;font-weight:bold;background:#ffe6e6;padding:3px 8px;border-radius:4px;">Rejected</span>')
        return format_html('<span style="color:#6c757d;background:#f8f9fa;padding:3px 8px;border-radius:4px;">Pending Review</span>')



# ---------------------------------------------------------------------------
# Service / Pricing Inlines
# ---------------------------------------------------------------------------

class PricingTierInline(admin.TabularInline):
    """
    Inline editor for pricing tiers — add/edit/remove multiple tiers directly inside
    the Service detail page. Appears as a spreadsheet-style table under each service.
    """
    model = PricingTier
    extra = 1
    fields = ['name', 'price', 'delivery_time', 'is_popular', 'order']
    ordering = ['order', 'id']
    show_change_link = True


# ---------------------------------------------------------------------------
# Service Admin
# ---------------------------------------------------------------------------

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    """
    Centralized Pricing Dashboard — edit pricing_text and base_price directly
    from the list view. Manage tiered packages inline below each service.
    """
    inlines = [PricingTierInline]
    list_display = [
        'title',
        'pricing_text',
        'base_price',
        'tier_count',
        'order',
        'is_active',
    ]
    list_editable = [
        'pricing_text',
        'base_price',
        'order',
        'is_active',
    ]
    list_display_links = ['title']
    search_fields = ['title', 'slug', 'short_description', 'pricing_text']
    list_filter = ['is_active']
    ordering = ['order', 'title']
    prepopulated_fields = {'slug': ('title',)}

    def tier_count(self, obj):
        count = obj.pricing_tiers.count()
        return f"{count} tier{'s' if count != 1 else ''}"
    tier_count.short_description = 'Tiers'


# ---------------------------------------------------------------------------
# Pricing Tier Admin
# ---------------------------------------------------------------------------

@admin.register(PricingTier)
class PricingTierAdmin(admin.ModelAdmin):
    """
    Standalone view of all pricing tiers across all services.
    Useful for a quick global overview and bulk edits.
    """
    list_display = ['service', 'name', 'price', 'delivery_time', 'is_popular', 'order']
    list_editable = ['price', 'delivery_time', 'is_popular', 'order']
    list_display_links = ['name']
    list_filter = ['service', 'is_popular']
    search_fields = ['name', 'price', 'service__title']
    ordering = ['service__order', 'order']


# ---------------------------------------------------------------------------
# Category Admin
# ---------------------------------------------------------------------------

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'icon_name', 'order']
    list_editable = ['order']
    list_display_links = ['name']
    search_fields = ['name', 'slug', 'description', 'icon_name']
    ordering = ['order', 'name']
    prepopulated_fields = {'slug': ('name',)}


# ---------------------------------------------------------------------------
# Portfolio Project Admin
# ---------------------------------------------------------------------------

@admin.register(PortfolioProject)
class PortfolioProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'sector', 'results_highlight', 'is_featured', 'live_link', 'created_at']
    list_editable = ['is_featured']
    list_display_links = ['title']
    list_filter = ['category', 'sector', 'is_featured', 'created_at']
    search_fields = ['title', 'short_description', 'results_highlight']
    ordering = ['-created_at']


# ---------------------------------------------------------------------------
# Lead Conversion Pipeline — Actions
# ---------------------------------------------------------------------------

def convert_to_crm_client(modeladmin, request, queryset):
    """
    Admin Action: Convert selected ContactLeads into crm.Client records.

    For each selected lead that has NOT already been converted:
      - Creates a crm.Client using the lead's name as the contact person and
        generates a placeholder company name if one cannot be inferred.
      - Marks the original api.ContactLead as is_converted = True.

    Already-converted leads are silently skipped (idempotent).
    """
    # Import here to avoid circular-import issues at module load time.
    from crm.models import Client

    created_count = 0
    skipped_count = 0

    for lead in queryset:
        if lead.is_converted:
            skipped_count += 1
            continue

        # Build a best-effort company name from the lead's service interest or name.
        company_placeholder = (
            f"{lead.name}'s Business"
            if not lead.service_interested
            else f"{lead.name} ({lead.service_interested})"
        )

        Client.objects.get_or_create(
            # Avoid creating duplicate clients for the same person.
            client_name=lead.name,
            defaults={
                'company_name': company_placeholder,
                'total_revenue_generated': 0.00,
            },
        )

        lead.is_converted = True
        lead.save(update_fields=['is_converted'])
        created_count += 1

    # Build a human-readable result message for the admin changelist banner.
    parts = []
    if created_count:
        parts.append(f"{created_count} lead(s) converted to CRM Clients")
    if skipped_count:
        parts.append(f"{skipped_count} already-converted lead(s) skipped")

    modeladmin.message_user(request, " | ".join(parts) if parts else "Nothing to process.")


convert_to_crm_client.short_description = "Convert selected leads -> CRM Clients"




# ---------------------------------------------------------------------------
# Contact Lead Admin
# ---------------------------------------------------------------------------

@admin.register(ContactLead)
class ContactLeadAdmin(admin.ModelAdmin):
    """Raw inbound contact enquiries from the website. Use the action to push to CRM."""

    actions = [convert_to_crm_client]

    list_display  = ['name', 'email', 'phone', 'service_interested', 'conversion_badge', 'created_at']
    list_filter   = ['is_converted', 'service_interested', 'created_at']
    search_fields = ['name', 'email', 'phone', 'message']
    ordering      = ['-created_at']
    readonly_fields = ['created_at', 'is_converted']

    fieldsets = (
        ('Contact Details', {
            'fields': ('name', 'email', 'phone'),
        }),
        ('Enquiry', {
            'fields': ('service_interested', 'message', 'created_at'),
        }),
        ('CRM Pipeline Status', {
            'fields': ('is_converted',),
            'description': 'Use the "Convert selected leads -> CRM Clients" action to promote this record.',
        }),
    )

    @admin.display(description='CRM Status', boolean=False)
    def conversion_badge(self, obj):
        if obj.is_converted:
            return format_html('<span style="color:#28a745;font-weight:bold;">Converted</span>')
        return format_html('<span style="color:#6c757d;">New</span>')




# ---------------------------------------------------------------------------
# Website Feedback Admin
# ---------------------------------------------------------------------------

@admin.register(WebsiteFeedback)
class WebsiteFeedbackAdmin(admin.ModelAdmin):
    list_display = ['feedback_type', 'short_message', 'contact_info', 'status', 'created_at']
    list_filter = ['status', 'feedback_type', 'created_at']
    search_fields = ['message', 'contact_info']
    list_editable = ['status']
    list_display_links = ['feedback_type']
    ordering = ['-created_at']

    def short_message(self, obj):
        return obj.message[:60] + ('...' if len(obj.message) > 60 else '')
    short_message.short_description = 'Message'


# ---------------------------------------------------------------------------
# Agency Partner Lead Admin
# ---------------------------------------------------------------------------

@admin.register(AgencyPartnerLead)
class AgencyPartnerLeadAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'contact_person', 'core_services', 'state', 'district', 'town', 'whatsapp_number', 'team_size', 'created_at']
    list_filter = ['core_services', 'team_size', 'state', 'created_at']
    search_fields = ['company_name', 'contact_person', 'email', 'whatsapp_number', 'state', 'district', 'town', 'proposal']
    ordering = ['-created_at']
    readonly_fields = ['created_at']


@admin.register(CallbackRequest)
class CallbackRequestAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'phone_number', 'state', 'district', 'town', 'is_completed', 'created_at']
    list_filter = ['is_completed', 'state', 'created_at']
    list_editable = ['is_completed']
    search_fields = ['full_name', 'phone_number', 'state', 'district', 'town']
    ordering = ['-created_at']
    readonly_fields = ['created_at']


