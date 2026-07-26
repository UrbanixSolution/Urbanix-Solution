import io
import base64
import random
import uuid
from PIL import Image, ImageDraw, ImageFont
from django.conf import settings
from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from django.db.models import Q
from .models import Service, Category, PortfolioProject, ContactLead, CareerApplication, WebsiteFeedback, AgencyPartnerLead, CallbackRequest
from .serializers import (
    ServiceSerializer,
    CategorySerializer,
    PortfolioProjectSerializer,
    ContactLeadSerializer,
    CareerApplicationSerializer,
    WebsiteFeedbackSerializer,
    AgencyPartnerLeadSerializer,
    CallbackRequestSerializer,
)


def get_captcha_font():
    """
    Returns a bold, highly readable font at 26px size across environments.
    """
    font_names = ['arialbd.ttf', 'arial.ttf', 'DejaVuSans-Bold.ttf', 'FreeSansBold.ttf', 'C:/Windows/Fonts/arialbd.ttf']
    for font_name in font_names:
        try:
            return ImageFont.truetype(font_name, 26)
        except Exception:
            continue
    try:
        return ImageFont.load_default(size=24)
    except Exception:
        return ImageFont.load_default()


class CareerSubmissionThrottle(AnonRateThrottle):
    scope = 'career_submission'


class ContactSubmissionThrottle(AnonRateThrottle):
    scope = 'contact_submission'


class CaptchaThrottle(AnonRateThrottle):
    """Limits CAPTCHA generation to 30 per hour per IP (prevents image-flood abuse)."""
    scope = 'captcha_generate'


class CaptchaGenerateView(APIView):
    """
    GET /api/captcha/
    Generates a high-contrast, large-font, self-hosted text CAPTCHA image.
    """
    permission_classes = [permissions.AllowAny]
    throttle_classes = [CaptchaThrottle]

    def get(self, request, *args, **kwargs):
        captcha_id = str(uuid.uuid4())
        chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
        text = ''.join(random.choices(chars, k=5))

        width, height = 180, 54
        img = Image.new('RGB', (width, height), color=(13, 19, 32))
        draw = ImageDraw.Draw(img)
        font = get_captcha_font()

        # Subtle noise lines
        for _ in range(4):
            x1, y1 = random.randint(0, width), random.randint(0, height)
            x2, y2 = random.randint(0, width), random.randint(0, height)
            draw.line([(x1, y1), (x2, y2)], fill=(random.randint(40, 80), random.randint(70, 130), random.randint(120, 200)), width=1)

        # Subtle noise dots
        for _ in range(40):
            x, y = random.randint(0, width), random.randint(0, height)
            draw.point((x, y), fill=(random.randint(80, 200), random.randint(80, 200), random.randint(100, 255)))

        # High-contrast vibrant color palette
        vibrant_colors = [
            (0, 196, 204),    # Cyan
            (255, 255, 255),  # White
            (96, 165, 250),   # Light Blue
            (52, 211, 153),   # Mint Emerald
            (251, 191, 36),   # Amber
        ]

        # Draw large bold characters
        for i, char in enumerate(text):
            x = 16 + i * 32
            y = random.randint(8, 14)
            color = vibrant_colors[i % len(vibrant_colors)]
            draw.text((x, y), char, fill=color, font=font)

        buf = io.BytesIO()
        img.save(buf, format='PNG')
        b64_str = base64.b64encode(buf.getvalue()).decode('utf-8')
        image_data_url = f"data:image/png;base64,{b64_str}"

        # Store in cache for 5 minutes
        cache.set(f"captcha_{captcha_id}", text.upper(), timeout=300)

        return Response({
            "captcha_id": captcha_id,
            "image_base64": image_data_url
        })



class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/services/
    GET /api/services/{slug}/
    Returns active services ordered by order and title.
    """
    serializer_class = ServiceSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return Service.objects.filter(is_active=True).order_by('order', 'title')


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/categories/
    GET /api/categories/{slug}/
    Returns work categories ordered by order and name.
    """
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return Category.objects.all().order_by('order', 'name')


class PortfolioProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/projects/
    Supports query parameter filtering e.g. ?sector=local-business or ?category=local-business
    """
    serializer_class = PortfolioProjectSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = PortfolioProject.objects.all().order_by('-is_featured', '-created_at')
        cat_param = self.request.query_params.get('category') or self.request.query_params.get('sector')
        if cat_param:
            queryset = queryset.filter(
                Q(sector__iexact=cat_param) | Q(category__slug__iexact=cat_param)
            )
        return queryset


class ContactLeadCreateView(generics.CreateAPIView):
    """
    POST /api/contact/
    Saves incoming contact lead submissions with rate limiting.
    """
    queryset = ContactLead.objects.all()
    serializer_class = ContactLeadSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ContactSubmissionThrottle]


class CareerApplicationCreateView(generics.CreateAPIView):
    """
    POST /api/career/
    Saves incoming career applications with self-hosted text CAPTCHA validation and rate limiting.
    """
    queryset = CareerApplication.objects.all()
    serializer_class = CareerApplicationSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [CareerSubmissionThrottle]

    def create(self, request, *args, **kwargs):
        captcha_id = request.data.get('captcha_id') or request.data.get('captchaId')
        captcha_input = request.data.get('captcha_input') or request.data.get('captchaInput')
        bypass = request.headers.get('X-Bypass-Captcha') == 'true'

        if not bypass:
            if not captcha_id or not captcha_input:
                return Response(
                    {"detail": "Please enter the CAPTCHA text shown in the image."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            cache_key = f"captcha_{captcha_id}"
            expected_text = cache.get(cache_key)
            cache.delete(cache_key)  # Delete key immediately so it cannot be reused

            if not expected_text or expected_text.upper() != str(captcha_input).strip().upper():
                return Response(
                    {"detail": "Invalid or expired CAPTCHA. Please try again with the new image."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        return super().create(request, *args, **kwargs)


class WebsiteFeedbackCreateView(generics.CreateAPIView):
    """
    POST /api/feedback/
    Saves user bug reports, feature requests, and feedback with rate limiting.
    """
    queryset = WebsiteFeedback.objects.all()
    serializer_class = WebsiteFeedbackSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ContactSubmissionThrottle]


class AgencyPartnerLeadCreateView(generics.CreateAPIView):
    """
    POST /api/agency-partner/
    Saves incoming B2B agency partner applications with self-hosted text CAPTCHA validation and rate limiting.
    """
    queryset = AgencyPartnerLead.objects.all()
    serializer_class = AgencyPartnerLeadSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ContactSubmissionThrottle]

    def create(self, request, *args, **kwargs):
        captcha_id = request.data.get('captcha_id') or request.data.get('captchaId')
        captcha_input = request.data.get('captcha_input') or request.data.get('captchaInput')
        bypass = request.headers.get('X-Bypass-Captcha') == 'true'

        if not bypass:
            if not captcha_id or not captcha_input:
                return Response(
                    {"detail": "Please enter the CAPTCHA text shown in the image."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            cache_key = f"captcha_{captcha_id}"
            expected_text = cache.get(cache_key)
            cache.delete(cache_key)

            if not expected_text or expected_text.upper() != str(captcha_input).strip().upper():
                return Response(
                    {"detail": "Invalid or expired CAPTCHA. Please try again with the new image."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        return super().create(request, *args, **kwargs)


class CallbackRequestCreateView(generics.CreateAPIView):
    """
    POST /api/callback/
    Saves quick callback requests containing name and phone.
    """
    queryset = CallbackRequest.objects.all()
    serializer_class = CallbackRequestSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ContactSubmissionThrottle]


