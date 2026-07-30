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
    CallPartnerApplicationApplyView,
    ClientLeadViewSet,
    UserProfileUpdateView,
)

router = DefaultRouter()
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'projects', PortfolioProjectViewSet, basename='project')
router.register(r'leads', ClientLeadViewSet, basename='lead')

urlpatterns = [
    path('auth/login/', AgencyLoginView.as_view(), name='api-auth-login'),
    path('auth/magic-login/', MagicLoginView.as_view(), name='api-auth-magic-login'),
    path('dashboard-data/', DashboardDataView.as_view(), name='api-dashboard-data'),
    path('me/', DashboardDataView.as_view(), name='api-me'),
    path('user/profile/', UserProfileUpdateView.as_view(), name='api-user-profile-update'),
    path('profile/', UserProfileUpdateView.as_view(), name='api-profile-update'),
    path('captcha/', CaptchaGenerateView.as_view(), name='api-captcha'),
    path('contact/', ContactLeadCreateView.as_view(), name='api-contact'),
    path('callback/', CallbackRequestCreateView.as_view(), name='api-callback'),
    path('career/', CareerApplicationCreateView.as_view(), name='api-career'),
    path('call-partner/apply/', CallPartnerApplicationApplyView.as_view(), name='api-call-partner-apply'),
    path('agency-partner/', AgencyPartnerLeadCreateView.as_view(), name='api-agency-partner'),
    path('feedback/', WebsiteFeedbackCreateView.as_view(), name='api-feedback'),
    path('', include(router.urls)),
]



