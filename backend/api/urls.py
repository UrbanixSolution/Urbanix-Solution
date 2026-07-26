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
)

router = DefaultRouter()
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'projects', PortfolioProjectViewSet, basename='project')

urlpatterns = [
    path('', include(router.urls)),
    path('captcha/', CaptchaGenerateView.as_view(), name='api-captcha'),
    path('contact/', ContactLeadCreateView.as_view(), name='api-contact'),
    path('callback/', CallbackRequestCreateView.as_view(), name='api-callback'),
    path('career/', CareerApplicationCreateView.as_view(), name='api-career'),
    path('agency-partner/', AgencyPartnerLeadCreateView.as_view(), name='api-agency-partner'),
    path('feedback/', WebsiteFeedbackCreateView.as_view(), name='api-feedback'),
]
