from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ServiceViewSet,
    CategoryViewSet,
    PortfolioProjectViewSet,
    ContactLeadCreateView,
    CareerApplicationCreateView,
    WebsiteFeedbackCreateView,
    CaptchaGenerateView,
    AgencyPartnerLeadCreateView,
    CallbackRequestCreateView,
    AgencyLoginView,
    MagicLoginView,
    DashboardDataView,
)

router = DefaultRouter()
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'projects', PortfolioProjectViewSet, basename='project')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', AgencyLoginView.as_view(), name='api-auth-login'),
    path('auth/magic-login/', MagicLoginView.as_view(), name='api-auth-magic-login'),
    path('dashboard-data/', DashboardDataView.as_view(), name='api-dashboard-data'),
    path('me/', DashboardDataView.as_view(), name='api-me'),
    path('captcha/', CaptchaGenerateView.as_view(), name='api-captcha'),
    path('contact/', ContactLeadCreateView.as_view(), name='api-contact'),
    path('callback/', CallbackRequestCreateView.as_view(), name='api-callback'),
    path('career/', CareerApplicationCreateView.as_view(), name='api-career'),
    path('agency-partner/', AgencyPartnerLeadCreateView.as_view(), name='api-agency-partner'),
    path('feedback/', WebsiteFeedbackCreateView.as_view(), name='api-feedback'),
]

