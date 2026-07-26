"""
URL Configuration for Urbanix Solution backend.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


# ─── Admin Panel Branding ────────────────────────────────────────────────────
admin.site.site_header = 'Urbanix Solution Admin'
admin.site.site_title  = 'Urbanix Solution Portal'
admin.site.index_title = 'Welcome to the Urbanix Solution Control Room'


def health_check(request):
    """
    Root health-check endpoint.
    Returns a simple JSON response so Azure App Service health probes
    and browser visits to '/' get a 200 instead of a 404.
    """
    return JsonResponse({
        'status': 'ok',
        'service': 'Urbanix Solution API',
        'version': '1.0',
    })


urlpatterns = [
    # Health check — Azure App Service health probe + browser sanity check.
    path('', health_check, name='health-check'),

    # SECURITY: Admin URL is deliberately non-standard to defeat automated
    # scanner bots that probe /admin/ on every Django host they find.
    # Admin is at: /urbanix-secure-hq/
    path('urbanix-secure-hq/', admin.site.urls),

    # REST API routes
    path('api/', include('api.urls')),
    path('api/', include('portfolio.urls')),
    path('api/', include('leads.urls')),
]

# Always serve media files from MEDIA_ROOT during development & single-server setups
if settings.DEBUG or settings.MEDIA_ROOT:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
