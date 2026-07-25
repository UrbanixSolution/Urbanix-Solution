"""
portfolio/serializers.py
========================
DRF serializers for Service, ServiceTier, Category, and Project.

Serializer hierarchy
--------------------
  ServiceTierSerializer   — flat; embedded inside ServiceSerializer
  ServiceSerializer       — full detail incl. nested tiers list
  CategorySerializer      — used nested inside ProjectSerializer
  ProjectListSerializer   — lightweight; used for list view (no heavy fields)
  ProjectSerializer       — full detail; category nested, image resolved, content included
"""

from rest_framework import serializers
from .models import Service, ServiceTier, Category, Project


# ---------------------------------------------------------------------------
# ServiceTier
# ---------------------------------------------------------------------------

class ServiceTierSerializer(serializers.ModelSerializer):
    """Flat serializer — embedded as nested list inside ServiceSerializer."""

    class Meta:
        model  = ServiceTier
        fields = [
            'id',
            'tier_name',
            'price_string',
            'features',
            'delivery_time',
            'is_featured',
            'order',
        ]
        read_only_fields = ['id']


# ---------------------------------------------------------------------------
# Service
# ---------------------------------------------------------------------------

class ServiceSerializer(serializers.ModelSerializer):
    """
    Full detail serializer for agency service offerings.
    Includes all nested tiers so the frontend can render the pricing
    grid from a single API call to /api/services/{slug}/.
    """

    tiers = ServiceTierSerializer(many=True, read_only=True)

    class Meta:
        model  = Service
        fields = [
            'id',
            'title',
            'slug',
            'short_description',
            'icon_name',
            'order',
            'is_active',
            'created_at',
            'tiers',
        ]
        read_only_fields = ['id', 'created_at']


# ---------------------------------------------------------------------------
# Category
# ---------------------------------------------------------------------------

class CategorySerializer(serializers.ModelSerializer):
    """Flat serializer — also embedded inside ProjectSerializer."""

    project_count = serializers.SerializerMethodField()

    class Meta:
        model  = Category
        fields = ['id', 'name', 'slug', 'description', 'project_count']
        read_only_fields = ['id', 'project_count']

    def get_project_count(self, obj: Category) -> int:
        return obj.projects.count()


# ---------------------------------------------------------------------------
# Project
# ---------------------------------------------------------------------------

class ProjectListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for the /api/projects/ list view.
    Returns only the fields needed to render portfolio cards on the frontend.
    """

    category           = CategorySerializer(read_only=True)
    tech_list          = serializers.SerializerMethodField()
    image_url_resolved = serializers.SerializerMethodField()

    class Meta:
        model  = Project
        fields = [
            'id',
            'slug',
            'title',
            'client_name',
            'category',
            'tech_list',
            'image_url_resolved',
            'live_url',
            'is_featured',
        ]

    def get_tech_list(self, obj: Project) -> list[str]:
        return obj.get_tech_list()

    def get_image_url_resolved(self, obj: Project) -> str:
        request = self.context.get('request')
        url = obj.get_image_url()
        # Build absolute URL when serving uploaded files so the frontend
        # doesn't need to know the backend's base URL.
        if url and obj.image and request:
            return request.build_absolute_uri(url)
        return url


class ProjectSerializer(serializers.ModelSerializer):
    """
    Full detail serializer for /api/projects/{slug}/.
    Includes all fields plus computed helpers and full case-study content.
    """

    category           = CategorySerializer(read_only=True)
    category_id        = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        help_text='Pass the Category PK when creating/updating a project.',
    )
    tech_list          = serializers.SerializerMethodField()
    image_url_resolved = serializers.SerializerMethodField()

    class Meta:
        model  = Project
        fields = [
            'id',
            'slug',
            'title',
            'client_name',
            'description',
            'content',
            'category',
            'category_id',
            'tech_stack',
            'tech_list',
            'image',
            'image_url',
            'image_url_resolved',
            'live_url',
            'github_url',
            'is_featured',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'tech_list', 'image_url_resolved']

    def get_tech_list(self, obj: Project) -> list[str]:
        return obj.get_tech_list()

    def get_image_url_resolved(self, obj: Project) -> str:
        request = self.context.get('request')
        url = obj.get_image_url()
        if url and obj.image and request:
            return request.build_absolute_uri(url)
        return url
