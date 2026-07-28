"""
Admin configuration for the Agency CRM & ERP.

Registers all CRM models with fully-featured ModelAdmin classes so the
agency owner gets a powerful, filterable, searchable Django admin dashboard.
"""

from django.contrib import admin
from django.utils.html import format_html

from .models import (
    TeamMember,
    Client,
    ProjectTask,
    ContactLead,
)


# ---------------------------------------------------------------------------
# Team Member Admin
# ---------------------------------------------------------------------------

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    """Admin view for agency team members and freelancers."""

    list_display = ('name', 'email', 'role', 'is_freelancer', 'send_update_email', 'standard_charge', 'average_rating', 'total_tasks_completed')
    list_editable = ('send_update_email',)
    list_filter  = ('is_freelancer', 'send_update_email', 'role')
    search_fields = ('name', 'email', 'role')
    ordering = ('name',)

    fieldsets = (
        ('Identity', {
            'fields': ('name', 'email', 'role', 'is_freelancer', 'send_update_email'),
        }),
        ('Financials & Performance', {
            'fields': ('standard_charge', 'average_rating', 'total_tasks_completed'),
            'description': 'Financial and performance metrics for this team member.',
        }),
    )


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



