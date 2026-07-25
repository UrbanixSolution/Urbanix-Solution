"""
portfolio/views.py
==================
DRF ViewSets for Service, ServiceTier, Category, and Project.

Endpoints (registered via router in urls.py)
--------------------------------------------
  /api/services/                   — list all active+inactive services (with nested tiers)
  /api/services/{slug}/            — retrieve by slug / update / delete
  /api/services/active/            — GET only active services (frontend listing use)

  /api/categories/                 — list / create categories
  /api/categories/{slug}/          — retrieve by slug (not PK)
  /api/categories/{slug}/projects/ — list projects in that category

  /api/projects/                   — list / create projects
  /api/projects/{slug}/            — retrieve / update / delete by slug
  /api/projects/featured/          — GET only featured projects (home page)
"""

from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Service, Category, Project
from .serializers import (
    ServiceSerializer,
    CategorySerializer,
    ProjectSerializer,
    ProjectListSerializer,
)


# ---------------------------------------------------------------------------
# Service ViewSet
# ---------------------------------------------------------------------------

class ServiceViewSet(viewsets.ModelViewSet):
    """
    CRUD for agency service cards — powers the /services/[slug] pages.
    Uses slug as the URL lookup field for clean, human-readable URLs.
    Nested tiers are included in every response via ServiceSerializer.
    """

    queryset         = Service.objects.prefetch_related('tiers').all()
    serializer_class = ServiceSerializer
    lookup_field     = 'slug'              # /api/services/web-development/ not /api/services/3/
    filter_backends  = [filters.SearchFilter, filters.OrderingFilter]
    search_fields    = ['title', 'short_description']
    ordering_fields  = ['order', 'title', 'created_at']

    @action(detail=False, methods=['get'], url_path='active')
    def active(self, request):
        """Return only published (is_active=True) services with their tiers."""
        qs         = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


# ---------------------------------------------------------------------------
# Category ViewSet
# ---------------------------------------------------------------------------

class CategoryViewSet(viewsets.ModelViewSet):
    """
    CRUD for portfolio categories.
    Uses slug as the URL lookup field instead of PK for clean URLs.
    """

    queryset         = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field     = 'slug'               # /api/categories/e-commerce/ not /api/categories/3/
    filter_backends  = [filters.SearchFilter]
    search_fields    = ['name', 'slug']

    @action(detail=True, methods=['get'], url_path='projects')
    def projects(self, request, slug=None):
        """
        Return all projects belonging to this category.
        GET /api/categories/{slug}/projects/
        """
        category   = self.get_object()
        qs         = category.projects.all()
        serializer = ProjectListSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)


# ---------------------------------------------------------------------------
# Project ViewSet
# ---------------------------------------------------------------------------

class ProjectViewSet(viewsets.ModelViewSet):
    """
    Full CRUD ViewSet for Portfolio Projects.
    Uses slug as the URL lookup field for clean, human-readable URLs.

    Actions
    -------
      GET  /api/projects/             — paginated list (lightweight serializer)
      POST /api/projects/             — create (pass category_id)
      GET  /api/projects/{slug}/      — full detail incl. content field
      PUT  /api/projects/{slug}/      — full update
      PATCH /api/projects/{slug}/     — partial update
      DELETE /api/projects/{slug}/    — delete
      GET  /api/projects/featured/    — home-page hero projects
    """

    queryset         = Project.objects.select_related('category').all()
    serializer_class = ProjectSerializer
    lookup_field     = 'slug'              # /api/projects/music-streaming-ui/ not /api/projects/1/
    filter_backends  = [filters.SearchFilter, filters.OrderingFilter]
    search_fields    = ['title', 'description', 'tech_stack', 'client_name',
                        'category__name']
    ordering_fields  = ['created_at', 'title', 'is_featured']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectSerializer

    @action(detail=False, methods=['get'], url_path='featured')
    def featured(self, request):
        """Return only featured projects ordered by newest first."""
        qs         = self.get_queryset().filter(is_featured=True)
        serializer = ProjectListSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='recent')
    def recent(self, request):
        """Return the most recent portfolio projects (default limit=4)."""
        limit = int(request.query_params.get('limit', 4))
        qs = self.get_queryset().order_by('-created_at')[:limit]
        serializer = ProjectListSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)
