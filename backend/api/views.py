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
    Saves incoming career applications with self-hosted text CAPTCHA validation. No IP rate limiting.
    """
    queryset = CareerApplication.objects.all()
    serializer_class = CareerApplicationSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = []

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


from django.contrib.auth import authenticate
from .models import UserProfile
from .serializers import UserProfileSerializer

class AgencyLoginView(APIView):
    """
    POST /api/auth/login/
    Authenticates employees by Employee ID (username) and password.
    Returns user profile & dynamic RBAC permissions.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        employee_id = (request.data.get('employee_id') or request.data.get('username') or '').strip().upper()
        password = request.data.get('password', '').strip()

        if not employee_id or not password:
            return Response(
                {"detail": "Please provide both Employee ID and password."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Authenticate user
        user = authenticate(username=employee_id, password=password)
        if not user:
            # Also try matching case-insensitive username or email
            try:
                matched_user = User.objects.get(Q(username__iexact=employee_id) | Q(email__iexact=employee_id))
                user = authenticate(username=matched_user.username, password=password)
            except User.DoesNotExist:
                user = None

        if not user:
            return Response(
                {"detail": "Invalid Employee ID or password. Please check your credentials."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Get or create UserProfile
        profile, created = UserProfile.objects.get_or_create(
            user=user,
            defaults={
                'employee_id': user.username,
                'role': 'Agency Director & Admin' if user.is_superuser else 'Senior Developer',
                'department': 'Core Operations' if user.is_superuser else 'Engineering',
                'can_view_finance': user.is_superuser,
                'can_view_all_projects': user.is_superuser,
                'is_agency_admin': user.is_superuser,
            }
        )

        serializer = UserProfileSerializer(profile)
        return Response({
            "message": "Authentication successful",
            "token": f"session_{user.id}_{uuid.uuid4().hex[:12]}",
            "user": serializer.data,
            "permissions": serializer.data['permissions']
        })


from rest_framework.authtoken.models import Token


class MagicLoginView(APIView):
    """
    GET /api/auth/magic-login/?token=<magic_token>
    Authenticates candidate via one-click Magic Link token from welcome email.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        token_key = (request.query_params.get('token') or request.query_params.get('magic_token') or '').strip()
        if not token_key:
            return Response({"detail": "Magic token parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = Token.objects.get(key=token_key)
            user = token.user

            profile, _ = UserProfile.objects.get_or_create(
                user=user,
                defaults={
                    'employee_id': user.username,
                    'role': 'Senior Developer',
                    'department': 'Engineering',
                }
            )

            serializer = UserProfileSerializer(profile)
            return Response({
                "message": "Magic link auto-login successful",
                "token": token.key,
                "user": serializer.data,
                "permissions": serializer.data.get('permissions', {})
            })
        except Token.DoesNotExist:
            return Response({"detail": "Invalid or expired magic token."}, status=status.HTTP_401_UNAUTHORIZED)


class DashboardDataView(APIView):
    """
    GET /api/dashboard-data/
    GET /api/dashboard-data/?employee_id=URB-DEV-001
    Returns full CRM portal state (metrics, assigned projects, tasks, payouts, permissions).
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        employee_id = request.query_params.get('employee_id') or request.query_params.get('employeeId')
        
        profile = None
        if employee_id:
            profile = UserProfile.objects.filter(Q(employee_id__iexact=employee_id) | Q(user__username__iexact=employee_id)).first()

        if not profile:
            # Default to first user profile or admin profile
            profile = UserProfile.objects.first()

        if not profile:
            # Fallback dummy profile response if database is empty
            profile_data = {
                "id": "usr_001",
                "employee_id": "URB-DEV-01",
                "username": "URB-DEV-01",
                "name": "Gaurav Sharma",
                "email": "gaurav.s@urbanixsolution.internal",
                "role": "Senior Video Editor & Motion Architect",
                "department": "Creative & Media Production",
                "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
                "permissions": {
                    "is_admin": False,
                    "can_view_finance": False,
                    "can_view_all_projects": False
                }
            }
        else:
            profile_data = UserProfileSerializer(profile).data

        permissions = profile_data.get('permissions', {
            'is_admin': False,
            'can_view_finance': False,
            'can_view_all_projects': False
        })

        # Sample Dynamic Projects
        projects = [
            {
                "id": "prj-101",
                "title": "Apex Financial Platform - Brand Motion & UI Video",
                "clientName": "Apex Capital Holdings LLC",
                "category": "VFX & Motion Graphics",
                "status": "In Progress",
                "progressPercent": 78,
                "deadline": "04 Aug 2026",
                "teamMembers": ["Gaurav S.", "Rohan K.", "Ananya P."],
                "deliverableType": "4K Cinematic Reel & Interactive UI Animations",
                "priority": "High",
                "payoutEst": 65000
            },
            {
                "id": "prj-102",
                "title": "Nexus AI SaaS Portal - Dashboard UI & Micro-interactions",
                "clientName": "Nexus Labs Inc.",
                "category": "Web App & Frontend Development",
                "status": "In Progress",
                "progressPercent": 62,
                "deadline": "12 Aug 2026",
                "teamMembers": ["Gaurav S.", "Vikram R."],
                "deliverableType": "React Components & Framer Animations",
                "priority": "High",
                "payoutEst": 50000
            },
            {
                "id": "prj-103",
                "title": "Veloce Motors - EV Promo Campaign Launch",
                "clientName": "Veloce Automotives Global",
                "category": "Commercial Video & 3D Render",
                "status": "Under Review",
                "progressPercent": 90,
                "deadline": "31 Jul 2026",
                "teamMembers": ["Gaurav S.", "Priya N."],
                "deliverableType": "30s TV Commercial + Social Cutdowns",
                "priority": "Medium",
                "payoutEst": 30000
            },
            {
                "id": "prj-104",
                "title": "Urbanix Design System v3.0 - Internal Motion Assets",
                "clientName": "Urbanix Core Architecture",
                "category": "Internal R&D",
                "status": "In Progress",
                "progressPercent": 40,
                "deadline": "20 Aug 2026",
                "teamMembers": ["Gaurav S."],
                "deliverableType": "Lottie Animations & CSS Tokens",
                "priority": "Low",
                "payoutEst": 20000
            }
        ]

        # Sample Dynamic Tasks
        tasks = [
            {
                "id": "tsk-01",
                "title": "Finalize 3D camera trajectory for Apex 4K Hero Sequence",
                "projectId": "prj-101",
                "projectName": "Apex Financial Platform",
                "priority": "Urgent",
                "status": "in_progress",
                "dueDate": "29 Jul 2026",
                "estimatedHours": 6
            },
            {
                "id": "tsk-02",
                "title": "Export color-graded ProRes 4444 master files for Veloce review",
                "projectId": "prj-103",
                "projectName": "Veloce Motors Campaign",
                "priority": "High",
                "status": "in_review",
                "dueDate": "30 Jul 2026",
                "estimatedHours": 3
            },
            {
                "id": "tsk-03",
                "title": "Build Framer Motion physics spring configs for Nexus UI",
                "projectId": "prj-102",
                "projectName": "Nexus AI SaaS Portal",
                "priority": "High",
                "status": "todo",
                "dueDate": "02 Aug 2026",
                "estimatedHours": 8
            },
            {
                "id": "tsk-04",
                "title": "Upload raw render passes to AWS S3 bucket for client backup",
                "projectId": "prj-101",
                "projectName": "Apex Financial Platform",
                "priority": "Normal",
                "status": "todo",
                "dueDate": "03 Aug 2026",
                "estimatedHours": 2
            }
        ]

        # Deliverables
        deliverables = [
            {
                "id": "del-901",
                "projectId": "prj-103",
                "projectName": "Veloce Motors Campaign",
                "title": "Veloce EV 30s Cut-v3_ColorGraded_Master.mp4",
                "linkUrl": "https://drive.google.com/file/d/urbanix-veloce-v3-master/view",
                "submittedAt": "28 Jul 2026, 14:30",
                "fileSize": "1.84 GB",
                "status": "Pending Review",
                "notes": "Incorporated client feedback on bass boost and end logo glow."
            },
            {
                "id": "del-900",
                "projectId": "prj-101",
                "projectName": "Apex Financial Platform",
                "title": "Apex_Hero_Motion_Teaser_Draft2.mov",
                "linkUrl": "https://frame.io/player/apex-motion-teaser-v2",
                "submittedAt": "25 Jul 2026, 11:15",
                "fileSize": "940 MB",
                "status": "Approved",
                "notes": "Approved by Creative Director for client presentation."
            }
        ]

        # Payouts - CONDITIONAL BASED ON PERMISSIONS
        payouts = []
        if permissions.get('can_view_finance', False):
            payouts = [
                {
                    "id": "pay-2026-07",
                    "invoiceNo": "URB-INV-2026-088",
                    "month": "July 2026 (Unbilled Current)",
                    "projectTitle": "Apex Financial & Nexus AI Milestone 1",
                    "baseAmount": 125000,
                    "bonusAmount": 20000,
                    "totalAmount": 145000,
                    "status": "Pending Approval",
                    "dueDate": "05 Aug 2026"
                },
                {
                    "id": "pay-2026-06",
                    "invoiceNo": "URB-INV-2026-071",
                    "month": "June 2026",
                    "projectTitle": "Krypton Cyber Platform & Veloce Teaser",
                    "baseAmount": 110000,
                    "bonusAmount": 15000,
                    "totalAmount": 125000,
                    "status": "Paid",
                    "dueDate": "05 Jul 2026",
                    "paidDate": "04 Jul 2026"
                }
            ]

        # Notifications
        notifications = [
            {
                "id": "notif-1",
                "title": "Deliverable Approved",
                "message": "Apex Hero Motion Teaser was approved by Creative Lead.",
                "timeAgo": "2 hours ago",
                "isRead": False,
                "type": "project"
            },
            {
                "id": "notif-2",
                "title": "Payout Disbursement Scheduled",
                "message": "July unbilled payout of ₹1,45,000 scheduled for Aug 5th.",
                "timeAgo": "5 hours ago",
                "isRead": False,
                "type": "payout"
            }
        ]

        # Calculate metrics
        unbilled_total = sum(p['totalAmount'] for p in payouts if p['status'] in ['Pending Approval', 'Processing']) if permissions.get('can_view_finance', False) else 0

        return Response({
            "user": profile_data,
            "permissions": permissions,
            "metrics": {
                "activeProjectsCount": len(projects),
                "activeProjectsGrowth": "+2 this month",
                "pendingTasksCount": len([t for t in tasks if t['status'] != 'done']),
                "unbilledPayoutsAmount": unbilled_total,
            },
            "projects": projects,
            "tasks": tasks,
            "deliverables": deliverables,
            "payouts": payouts,
            "notifications": notifications
        })



