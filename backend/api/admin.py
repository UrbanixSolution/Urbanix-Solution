"""
Admin configuration for the API app.

Includes Lead Conversion Pipeline actions that promote records from the
raw api inbox into the CRM app (crm.Client and crm.TeamMember).
"""

from django.contrib import admin
from django.utils.html import format_html

from .models import (
    Service,
    Category,
    PortfolioProject,
    ContactLead,
    CareerApplication,
    WebsiteFeedback,
    PricingTier,
    AgencyPartnerLead,
)


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


def approve_and_hire(modeladmin, request, queryset):
    """
    Admin Action: Hire selected CareerApplications as crm.TeamMember records.

    For each selected application that has NOT already been converted:
      - Creates a crm.TeamMember using the applicant's name and role.
      - Sets standard_charge to 0.00 as a sensible placeholder (edit later).
      - Marks the original api.CareerApplication as is_converted = True.

    Already-converted applications are silently skipped (idempotent).
    """
    from crm.models import TeamMember

    hired_count = 0
    skipped_count = 0

    for application in queryset:
        if application.is_converted:
            skipped_count += 1
            continue

        TeamMember.objects.get_or_create(
            # Avoid creating duplicate team members for the same person.
            name=application.name,
            defaults={
                'role': application.role_applied,
                'is_freelancer': True,     # safe default — can be changed in CRM
                'standard_charge': 0.00,  # placeholder — update in CRM after hiring
                'average_rating': 0.0,
                'total_tasks_completed': 0,
            },
        )

        application.is_converted = True
        application.save(update_fields=['is_converted'])
        hired_count += 1

    parts = []
    if hired_count:
        parts.append(f"{hired_count} applicant(s) hired as CRM Team Members")
    if skipped_count:
        parts.append(f"{skipped_count} already-hired applicant(s) skipped")

    modeladmin.message_user(request, " | ".join(parts) if parts else "Nothing to process.")


approve_and_hire.short_description = "Hire selected applicants -> CRM Team Members"


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
# Career Application Admin
# ---------------------------------------------------------------------------

@admin.register(CareerApplication)
class CareerApplicationAdmin(admin.ModelAdmin):
    """Raw job applications from the website. Use the action to hire into the CRM."""

    actions = [approve_and_hire]

    list_display  = ['name', 'email', 'phone', 'role_applied', 'state', 'district', 'hire_badge', 'created_at']
    list_filter   = ['is_converted', 'state', 'role_applied', 'created_at']
    search_fields = ['name', 'email', 'phone', 'role_applied', 'state', 'district', 'cover_letter']
    ordering      = ['-created_at']
    readonly_fields = ['created_at', 'is_converted']

    fieldsets = (
        ('Applicant Details', {
            'fields': ('name', 'email', 'phone'),
        }),
        ('Application', {
            'fields': ('role_applied', 'state', 'district', 'portfolio_link', 'cover_letter', 'created_at'),
        }),
        ('CRM Pipeline Status', {
            'fields': ('is_converted',),
            'description': 'Use the "Hire selected applicants -> CRM Team Members" action to promote this record.',
        }),
    )

    @admin.display(description='Hire Status', boolean=False)
    def hire_badge(self, obj):
        if obj.is_converted:
            return format_html('<span style="color:#007bff;font-weight:bold;">Hired</span>')
        return format_html('<span style="color:#6c757d;">Pending Review</span>')


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
    list_display = ['company_name', 'contact_person', 'core_services', 'whatsapp_number', 'team_size', 'created_at']
    list_filter = ['core_services', 'team_size', 'created_at']
    search_fields = ['company_name', 'contact_person', 'email', 'whatsapp_number', 'proposal']
    ordering = ['-created_at']
    readonly_fields = ['created_at']
