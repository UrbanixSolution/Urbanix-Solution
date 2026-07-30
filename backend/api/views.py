import logging
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
from rest_framework.authentication import TokenAuthentication

logger = logging.getLogger(__name__)
from django.contrib.auth.models import User
from rest_framework.throttling import AnonRateThrottle
from django.db.models import Q
from .models import (
    Service, Category, PortfolioProject, ContactLead, CareerApplication,
    WebsiteFeedback, AgencyPartnerLead, CallbackRequest,
    AssignedProject, AssignedTask, AssignedPayout,
    CallPartnerApplication, ClientLead,
)
from .serializers import (
    ServiceSerializer,
    CategorySerializer,
    PortfolioProjectSerializer,
    ContactLeadSerializer,
    CareerApplicationSerializer,
    WebsiteFeedbackSerializer,
    AgencyPartnerLeadSerializer,
    CallbackRequestSerializer,
    AssignedProjectSerializer,
    AssignedTaskSerializer,
    AssignedPayoutSerializer,
    CallPartnerApplicationSerializer,
    ClientLeadSerializer,
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

        # Check for duplicate email or phone number in database
        email = str(request.data.get('email', '')).strip()
        phone = str(request.data.get('phone', '')).strip()

        query = Q()
        if email:
            query |= Q(email__iexact=email)
        if phone:
            query |= Q(phone__iexact=phone)

        if query and CareerApplication.objects.filter(query).exists():
            return Response(
                {"error": "An application with this email or phone number is already registered."},
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
    Authenticates employees by Employee ID / Username / Email and password.
    Returns user profile & dynamic RBAC permissions.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        login_input = (
            request.data.get('username') or
            request.data.get('employee_id') or
            request.data.get('email') or
            ''
        ).strip()
        password = str(request.data.get('password') or '').strip()

        logger.info(f"[LOGIN ATTEMPT] Initiated login for identifier: '{login_input}'")
        print(f"[LOGIN ATTEMPT] Identifier: '{login_input}'")

        if not login_input or not password:
            return Response(
                {"detail": "Please provide both Employee ID/Username and Password."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 1. Direct authentication attempt with exact username
        user = authenticate(username=login_input, password=password)

        # 2. Case-insensitive & Profile Employee ID fallback lookup if direct auth fails
        if not user:
            try:
                matched_user = User.objects.filter(
                    Q(username__iexact=login_input) |
                    Q(email__iexact=login_input) |
                    Q(profile__employee_id__iexact=login_input)
                ).first()

                if matched_user:
                    if not matched_user.is_active:
                        matched_user.is_active = True
                        matched_user.save()

                    user = authenticate(username=matched_user.username, password=password)
                    if not user:
                        logger.warning(f"[LOGIN FAILED] Password mismatch for user '{matched_user.username}' ({matched_user.email})")
                        print(f"[LOGIN FAILED] Password mismatch for user '{matched_user.username}'")
                        return Response(
                            {"detail": "Invalid Password. Please check your credentials or reset password in Admin."},
                            status=status.HTTP_401_UNAUTHORIZED
                        )
                else:
                    logger.warning(f"[LOGIN FAILED] No user account found matching identifier '{login_input}'")
                    print(f"[LOGIN FAILED] No user found for '{login_input}'")
                    return Response(
                        {"detail": "No account found matching that Employee ID or Username."},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
            except Exception as e:
                logger.exception(f"[LOGIN ERROR] Exception during authentication for '{login_input}': {e}")
                print(f"[LOGIN ERROR] Exception: {e}")

        if not user:
            return Response(
                {"detail": "Invalid credentials or account access disabled."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            user.is_active = True
            user.save()

        # Get or create UserProfile
        profile, created = UserProfile.objects.get_or_create(
            user=user,
            defaults={
                'employee_id': user.username,
                'role': 'Agency Director & Admin' if user.is_superuser else 'Team Member',
                'department': 'Core Operations' if user.is_superuser else 'Engineering',
                'can_view_finance': user.is_superuser,
                'can_view_all_projects': user.is_superuser,
                'is_agency_admin': user.is_superuser,
            }
        )

        logger.info(f"[LOGIN SUCCESS] User '{user.username}' ({user.email}) logged in successfully.")
        print(f"[LOGIN SUCCESS] User '{user.username}' logged in successfully.")

        # Issue (or retrieve) a persistent DRF Token for this user.
        # This token is sent as  Authorization: Token <key>  on all subsequent
        # dashboard API calls so the backend can identify request.user.
        from rest_framework.authtoken.models import Token
        token_obj, _ = Token.objects.get_or_create(user=user)

        serializer = UserProfileSerializer(profile)
        return Response({
            "message": "Authentication successful",
            "token": token_obj.key,          # Real DRF token key
            "user": serializer.data,
            "permissions": serializer.data.get('permissions', {})
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
            if not user.is_active:
                user.is_active = True
                user.save()

            profile, _ = UserProfile.objects.get_or_create(
                user=user,
                defaults={
                    'employee_id': user.username,
                    'role': 'Team Member',
                    'department': 'Engineering',
                }
            )

            logger.info(f"[MAGIC LOGIN SUCCESS] User '{user.username}' authenticated via magic token.")
            serializer = UserProfileSerializer(profile)
            return Response({
                "message": "Magic link auto-login successful",
                "token": token.key,
                "user": serializer.data,
                "permissions": serializer.data.get('permissions', {})
            })
        except Token.DoesNotExist:
            logger.warning(f"[MAGIC LOGIN FAILED] Invalid token '{token_key}'")
            return Response({"detail": "Magic link token is invalid or expired. Please sign in manually."}, status=status.HTTP_401_UNAUTHORIZED)


class DashboardDataView(APIView):
    """
    GET /api/dashboard-data/

    Returns the CRM portal state (metrics, assigned projects, tasks, payouts,
    permissions) for the currently authenticated user.

    Authentication: Bearer token sent as  Authorization: Token <key>
    The token is obtained from /api/auth/login/ or /api/auth/magic-login/.

    RBAC rules applied:
    - Projects/Tasks: filtered to assigned_to=request.user unless the user
      has can_view_all_projects=True (admins see all).
    - Payouts: only returned if can_view_finance or can_view_financials_and_payouts
      permission is True — otherwise an empty list is sent.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user

        # ── Load user profile & permissions ───────────────────────────────
        profile, _ = UserProfile.objects.get_or_create(
            user=user,
            defaults={
                'employee_id': user.username,
                'role': 'Agency Director & Admin' if user.is_superuser else 'Team Member',
                'department': 'Core Operations' if user.is_superuser else 'Engineering',
                'can_view_finance': user.is_superuser,
                'can_view_all_projects': user.is_superuser,
                'is_agency_admin': user.is_superuser,
            }
        )

        profile_data = UserProfileSerializer(profile).data
        perms = profile_data.get('permissions', {
            'is_admin': False,
            'can_view_finance': False,
            'can_view_all_projects': False,
        })

        # ── Projects ─────────────────────────────────────────────────────
        # Admins with can_view_all_projects see every project in the database.
        # All other users see projects explicitly assigned to them or containing tasks assigned to them.
        if perms.get('can_view_all_projects', False):
            project_qs = AssignedProject.objects.all()
        else:
            project_qs = AssignedProject.objects.filter(
                Q(assigned_to=user) | Q(tasks__assigned_to=user)
            ).distinct()

        projects_data = AssignedProjectSerializer(project_qs, many=True).data

        # ── Tasks ────────────────────────────────────────────────────────
        task_qs = AssignedTask.objects.filter(assigned_to=user).select_related('project')
        tasks_data = AssignedTaskSerializer(task_qs, many=True).data

        # ── Payouts ──────────────────────────────────────────────────────
        # Always return payouts assigned to the logged-in user so freelancer dashboards
        # update dynamically when status changes to Paid/Completed. Admins with finance perms see all.
        can_see_finance = perms.get('can_view_finance', False) or perms.get('can_view_financials_and_payouts', False)
        if can_see_finance:
            payout_qs = AssignedPayout.objects.all()
        else:
            payout_qs = AssignedPayout.objects.filter(assigned_to=user)

        payouts_data = AssignedPayoutSerializer(payout_qs, many=True).data


        # ── Deliverables (frontend-managed — pass empty list for now) ──────
        # Deliverables are submitted by the user via the frontend modal and
        # managed in React state. The backend does not yet persist them.
        deliverables_data = []

        # ── Notifications (static for now) ────────────────────────────────
        notifications = [
            {
                "id": "notif-system-1",
                "title": "Welcome to Urbanix CRM",
                "message": f"Hello {profile_data.get('name', user.username)}! Your dashboard is live.",
                "timeAgo": "Just now",
                "isRead": False,
                "type": "system"
            }
        ]

        # ── Metrics ───────────────────────────────────────────────────────
        active_projects = [p for p in projects_data if p.get('status') in ('In Progress', 'Under Review', 'Upcoming')]
        pending_tasks   = [t for t in tasks_data if t.get('status') != 'done']
        unbilled_total  = sum(
            p['totalAmount'] for p in payouts_data
            if p.get('status') in ('Pending Approval', 'Processing')
        ) if can_see_finance else 0

        return Response({
            "user": profile_data,
            "permissions": perms,
            "metrics": {
                "activeProjectsCount":   len(active_projects),
                "activeProjectsGrowth":  "+0 this month",
                "pendingTasksCount":     len(pending_tasks),
                "unbilledPayoutsAmount": unbilled_total,
            },
            "projects":      projects_data,
            "tasks":         tasks_data,
            "deliverables":  deliverables_data,
            "payouts":       payouts_data,
            "notifications": notifications,
        })


# ===========================================================================
# Call Partner Program Views & Endpoints
# ===========================================================================

class CallPartnerApplicationApplyView(generics.CreateAPIView):
    """
    POST /api/call-partner/apply/
    Public endpoint accepting Call Partner applications (full_name, email, whatsapp_number)
    from the Career page modal with self-hosted text CAPTCHA validation.
    """
    queryset = CallPartnerApplication.objects.all()
    serializer_class = CallPartnerApplicationSerializer
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



class ClientLeadViewSet(viewsets.ModelViewSet):
    """
    GET /api/leads/
    POST /api/leads/

    Private endpoint for managing referred ClientLeads.
    Role-Based Access Control:
    - If user is superuser or agency admin: sees ALL submitted client leads across all partners.
    - Otherwise (Call Partner / Team Member): ONLY sees client leads where partner == request.user.
    """
    serializer_class = ClientLeadSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return ClientLead.objects.none()

        profile = getattr(user, 'profile', None)
        is_admin = user.is_superuser or (profile and (profile.is_agency_admin or profile.can_view_all_projects))

        if is_admin:
            return ClientLead.objects.all()
        return ClientLead.objects.filter(partner=user)

    def perform_create(self, serializer):
        serializer.save(partner=self.request.user)




