"""
portfolio/admin.py
==================
Django Admin configuration for the CMS portfolio layer.

Registered models
-----------------
  ServiceTierInline — TabularInline inside ServiceAdmin (add tiers directly)
  ServiceAdmin      — slug auto-populate, inline tier editing
  CategoryAdmin     — auto-populates slug from name
  ProjectAdmin      — rich interface: list display, filters, search, fieldsets,
                       image preview, slug, content field, and inline tech-stack display
"""

from django.contrib import admin
from django.utils.html import format_html

from .models import Service, ServiceTier, Category, Project


# ---------------------------------------------------------------------------
# ServiceTier Inline
# ---------------------------------------------------------------------------

class ServiceTierInline(admin.TabularInline):
    """
    Inline editor for ServiceTier — appears directly inside the Service
    admin form so you can add/edit all tiers without leaving the parent page.
    """

    model           = ServiceTier
    extra           = 1                     # show one blank row by default
    min_num         = 0
    can_delete      = True
    show_change_link = False

    fields = [
        'tier_name',
        'price_string',
        'features',
        'delivery_time',
        'is_featured',
        'order',
    ]

    # JSONField in tabular inline needs a wider widget — use a textarea via
    # formfield_overrides or rely on the default JSON widget (Django 3.1+).


# ---------------------------------------------------------------------------
# Service Admin
# ---------------------------------------------------------------------------

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    """
    Admin for agency service offerings.
    ServiceTier rows are edited directly inline via the tabular inline.
    """

    inlines       = [ServiceTierInline]

    list_display  = ['title', 'slug', 'icon_name', 'order', 'is_active', 'tier_count', 'created_at']
    list_editable = ['order', 'is_active']
    list_filter   = ['is_active']
    search_fields = ['title', 'short_description', 'icon_name', 'slug']
    ordering      = ['order', 'title']
    readonly_fields = ['created_at']
    prepopulated_fields = {'slug': ('title',)}  # JS auto-fills slug as you type

    fieldsets = (
        ('Content', {
            'fields': ('title', 'slug', 'short_description', 'icon_name'),
        }),
        ('Display Options', {
            'fields': ('order', 'is_active'),
            'description': 'Control visibility and sort order on the Services page.',
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',),
        }),
    )

    @admin.display(description='# Tiers')
    def tier_count(self, obj: Service) -> int:
        """Show how many pricing tiers this service has."""
        return obj.tiers.count()


# ---------------------------------------------------------------------------
# Category Admin
# ---------------------------------------------------------------------------

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Admin for portfolio categories.
    `prepopulated_fields` auto-fills the slug as you type the name —
    the user can still override it manually before saving.
    """

    list_display        = ['name', 'slug', 'project_count', 'description']
    search_fields       = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}   # ← JS magic in the admin form

    @admin.display(description='# Projects')
    def project_count(self, obj: Category) -> int:
        """Show how many projects belong to this category."""
        return obj.projects.count()


# ---------------------------------------------------------------------------
# Project Admin
# ---------------------------------------------------------------------------

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    """
    Feature-rich admin for portfolio projects.

    Highlights
    ----------
    * list_display   — title, slug, category, tech_stack, featured flag, date
    * list_filter    — filter sidebar by category and featured status
    * search_fields  — full-text search across title and tech stack
    * image_preview  — renders a thumbnail inside the detail form
    * readonly_fields — timestamps auto-set; image_preview computed
    * fieldsets      — logically grouped form sections for easy editing
    * content        — full case-study body (Markdown) in its own section
    """

    # ── List view ──────────────────────────────────────────────────────────
    list_display   = [
        'title',
        'slug',
        'category',
        'client_name',
        'tech_stack_display',
        'is_featured',
        'created_at',
    ]
    list_filter    = ['category', 'is_featured']
    list_editable  = ['is_featured']
    search_fields  = ['title', 'slug', 'tech_stack', 'client_name', 'description']
    date_hierarchy = 'created_at'
    ordering       = ['-is_featured', '-created_at']
    prepopulated_fields = {'slug': ('title',)}

    # ── Detail view ────────────────────────────────────────────────────────
    readonly_fields = ['created_at', 'updated_at', 'image_preview', 'tech_list_preview']

    fieldsets = (
        ('Project Details', {
            'fields': (
                'title',
                'slug',
                'client_name',
                'category',
                'description',
                'is_featured',
            ),
        }),
        ('Case Study Content', {
            'fields': ('content',),
            'description': (
                'Full case-study body shown on the /work/[slug] detail page. '
                'Supports Markdown: ## headings, **bold**, - bullet lists, etc.'
            ),
        }),
        ('Technical Stack', {
            'fields': ('tech_stack', 'tech_list_preview'),
            'description': (
                'Enter comma-separated technologies '
                '(e.g. "Next.js, Django, PostgreSQL"). '
                'The preview below shows them as a parsed list.'
            ),
        }),
        ('Media & Links', {
            'fields': ('image', 'image_preview', 'image_url', 'live_url', 'github_url'),
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    # ── Custom list-view columns ───────────────────────────────────────────

    @admin.display(description='Tech Stack')
    def tech_stack_display(self, obj: Project) -> str:
        """Truncate long tech_stack strings in the list view."""
        return (obj.tech_stack[:60] + '…') if len(obj.tech_stack) > 60 else obj.tech_stack

    # ── Custom detail-view read-only fields ───────────────────────────────

    @admin.display(description='Image Preview')
    def image_preview(self, obj: Project):
        """Render a small thumbnail of the uploaded or linked image."""
        url = obj.get_image_url()
        if url:
            return format_html(
                '<img src="{}" style="max-height:180px; max-width:320px; '
                'border-radius:6px; border:1px solid #ddd;" />',
                url,
            )
        return '— no image —'

    @admin.display(description='Parsed Tech List')
    def tech_list_preview(self, obj: Project):
        """Render the comma-separated tech_stack as a clean bulleted list."""
        items = obj.get_tech_list()
        if not items:
            return '—'
        bullets = ''.join(f'<li>{item}</li>' for item in items)
        return format_html(
            '<ul style="margin:0; padding-left:18px;">{}</ul>',
            bullets,
        )
