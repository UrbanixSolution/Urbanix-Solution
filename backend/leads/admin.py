"""Admin registration for Leads app."""

from django.contrib import admin
from .models import Lead


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ['name', 'whatsapp_number', 'service_required', 'status', 'created_at']
    list_filter = ['service_required', 'status', 'created_at']
    search_fields = ['name', 'whatsapp_number', 'message']
    list_editable = ['status']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Contact Info', {
            'fields': ('name', 'whatsapp_number')
        }),
        ('Inquiry Details', {
            'fields': ('service_required', 'message')
        }),
        ('CRM Status', {
            'fields': ('status',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
