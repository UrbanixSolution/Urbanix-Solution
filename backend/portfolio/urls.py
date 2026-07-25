"""portfolio/urls.py — API routing for Service, Category, and Project."""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ServiceViewSet, CategoryViewSet, ProjectViewSet

router = DefaultRouter()
router.register(r'services',   ServiceViewSet,  basename='service')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'projects',   ProjectViewSet,  basename='project')

urlpatterns = [
    path('', include(router.urls)),
]
