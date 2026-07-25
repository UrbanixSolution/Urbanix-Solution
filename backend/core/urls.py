"""
URL Configuration for Urbanix Solution backend.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# ─── Admin Panel Branding ────────────────────────────────────────────────────
admin.site.site_header = 'Urbanix Solution Admin'
admin.site.site_title = 'Urbanix Solution Portal'
admin.site.index_title = 'Welcome to the Urbanix Solution Control Room'

urlpatterns = [
    # SECURITY: Admin URL is deliberately non-standard to defeat automated
    # scanner bots that probe /admin/ on every Django host they find.
    # Do NOT change this back to 'admin/' on production.
    path('urbanix-secure-hq/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/', include('portfolio.urls')),
    path('api/', include('leads.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
