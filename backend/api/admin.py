"""
Admin configuration for the API app.

Includes Lead Conversion Pipeline actions that promote records from the
raw api inbox into the CRM app (crm.Client and crm.TeamMember).
"""

import logging
from django.conf import settings
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
    AssignedProject,
    AssignedTask,
    AssignedPayout,
    CallPartnerApplication,
    ClientLead,
)



# Unregister default User model from admin
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass


class _UserAutocompleteAdmin(UserAdmin):
    """
    Minimal User admin registered only to expose search_fields to the Django
    autocomplete widget used by AssignedProject / AssignedTask / AssignedPayout.
    We do NOT register this under 'auth.User' in the sidebar — it is hidden
    behind the CoreTeam proxy model, but the autocomplete machinery still needs
    a registered admin for the concrete User model.
    """
    search_fields = ['username', 'first_name', 'last_name', 'email']

try:
    admin.site.register(User, _UserAutocompleteAdmin)
except Exception:
    pass  # Already registered elsewhere; autocomplete will use whatever admin is present


@admin.register(CoreTeam)
class CoreTeamAdmin(UserAdmin):
    """
    Custom UserAdmin for Core Team members.
    Displays as "Core Team" under Authentication section in Django Admin.
    search_fields is required to support autocomplete_fields on AssignedProject / AssignedTask / AssignedPayout.
    """
    search_fields = ['username', 'first_name', 'last_name', 'email']



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
        ('Hiring Decision', {
            'fields': ('team_category', 'assigned_services'),
            'description': 'Select the team category and (for Freelancers) the services they are authorized for BEFORE checking the email box below.',
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

        # Process hiring & team database routing when hire_status in ['Hired', 'Accepted'] or send_hired_email is True
        if (obj.hire_status in ['Hired', 'Accepted']) and obj.send_hired_email:
            try:
                # 1. Duplicate check: look up existing User by email
                user = User.objects.filter(email__iexact=obj.email.strip()).first()
                if not user:
                    employee_id = generate_unique_employee_id(obj.name, getattr(obj, 'created_at', None))
                    raw_password = generate_secure_password(8)

                    name_parts = obj.name.strip().split(' ', 1)
                    first_name = name_parts[0]
                    last_name = name_parts[1] if len(name_parts) > 1 else ''

                    user = User(
                        username=employee_id,
                        email=obj.email.strip().lower(),
                        first_name=first_name,
                        last_name=last_name,
                        is_staff=True,
                    )
                    user.set_password(raw_password)
                    user.save()

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
                    profile = UserProfile.objects.filter(user=user).first()
                    employee_id = profile.employee_id if profile else user.username
                    raw_password = generate_secure_password(8)
                    user.set_password(raw_password)
                    user.save()

                # 2. STRICT TEAM ROUTING LOGIC
                # Default for main Career Application form is 'Core Team'
                team_category = obj.team_category or 'Core Team'
                assigned_services_qs = obj.assigned_services.all()
                assigned_services_list = ', '.join(s.title for s in assigned_services_qs) if assigned_services_qs.exists() else 'None assigned'

                if team_category == 'Freelancer Team':
                    # ROUTE TO FREELANCE TEAM (crm.TeamMember)
                    # Transfer all applicant detail fields so the profile is complete in Admin.
                    freelancer_profile, _ = TeamMember.objects.update_or_create(
                        email=obj.email.strip().lower(),
                        defaults={
                            'name': obj.name,
                            'role': obj.role_applied,
                            'is_freelancer': True,
                            'standard_charge': 0.00,
                            'average_rating': 5.0,
                            'total_tasks_completed': 0,
                            # ── Application Details ───────────────────────
                            'phone_number':  (obj.phone or '').strip() or None,
                            'state':         (obj.state or '').strip() or None,
                            'district':      (obj.district or '').strip() or None,
                            'town':          (obj.town or '').strip() or None,
                            'portfolio_link': (obj.portfolio_link or '').strip() or None,
                            'why_join_us':   (obj.cover_letter or '').strip() or None,
                        }
                    )
                    if assigned_services_qs.exists():
                        freelancer_profile.services.set(assigned_services_qs)
                else:
                    # ROUTE TO CORE TEAM (User + UserProfile ONLY)
                    # Ensure applicant is NOT duplicated in TeamMember (Freelance Team)
                    TeamMember.objects.filter(email__iexact=obj.email.strip()).delete()

                CareerApplication.objects.filter(id=obj.id).update(
                    hire_status='Hired',
                    is_converted=True
                )

                # Generate Token for Magic Link / Onboarding
                from rest_framework.authtoken.models import Token
                token_obj, _ = Token.objects.get_or_create(user=user)

                # Send Hired Email with team & service context
                send_hired_onboarding_email(
                    email=obj.email,
                    name=obj.name,
                    role_applied=obj.role_applied,
                    employee_id=employee_id,
                    raw_password=raw_password,
                    magic_token=token_obj.key,
                    team_category=team_category,
                    assigned_services_list=assigned_services_list,
                )

                obj._admin_handled = True
                messages.success(request, f"Applicant {obj.name} accepted! Account created and routed to {team_category}.")

            except Exception as e:
                logger.exception(f"Failed to process accepted candidate for {obj.email}: {e}")
                messages.error(request, f"Error: Failed to process application - {str(e)}")

            finally:
                CareerApplication.objects.filter(id=obj.id).update(send_hired_email=False)


    def delete_model(self, request, obj):
        """Hard delete single CareerApplication record and cleanup linked User & TeamMember records cleanly."""
        try:
            email = str(getattr(obj, 'email', '') or '').strip()

            # Execute standard Django Admin deletion
            super().delete_model(request, obj)

            # Safely clean up associated records without crashing post-delete response
            if email:
                try:
                    User.objects.filter(email__iexact=email).exclude(id=request.user.id).delete()
                except Exception as u_err:
                    logger.warning(f"Could not cleanup User for email '{email}': {u_err}")
                try:
                    TeamMember.objects.filter(email__iexact=email).delete()
                except Exception as tm_err:
                    logger.warning(f"Could not cleanup TeamMember for email '{email}': {tm_err}")
        except Exception as e:
            logger.exception(f"Error during CareerApplication deletion: {e}")
            messages.error(request, f"Deletion completed with cleanup warning: {str(e)}")

    def delete_queryset(self, request, queryset):
        """Hard delete selected CareerApplication records and cleanup linked User & TeamMember records cleanly."""
        try:
            emails = []
            for item in queryset:
                em = str(getattr(item, 'email', '') or '').strip()
                if em:
                    emails.append(em)

            # Execute standard Django Admin bulk deletion
            super().delete_queryset(request, queryset)

            for email in emails:
                if email:
                    try:
                        User.objects.filter(email__iexact=email).exclude(id=request.user.id).delete()
                    except Exception as u_err:
                        logger.warning(f"Could not cleanup User for email '{email}': {u_err}")
                    try:
                        TeamMember.objects.filter(email__iexact=email).delete()
                    except Exception as tm_err:
                        logger.warning(f"Could not cleanup TeamMember for email '{email}': {tm_err}")
        except Exception as e:
            logger.exception(f"Error during CareerApplication bulk deletion: {e}")
            messages.error(request, f"Bulk deletion completed with cleanup warning: {str(e)}")



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
    """
    Manage B2B Agency Partner Applications.

    When an application status is changed to "Accepted":
    1. Automatically creates a Django User account if none exists.
    2. Assigns the user an Agency Partner profile (is_agency_partner=True).
    3. Generates a DRF Auth Token.
    4. Routes the applicant to FreelanceTeam (crm.TeamMember).
    5. Sends a Welcome Email with login details and portal URL.
    """
    list_display  = ['company_name', 'contact_person', 'email', 'whatsapp_number', 'core_services', 'team_size', 'status_badge', 'created_at']
    list_filter   = ['status', 'core_services', 'team_size', 'state', 'created_at']
    search_fields = ['company_name', 'contact_person', 'email', 'whatsapp_number', 'state', 'district', 'town', 'proposal']
    ordering      = ['-created_at']
    readonly_fields = ['created_at']

    def delete_model(self, request, obj):
        """Hard delete single AgencyPartnerLead record and cleanup linked User & TeamMember records cleanly."""
        try:
            email = str(getattr(obj, 'email', '') or '').strip()

            super().delete_model(request, obj)

            if email:
                try:
                    User.objects.filter(email__iexact=email).exclude(id=request.user.id).delete()
                except Exception as u_err:
                    logger.warning(f"Could not cleanup User for email '{email}': {u_err}")
                try:
                    TeamMember.objects.filter(email__iexact=email).delete()
                except Exception as tm_err:
                    logger.warning(f"Could not cleanup TeamMember for email '{email}': {tm_err}")
        except Exception as e:
            logger.exception(f"Error during AgencyPartnerLead deletion: {e}")
            messages.error(request, f"Deletion completed with cleanup warning: {str(e)}")

    def delete_queryset(self, request, queryset):
        """Hard delete selected AgencyPartnerLead records and cleanup linked User & TeamMember records cleanly."""
        try:
            emails = []
            for item in queryset:
                em = str(getattr(item, 'email', '') or '').strip()
                if em:
                    emails.append(em)

            super().delete_queryset(request, queryset)

            for email in emails:
                if email:
                    try:
                        User.objects.filter(email__iexact=email).exclude(id=request.user.id).delete()
                    except Exception as u_err:
                        logger.warning(f"Could not cleanup User for email '{email}': {u_err}")
                    try:
                        TeamMember.objects.filter(email__iexact=email).delete()
                    except Exception as tm_err:
                        logger.warning(f"Could not cleanup TeamMember for email '{email}': {tm_err}")
        except Exception as e:
            logger.exception(f"Error during AgencyPartnerLead bulk deletion: {e}")
            messages.error(request, f"Bulk deletion completed with cleanup warning: {str(e)}")


    @admin.display(description='Status')
    def status_badge(self, obj):
        colors = {
            'Pending':  ('#f59e0b', '#fffbeb'),
            'Accepted': ('#10b981', '#ecfdf5'),
            'Rejected': ('#ef4444', '#fef2f2'),
        }
        fg, bg = colors.get(obj.status, ('#374151', '#f9fafb'))
        return format_html(
            '<span style="color:{};background:{};padding:3px 10px;border-radius:12px;font-weight:600;font-size:12px;">{}</span>',
            fg, bg, obj.status
        )

    def save_model(self, request, obj, form, change):
        is_new_approval = False
        if change:
            old_obj = AgencyPartnerLead.objects.filter(pk=obj.pk).first()
            if old_obj and old_obj.status != 'Accepted' and obj.status == 'Accepted':
                is_new_approval = True
        elif obj.status == 'Accepted':
            is_new_approval = True

        super().save_model(request, obj, form, change)

        if is_new_approval:
            self._handle_agency_partner_approval(obj, request)

    def _handle_agency_partner_approval(self, application, request=None):
        from crm.models import TeamMember
        email = application.email.strip().lower()
        contact_person = application.contact_person.strip()
        names = contact_person.split(' ', 1)
        first_name = names[0]
        last_name = names[1] if len(names) > 1 else ''

        user = User.objects.filter(email__iexact=email).first()
        raw_password = None

        if not user:
            alphabet = string.ascii_letters + string.digits
            raw_password = ''.join(secrets.choice(alphabet) for _ in range(10))
            username = email.split('@')[0][:30]
            base_username = username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1

            user = User.objects.create_user(
                username=username,
                email=email,
                password=raw_password,
                first_name=first_name,
                last_name=last_name,
                is_staff=True,
            )
        else:
            raw_password = "[Your existing password]"

        profile, _ = UserProfile.objects.get_or_create(
            user=user,
            defaults={
                'employee_id': f"AP-{user.id:04d}",
                'role': f"Agency Partner ({application.company_name})",
                'department': 'Agency Partnerships',
                'is_agency_partner': True,
                'can_view_finance': False,
                'can_view_all_projects': False,
            }
        )
        if not profile.is_agency_partner:
            profile.is_agency_partner = True
            profile.role = f"Agency Partner ({application.company_name})"
            profile.department = 'Agency Partnerships'
            profile.save()

        # ROUTE TO FREELANCE TEAM (crm.TeamMember)
        TeamMember.objects.update_or_create(
            email=email,
            defaults={
                'name': f"{contact_person} ({application.company_name})",
                'role': 'Agency Partner',
                'is_freelancer': True,
                'standard_charge': 0.00,
                'average_rating': 5.0,
                'total_tasks_completed': 0,
            }
        )

        # Ensure DRF Token exists
        from rest_framework.authtoken.models import Token
        Token.objects.get_or_create(user=user)

        # Dispatch Welcome Email
        login_url = "https://urbanixsolution.online/agency-portal"
        subject = "Welcome to Urbanix Agency Partner Network! 🤝🚀"
        message = (
            f"Hello {contact_person},\n\n"
            f"Congratulations! Your application for {application.company_name} to join the Urbanix Agency Partner Network has been ACCEPTED.\n\n"
            f"Here are your login credentials to access your Agency Partner Dashboard:\n"
            f"--------------------------------------------------\n"
            f"Portal Login URL: {login_url}\n"
            f"Username: {user.username}\n"
            f"Email: {email}\n"
            f"Password: {raw_password}\n"
            f"Partner ID: AP-{user.id:04d}\n"
            f"--------------------------------------------------\n\n"
            f"You can now log in to manage partner leads, track deliverables, and view active project pipelines.\n\n"
            f"Best Regards,\n"
            f"The Urbanix Solution Team\n"
            f"https://urbanixsolution.online"
        )

        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@urbanixsolution.online'),
                recipient_list=[email],
                fail_silently=True,
            )
            if request:
                messages.success(request, f"Agency Partner approved! Account '{user.username}' created and credentials emailed to {email}.")
        except Exception as e:
            logger.exception(f"Failed to dispatch Agency Partner welcome email to {email}: {e}")





@admin.register(CallbackRequest)
class CallbackRequestAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'phone_number', 'state', 'district', 'town', 'is_completed', 'created_at']
    list_filter = ['is_completed', 'state', 'created_at']
    list_editable = ['is_completed']
    search_fields = ['full_name', 'phone_number', 'state', 'district', 'town']
    ordering = ['-created_at']
    readonly_fields = ['created_at']


# ===========================================================================
# Agency CRM Portal — Assigned Work Admin
# ===========================================================================

class AssignedTaskInline(admin.TabularInline):
    """
    Inline editor for tasks — add tasks directly inside an Assigned Project page.
    """
    model = AssignedTask
    extra = 1
    fields = ['assigned_to', 'title', 'priority', 'status', 'due_date', 'estimated_hours']
    autocomplete_fields = ['assigned_to']
    show_change_link = True
    verbose_name = 'Task'
    verbose_name_plural = 'Tasks for this Project'


@admin.register(AssignedProject)
class AssignedProjectAdmin(admin.ModelAdmin):
    """
    Core Team uses this admin to assign client projects to team members.

    • Use the  assigned_to  field to select any active team member (User).
    • Add tasks inline at the bottom of the project form.
    • The team member will see this project (and its tasks) on their portal dashboard.
    """
    inlines = [AssignedTaskInline]

    list_display  = ['title', 'assigned_to_display', 'status_badge', 'priority', 'progress_percent', 'deadline', 'client_name', 'payout_est_display', 'created_at']
    list_filter   = ['status', 'priority', 'assigned_to']
    search_fields = ['title', 'client_name', 'category', 'assigned_to__username', 'assigned_to__first_name', 'assigned_to__last_name', 'assigned_to__email']
    ordering      = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    autocomplete_fields = ['assigned_to']

    fieldsets = (
        ('Assignment', {
            'description': 'Select which team member this project belongs to.',
            'fields': ('assigned_to',),
        }),
        ('Project Details', {
            'fields': ('title', 'client_name', 'category', 'deliverable_type', 'team_members'),
        }),
        ('Status & Progress', {
            'fields': ('status', 'priority', 'progress_percent', 'deadline'),
        }),
        ('Finance', {
            'description': 'Payout estimate is only shown to users with financial access.',
            'fields': ('payout_est',),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    @admin.display(description='Assigned To')
    def assigned_to_display(self, obj):
        full_name = obj.assigned_to.get_full_name()
        return full_name or obj.assigned_to.username

    @admin.display(description='Status')
    def status_badge(self, obj):
        colors = {
            'In Progress':  ('#06b6d4', '#ecfeff'),
            'Under Review': ('#f59e0b', '#fffbeb'),
            'Completed':    ('#10b981', '#ecfdf5'),
            'Upcoming':     ('#6366f1', '#eef2ff'),
            'On Hold':      ('#6b7280', '#f9fafb'),
        }
        fg, bg = colors.get(obj.status, ('#374151', '#f9fafb'))
        return format_html(
            '<span style="color:{};background:{};padding:3px 10px;border-radius:12px;font-weight:600;font-size:12px;">{}</span>',
            fg, bg, obj.status
        )

    @admin.display(description='Est. Payout (₹)')
    def payout_est_display(self, obj):
        return f'₹{obj.payout_est:,}' if obj.payout_est else '—'


@admin.register(AssignedTask)
class AssignedTaskAdmin(admin.ModelAdmin):
    """
    Manage individual tasks assigned to team members.
    Tasks can also be created inline inside the Assigned Project admin above.
    """
    list_display  = ['title_short', 'assigned_to_display', 'project_link', 'priority_badge', 'status_badge', 'due_date', 'estimated_hours', 'created_at']
    list_filter   = ['status', 'priority', 'assigned_to']
    search_fields = ['title', 'assigned_to__username', 'assigned_to__first_name', 'assigned_to__last_name', 'project__title']
    ordering      = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    autocomplete_fields = ['assigned_to', 'project']

    fieldsets = (
        ('Assignment', {
            'description': 'Select which team member owns this task and its parent project.',
            'fields': ('assigned_to', 'project'),
        }),
        ('Task Details', {
            'fields': ('title', 'priority', 'status', 'due_date', 'estimated_hours'),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    @admin.display(description='Task')
    def title_short(self, obj):
        return obj.title[:60] + ('…' if len(obj.title) > 60 else '')

    @admin.display(description='Assigned To')
    def assigned_to_display(self, obj):
        full_name = obj.assigned_to.get_full_name()
        return full_name or obj.assigned_to.username

    @admin.display(description='Project')
    def project_link(self, obj):
        if obj.project:
            url = f'/admin/api/assignedproject/{obj.project_id}/change/'
            return format_html('<a href="{}">{}</a>', url, obj.project.title[:40])
        return '—'

    @admin.display(description='Priority')
    def priority_badge(self, obj):
        colors = {
            'Urgent': ('#ef4444', '#fef2f2'),
            'High':   ('#f97316', '#fff7ed'),
            'Medium': ('#eab308', '#fefce8'),
            'Normal': ('#6b7280', '#f9fafb'),
        }
        fg, bg = colors.get(obj.priority, ('#374151', '#f9fafb'))
        return format_html(
            '<span style="color:{};background:{};padding:2px 8px;border-radius:10px;font-weight:600;font-size:11px;">{}</span>',
            fg, bg, obj.priority
        )

    @admin.display(description='Status')
    def status_badge(self, obj):
        labels = {'todo': 'To Do', 'in_progress': 'In Progress', 'in_review': 'In Review', 'done': 'Done'}
        colors = {
            'todo':        ('#6b7280', '#f9fafb'),
            'in_progress': ('#06b6d4', '#ecfeff'),
            'in_review':   ('#8b5cf6', '#f5f3ff'),
            'done':        ('#10b981', '#ecfdf5'),
        }
        fg, bg = colors.get(obj.status, ('#374151', '#f9fafb'))
        return format_html(
            '<span style="color:{};background:{};padding:2px 8px;border-radius:10px;font-weight:600;font-size:11px;">{}</span>',
            fg, bg, labels.get(obj.status, obj.status)
        )


@admin.register(AssignedPayout)
class AssignedPayoutAdmin(admin.ModelAdmin):
    """
    Manage payout records for team members.
    These are only visible on the portal to users with can_view_finance=True.
    """
    list_display  = ['invoice_no', 'assigned_to_display', 'month', 'base_amount_display', 'bonus_amount_display', 'total_amount_display', 'status_badge', 'due_date', 'paid_date']
    list_filter   = ['status', 'assigned_to']
    search_fields = ['invoice_no', 'month', 'project_title', 'assigned_to__username', 'assigned_to__first_name', 'assigned_to__last_name']
    ordering      = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    autocomplete_fields = ['assigned_to']

    fieldsets = (
        ('Assignment', {
            'description': 'Select which team member this payout record belongs to.',
            'fields': ('assigned_to',),
        }),
        ('Payout Details', {
            'fields': ('invoice_no', 'month', 'project_title'),
        }),
        ('Amounts (INR)', {
            'description': 'Total is auto-calculated as base + bonus if left at 0.',
            'fields': ('base_amount', 'bonus_amount', 'total_amount'),
        }),
        ('Status & Dates', {
            'fields': ('status', 'due_date', 'paid_date'),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    @admin.display(description='Assigned To')
    def assigned_to_display(self, obj):
        full_name = obj.assigned_to.get_full_name()
        return full_name or obj.assigned_to.username

    @admin.display(description='Base (₹)')
    def base_amount_display(self, obj):
        return f'₹{obj.base_amount:,}'

    @admin.display(description='Bonus (₹)')
    def bonus_amount_display(self, obj):
        return f'₹{obj.bonus_amount:,}'

    @admin.display(description='Total (₹)')
    def total_amount_display(self, obj):
        return format_html('<strong>₹{}</strong>', f'{obj.total_amount:,}')

    @admin.display(description='Status')
    def status_badge(self, obj):
        colors = {
            'Pending Approval': ('#f59e0b', '#fffbeb'),
            'Processing':       ('#06b6d4', '#ecfeff'),
            'Paid':             ('#10b981', '#ecfdf5'),
            'On Hold':          ('#6b7280', '#f9fafb'),
        }
        fg, bg = colors.get(obj.status, ('#374151', '#f9fafb'))
        return format_html(
            '<span style="color:{};background:{};padding:3px 10px;border-radius:12px;font-weight:600;font-size:12px;">{}</span>',
            fg, bg, obj.status
        )


# ===========================================================================
# Call Partner Program Admin
# ===========================================================================

import secrets
import string
from django.core.mail import send_mail


@admin.register(CallPartnerApplication)
class CallPartnerApplicationAdmin(admin.ModelAdmin):
    """
    Manage applications for the Call Partner Program.

    When an application status is changed to "Accepted":
    1. Automatically creates a Django User account if none exists.
    2. Assigns the user a Call Partner profile (is_call_partner=True).
    3. Sends a Welcome Email with login details and the PARTNER_KIT_URL placeholder.
    """
    list_display  = ['full_name', 'email', 'whatsapp_number', 'status_badge', 'created_at']
    list_filter   = ['status', 'created_at']
    search_fields = ['full_name', 'email', 'whatsapp_number']
    ordering      = ['-created_at']
    readonly_fields = ['created_at']

    def delete_model(self, request, obj):
        """Hard delete single CallPartnerApplication record and cleanup linked User & TeamMember records cleanly."""
        try:
            email = str(getattr(obj, 'email', '') or '').strip()

            super().delete_model(request, obj)

            if email:
                try:
                    User.objects.filter(email__iexact=email).exclude(id=request.user.id).delete()
                except Exception as u_err:
                    logger.warning(f"Could not cleanup User for email '{email}': {u_err}")
                try:
                    TeamMember.objects.filter(email__iexact=email).delete()
                except Exception as tm_err:
                    logger.warning(f"Could not cleanup TeamMember for email '{email}': {tm_err}")
        except Exception as e:
            logger.exception(f"Error during CallPartnerApplication deletion: {e}")
            messages.error(request, f"Deletion completed with cleanup warning: {str(e)}")

    def delete_queryset(self, request, queryset):
        """Hard delete selected CallPartnerApplication records and cleanup linked User & TeamMember records cleanly."""
        try:
            emails = []
            for item in queryset:
                em = str(getattr(item, 'email', '') or '').strip()
                if em:
                    emails.append(em)

            super().delete_queryset(request, queryset)

            for email in emails:
                if email:
                    try:
                        User.objects.filter(email__iexact=email).exclude(id=request.user.id).delete()
                    except Exception as u_err:
                        logger.warning(f"Could not cleanup User for email '{email}': {u_err}")
                    try:
                        TeamMember.objects.filter(email__iexact=email).delete()
                    except Exception as tm_err:
                        logger.warning(f"Could not cleanup TeamMember for email '{email}': {tm_err}")
        except Exception as e:
            logger.exception(f"Error during CallPartnerApplication bulk deletion: {e}")
            messages.error(request, f"Bulk deletion completed with cleanup warning: {str(e)}")




    @admin.display(description='Status')
    def status_badge(self, obj):
        colors = {
            'Pending':  ('#f59e0b', '#fffbeb'),
            'Accepted': ('#10b981', '#ecfdf5'),
            'Rejected': ('#ef4444', '#fef2f2'),
        }
        fg, bg = colors.get(obj.status, ('#374151', '#f9fafb'))
        return format_html(
            '<span style="color:{};background:{};padding:3px 10px;border-radius:12px;font-weight:600;font-size:12px;">{}</span>',
            fg, bg, obj.status
        )

    def save_model(self, request, obj, form, change):
        is_new_approval = False
        if change:
            old_obj = CallPartnerApplication.objects.filter(pk=obj.pk).first()
            if old_obj and old_obj.status != 'Accepted' and obj.status == 'Accepted':
                is_new_approval = True
        elif obj.status == 'Accepted':
            is_new_approval = True

        super().save_model(request, obj, form, change)

        if is_new_approval:
            self._handle_partner_approval(obj)

    def _handle_partner_approval(self, application):
        email = application.email.strip().lower()
        full_name = application.full_name.strip()
        names = full_name.split(' ', 1)
        first_name = names[0]
        last_name = names[1] if len(names) > 1 else ''

        user = User.objects.filter(email__iexact=email).first()
        raw_password = None

        if not user:
            alphabet = string.ascii_letters + string.digits
            raw_password = ''.join(secrets.choice(alphabet) for _ in range(10))
            username = email.split('@')[0][:30]
            base_username = username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1

            user = User.objects.create_user(
                username=username,
                email=email,
                password=raw_password,
                first_name=first_name,
                last_name=last_name,
            )
        else:
            raw_password = "[Your existing password]"

        profile, _ = UserProfile.objects.get_or_create(
            user=user,
            defaults={
                'employee_id': f"CP-{user.id:04d}",
                'role': 'Call Partner',
                'department': 'Growth & Referrals',
                'is_call_partner': True,
                'can_view_finance': False,
                'can_view_all_projects': False,
            }
        )
        if not profile.is_call_partner:
            profile.is_call_partner = True
            profile.role = 'Call Partner'
            profile.department = 'Growth & Referrals'
            profile.save()

        # ROUTE TO FREELANCE TEAM (crm.TeamMember)
        from crm.models import TeamMember
        TeamMember.objects.update_or_create(
            email=email,
            defaults={
                'name': full_name,
                'role': 'Student / Call Partner',
                'is_freelancer': True,
                'standard_charge': 0.00,
                'average_rating': 5.0,
                'total_tasks_completed': 0,
            }
        )

        # Ensure DRF Token exists
        from rest_framework.authtoken.models import Token
        Token.objects.get_or_create(user=user)


        # Dispatch Welcome Email
        PARTNER_KIT_URL = "TODO: Add PDF link here later"
        login_url = "https://urbanixsolution.online/agency-portal"

        subject = "Welcome to Urbanix Call Partner Program! 🚀"
        message = (
            f"Hello {full_name},\n\n"
            f"Congratulations! Your application for the Urbanix Call Partner Program has been ACCEPTED.\n\n"
            f"Here are your login details to access your Call Partner Dashboard:\n"
            f"--------------------------------------------------\n"
            f"Portal URL: {login_url}\n"
            f"Username  : {user.username} (or Email: {email})\n"
            f"Password  : {raw_password}\n"
            f"--------------------------------------------------\n\n"
            f"Partner Kit & Commission Guidelines PDF:\n"
            f"{PARTNER_KIT_URL}\n\n"
            f"Start submitting client leads today to earn flat commissions on every closed project!\n\n"
            f"Best regards,\n"
            f"Core Team — Urbanix Solutions"
        )

        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@urbanixsolution.online'),
                recipient_list=[email],
                fail_silently=False,
            )
            logger.info(f"[CALL PARTNER APPROVED] Welcome email sent to {email}")
            print(f"[CALL PARTNER APPROVED] Welcome email sent to {email}")
        except Exception as e:
            logger.error(f"[CALL PARTNER EMAIL ERROR] Failed to send email to {email}: {e}")
            print(f"[CALL PARTNER EMAIL ERROR] Failed to send email to {email}: {e}")


@admin.register(ClientLead)
class ClientLeadAdmin(admin.ModelAdmin):
    """
    Manage client leads submitted by Call Partners.
    """
    list_display  = ['client_name', 'partner_display', 'project_type', 'discussed_price', 'status_badge', 'client_phone', 'created_at']
    list_filter   = ['status', 'project_type', 'created_at']
    search_fields = ['client_name', 'client_phone', 'partner__username', 'partner__email', 'partner__first_name', 'partner__last_name']
    ordering      = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    autocomplete_fields = ['partner']


    @admin.display(description='Referred By (Partner)')
    def partner_display(self, obj):
        return f"{obj.partner.get_full_name() or obj.partner.username} ({obj.partner.email})"

    @admin.display(description='Status')
    def status_badge(self, obj):
        colors = {
            'Under Review':                 ('#f59e0b', '#fffbeb'),
            'Approved':                     ('#06b6d4', '#ecfeff'),
            'Payment Processed - 48 Hours': ('#10b981', '#ecfdf5'),
            'Rejected':                     ('#ef4444', '#fef2f2'),
        }
        fg, bg = colors.get(obj.status, ('#374151', '#f9fafb'))
        return format_html(
            '<span style="color:{};background:{};padding:3px 10px;border-radius:12px;font-weight:600;font-size:12px;">{}</span>',
            fg, bg, obj.status
        )




