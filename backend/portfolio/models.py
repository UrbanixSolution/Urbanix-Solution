"""
portfolio/models.py
====================
CMS-driven data layer for the Urbanix Solution portfolio.

Models
------
  Service     — agency service offerings (shown on the Services page)
  ServiceTier — pricing tiers / options nested under a Service
  Category    — reusable taxonomy for portfolio projects
  Project     — individual portfolio projects, FK → Category

Design decisions
----------------
  * slug on Service is unique — used for clean URL routing (/services/web-development/).
  * ServiceTier uses a JSONField for `features` so the admin can store a list of
    bullet-point strings; the API surfaces this as a native JSON array.
  * tech_stack stored as CSV string for simplicity; get_tech_list() surfaces
    it as a Python list so the API / templates never parse CSV themselves.
  * image uses ImageField so files land in MEDIA_ROOT/portfolio/; image_url
    (URLField) is kept as a fallback for externally-hosted images.
  * Slug on Category is unique — used for clean URL routing (/work/e-commerce/).
  * Slug on Project is unique — used for clean URL routing (/work/category/project/).
  * is_featured lets the team pin up to N projects on the home page without
    a separate model.
"""

from django.db import models
from django.utils.text import slugify


# ---------------------------------------------------------------------------
# Service
# ---------------------------------------------------------------------------

class Service(models.Model):
    """
    An agency service offering (e.g., "Web Development", "UI/UX Design").
    icon_name holds a Lucide icon identifier or Font Awesome class string
    so the frontend can render the correct icon dynamically.
    slug is auto-generated from title and used in clean URL paths.
    """

    title = models.CharField(
        max_length=200,
        help_text='Display title shown on the Services page.',
    )
    slug = models.SlugField(
        max_length=220,
        unique=True,
        blank=True,
        help_text='URL-safe identifier — auto-filled from title if left blank.',
    )
    short_description = models.TextField(
        help_text='One-to-two sentence summary shown in service cards.',
    )
    icon_name = models.CharField(
        max_length=100,
        blank=True,
        help_text=(
            'Icon identifier, e.g. "Globe", "Paintbrush2" (Lucide) '
            'or "fa-solid fa-code" (Font Awesome).'
        ),
    )
    order = models.PositiveSmallIntegerField(
        default=0,
        help_text='Lower numbers appear first. Drag-and-drop ordering via admin.',
    )
    is_active = models.BooleanField(
        default=True,
        help_text='Uncheck to hide this service without deleting it.',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'title']
        verbose_name = 'Service'
        verbose_name_plural = 'Services'

    def __str__(self) -> str:
        return self.title

    def save(self, *args, **kwargs):
        """Auto-generate slug from title when not explicitly provided."""
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


# ---------------------------------------------------------------------------
# ServiceTier
# ---------------------------------------------------------------------------

class ServiceTier(models.Model):
    """
    A pricing tier / engagement option within a Service.

    Examples
    --------
      Service: "Web Development"
        ├─ Tier: "Landing Page"  — Starts at $299
        ├─ Tier: "Small Business Website" — Starts at $499
        └─ Tier: "E-Commerce Store" — Starts at $999

    The `features` JSONField stores a list of strings:
      ["Responsive design", "SEO optimised", "3 revision rounds"]
    """

    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name='tiers',
        help_text='The parent service this tier belongs to.',
    )
    tier_name = models.CharField(
        max_length=200,
        help_text='Display name for this tier/option (e.g. "Small Business Website").',
    )
    price_string = models.CharField(
        max_length=100,
        help_text='Human-readable price label (e.g. "Starts at $499", "From £799/mo").',
    )
    features = models.JSONField(
        default=list,
        help_text=(
            'JSON array of feature bullet points shown on the pricing card. '
            'Example: ["Responsive design", "SEO optimised", "3 revisions"]'
        ),
    )
    delivery_time = models.CharField(
        max_length=100,
        blank=True,
        help_text='Estimated delivery time (e.g. "5–7 business days", "2–4 weeks").',
    )
    is_featured = models.BooleanField(
        default=False,
        help_text='Highlight this tier as the recommended / most popular option.',
    )
    order = models.IntegerField(
        default=0,
        help_text='Lower numbers appear first in the pricing grid.',
    )

    class Meta:
        ordering = ['order', 'tier_name']
        verbose_name = 'Service Tier'
        verbose_name_plural = 'Service Tiers'

    def __str__(self) -> str:
        return f'{self.service.title} — {self.tier_name}'


# ---------------------------------------------------------------------------
# Category
# ---------------------------------------------------------------------------

class Category(models.Model):
    """
    Taxonomy model for portfolio work (e.g., "E-Commerce", "EdTech", "SaaS").
    The slug is auto-generated from the name and is used in API filters
    and clean URL paths (e.g., /work/e-commerce/).
    """

    name = models.CharField(
        max_length=100,
        unique=True,
        help_text='Human-readable category label.',
    )
    slug = models.SlugField(
        max_length=110,
        unique=True,
        blank=True,
        help_text='URL-safe identifier — auto-filled from name if left blank.',
    )
    description = models.CharField(
        max_length=300,
        blank=True,
        help_text='Optional one-liner shown as a filter tooltip.',
    )

    class Meta:
        ordering = ['name']
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'  # ← overrides default "Categorys"

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs):
        """Auto-generate slug from name when not explicitly provided."""
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


# ---------------------------------------------------------------------------
# Project
# ---------------------------------------------------------------------------

class Project(models.Model):
    """
    A portfolio project — one card on the Work/Portfolio page.

    Relationships
    -------------
      category  FK → Category  (many projects belong to one category)

    Media strategy
    --------------
      Prefer `image` (uploaded file) for self-hosted media.
      Fall back to `image_url` for externally-hosted CDN assets.
      The serializer exposes `image_url_resolved` which returns whichever
      is available.

    Tech stack
    ----------
      Stored as a comma-separated string; use get_tech_list() in templates
      and serializers so callers never parse CSV themselves.

    Slug & content
    --------------
      slug is auto-generated from title and used in clean URL paths
      (/work/category/project-slug/).
      content holds the full case-study body (Markdown supported).
    """

    # ── Relationships ──────────────────────────────────────────────────────
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='projects',
        help_text='The taxonomy category this project belongs to.',
    )

    # ── Core fields ────────────────────────────────────────────────────────
    title = models.CharField(
        max_length=200,
        help_text='Project title shown on cards and the detail page.',
    )
    slug = models.SlugField(
        max_length=220,
        unique=True,
        blank=True,
        help_text='URL-safe identifier — auto-filled from title if left blank.',
    )
    client_name = models.CharField(
        max_length=200,
        blank=True,
        help_text='Client or company name — leave blank for internal projects.',
    )
    description = models.TextField(
        help_text='Short project description shown on portfolio cards (supports Markdown).',
    )
    content = models.TextField(
        blank=True,
        help_text=(
            'Full case-study body shown on the detail page. '
            'Supports Markdown. Include challenges, solutions, and outcomes.'
        ),
    )

    # ── Media & links ──────────────────────────────────────────────────────
    image = models.ImageField(
        upload_to='portfolio/',
        blank=True,
        null=True,
        help_text='Upload a project screenshot (preferred over image_url).',
    )
    image_url = models.URLField(
        max_length=500,
        blank=True,
        help_text='External image URL — used if no file is uploaded.',
    )
    live_url = models.URLField(
        max_length=500,
        blank=True,
        help_text='Public URL of the deployed project.',
    )
    github_url = models.URLField(
        max_length=500,
        blank=True,
        help_text='GitHub / source repository URL (optional).',
    )

    # ── Technical ──────────────────────────────────────────────────────────
    tech_stack = models.CharField(
        max_length=500,
        help_text='Comma-separated technologies, e.g. "React, Django, PostgreSQL".',
    )

    # ── Flags & ordering ───────────────────────────────────────────────────
    is_featured = models.BooleanField(
        default=False,
        help_text='Pin to the home-page hero / featured section.',
    )

    # ── Timestamps ─────────────────────────────────────────────────────────
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_featured', '-created_at']
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'

    def __str__(self) -> str:
        if self.client_name:
            return f'{self.title} — {self.client_name}'
        return self.title

    def save(self, *args, **kwargs):
        """Auto-generate slug from title when not explicitly provided."""
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    # ── Helper methods ─────────────────────────────────────────────────────

    def get_tech_list(self) -> list[str]:
        """Return tech_stack as a clean Python list (strips whitespace)."""
        return [t.strip() for t in self.tech_stack.split(',') if t.strip()]

    def get_image_url(self) -> str:
        """Return the best available image URL (uploaded file > external URL)."""
        if self.image:
            return self.image.url
        return self.image_url or ''
