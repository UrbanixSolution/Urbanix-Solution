from django.db.models import Q
from rest_framework import serializers
from .models import (
    Service, Category, PortfolioProject, ContactLead, CareerApplication,
    WebsiteFeedback, PricingTier, AgencyPartnerLead, CallbackRequest, UserProfile,
    CallPartnerApplication, ClientLead,
)




class PricingTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingTier
        fields = [
            'id',
            'name',
            'price',
            'delivery_time',
            'features',
            'is_popular',
            'order',
        ]


class ServiceSerializer(serializers.ModelSerializer):
    icon = serializers.CharField(source='icon_name', read_only=True)
    pricing_tiers = PricingTierSerializer(many=True, read_only=True)

    class Meta:
        model = Service
        fields = [
            'id',
            'title',
            'slug',
            'short_description',
            'full_description',
            'pricing_text',
            'base_price',
            'features',
            'pricing_tiers',
            'icon_name',
            'icon',
            'order',
            'is_active',
        ]


class CategorySerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='name', read_only=True)
    icon = serializers.CharField(source='icon_name', read_only=True)

    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'title',
            'slug',
            'description',
            'icon_name',
            'icon',
            'order',
        ]


class PortfolioProjectSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True, default='')
    category_slug = serializers.CharField(source='category.slug', read_only=True, default='')

    class Meta:
        model = PortfolioProject
        fields = [
            'id',
            'title',
            'short_description',
            'category',
            'category_name',
            'category_slug',
            'sector',
            'image',
            'image_url',
            'tech_tags',
            'live_link',
            'results_highlight',
            'is_featured',
            'created_at',
        ]

    def get_image_url(self, obj: PortfolioProject) -> str:
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            # Fallback for relative paths if request is not in context
            raw_url = obj.image.url
            if raw_url.startswith('/'):
                return f"http://127.0.0.1:8000{raw_url}"
            return raw_url
        return obj.image_url or ''


class ContactLeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactLead
        fields = [
            'id',
            'name',
            'email',
            'phone',
            'service_interested',
            'message',
            'created_at',
        ]

    def validate(self, attrs):
        email = (attrs.get('email') or '').strip()
        phone = (attrs.get('phone') or '').strip()

        query = Q()
        if email:
            query |= Q(email__iexact=email)
        if phone:
            query |= Q(phone__iexact=phone)

        if query and ContactLead.objects.filter(query).exists():
            raise serializers.ValidationError(
                "A contact enquiry with this email or phone number is already registered."
            )
        return attrs


class CareerApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerApplication
        fields = [
            'id',
            'name',
            'email',
            'phone',
            'role_applied',
            'state',
            'district',
            'town',
            'portfolio_link',
            'cover_letter',
            'created_at',
        ]

    def validate(self, attrs):
        email = (attrs.get('email') or '').strip()
        phone = (attrs.get('phone') or '').strip()

        query = Q()
        if email:
            query |= Q(email__iexact=email)
        if phone:
            query |= Q(phone__iexact=phone)

        if query and CareerApplication.objects.filter(query).exists():
            raise serializers.ValidationError(
                "An application with this email or phone number is already registered."
            )
        return attrs


class WebsiteFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteFeedback
        fields = [
            'id',
            'feedback_type',
            'message',
            'contact_info',
            'status',
            'created_at',
        ]
        read_only_fields = ['id', 'status', 'created_at']


class AgencyPartnerLeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgencyPartnerLead
        fields = [
            'id',
            'company_name',
            'contact_person',
            'whatsapp_number',
            'email',
            'core_services',
            'portfolio_link',
            'team_size',
            'state',
            'district',
            'town',
            'proposal',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def validate(self, attrs):
        email = (attrs.get('email') or '').strip()
        whatsapp = (attrs.get('whatsapp_number') or '').strip()

        query = Q()
        if email:
            query |= Q(email__iexact=email)
        if whatsapp:
            query |= Q(whatsapp_number__iexact=whatsapp)

        if query and AgencyPartnerLead.objects.filter(query).exists():
            raise serializers.ValidationError(
                "An agency partner application with this email or WhatsApp number is already registered."
            )
        return attrs



class CallbackRequestSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True, required=False)
    phone = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = CallbackRequest
        fields = [
            'id',
            'full_name',
            'phone_number',
            'name',
            'phone',
            'state',
            'district',
            'town',
            'is_completed',
            'created_at',
        ]
        read_only_fields = ['id', 'is_completed', 'created_at']

    def validate(self, attrs):
        if 'name' in attrs and not attrs.get('full_name'):
            attrs['full_name'] = attrs.pop('name')
        else:
            attrs.pop('name', None)

        if 'phone' in attrs and not attrs.get('phone_number'):
            attrs['phone_number'] = attrs.pop('phone')
        else:
            attrs.pop('phone', None)

        full_name = attrs.get('full_name', '').strip()
        phone_number = attrs.get('phone_number', '').strip()

        if not full_name:
            raise serializers.ValidationError({"full_name": "Full name is required."})
        if not phone_number:
            raise serializers.ValidationError({"phone_number": "Phone number is required."})

        if CallbackRequest.objects.filter(phone_number__iexact=phone_number, is_completed=False).exists():
            raise serializers.ValidationError({"phone_number": "A pending callback request for this phone number already exists."})

        attrs['full_name'] = full_name
        attrs['phone_number'] = phone_number
        return attrs



from .models import DashboardPermission

class UserProfileSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    email = serializers.EmailField(source='user.email', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            'id',
            'employee_id',
            'username',
            'name',
            'email',
            'role',
            'department',
            'avatar_url',
            'permissions',
        ]

    def get_name(self, obj):
        full_name = obj.user.get_full_name()
        return full_name if full_name.strip() else obj.user.username

    def get_permissions(self, obj):
        is_admin = obj.is_agency_admin or obj.user.is_superuser
        
        # Get or create DashboardPermission instance for this UserProfile/User
        card_perm = DashboardPermission.objects.filter(user_profile=obj).first() or DashboardPermission.objects.filter(user=obj.user).first()
        if not card_perm:
            card_perm = DashboardPermission.objects.create(
                user_profile=obj,
                user=obj.user,
                can_view_active_projects_card=True,
                can_view_pending_tasks_card=True,
                can_view_financials_and_payouts=obj.can_view_finance or is_admin,
                can_view_project_timeline=True,
                can_view_priority_queue=True,
            )

        fin_access = card_perm.can_view_financials_and_payouts or obj.can_view_finance or is_admin

        return {
            'is_admin': is_admin,
            'can_view_finance': fin_access,
            'can_view_all_projects': obj.can_view_all_projects or is_admin,
            'can_view_active_projects_card': card_perm.can_view_active_projects_card or is_admin,
            'can_view_pending_tasks_card': card_perm.can_view_pending_tasks_card or is_admin,
            'can_view_financials_and_payouts': fin_access,
            'can_view_project_timeline': card_perm.can_view_project_timeline or is_admin,
            'can_view_priority_queue': card_perm.can_view_priority_queue or is_admin,
        }


# ---------------------------------------------------------------------------
# Agency CRM Portal — Assigned Work Serializers
# ---------------------------------------------------------------------------

from .models import AssignedProject, AssignedTask, AssignedPayout


class AssignedProjectSerializer(serializers.ModelSerializer):
    """
    Serializes AssignedProject to the camelCase shape expected by the
    frontend Project TypeScript interface.
    """
    id = serializers.SerializerMethodField()
    clientName = serializers.CharField(source='client_name', read_only=True)
    progressPercent = serializers.IntegerField(source='progress_percent', read_only=True)
    deliverableType = serializers.CharField(source='deliverable_type', read_only=True)
    payoutEst = serializers.IntegerField(source='payout_est', read_only=True)
    teamMembers = serializers.JSONField(source='team_members', read_only=True)

    class Meta:
        model = AssignedProject
        fields = [
            'id',
            'title',
            'clientName',
            'category',
            'status',
            'progressPercent',
            'deadline',
            'teamMembers',
            'deliverableType',
            'priority',
            'payoutEst',
        ]

    def get_id(self, obj):
        return f'prj-{obj.pk}'


class AssignedTaskSerializer(serializers.ModelSerializer):
    """
    Serializes AssignedTask to the camelCase shape expected by the
    frontend TaskItem TypeScript interface.
    """
    id = serializers.SerializerMethodField()
    projectId = serializers.SerializerMethodField()
    projectName = serializers.SerializerMethodField()
    dueDate = serializers.CharField(source='due_date', read_only=True)
    estimatedHours = serializers.IntegerField(source='estimated_hours', read_only=True)

    class Meta:
        model = AssignedTask
        fields = [
            'id',
            'title',
            'projectId',
            'projectName',
            'priority',
            'status',
            'dueDate',
            'estimatedHours',
        ]

    def get_id(self, obj):
        return f'tsk-{obj.pk}'

    def get_projectId(self, obj):
        return f'prj-{obj.project_id}' if obj.project_id else ''

    def get_projectName(self, obj):
        return obj.project.title if obj.project else ''


class AssignedPayoutSerializer(serializers.ModelSerializer):
    """
    Serializes AssignedPayout to the camelCase shape expected by the
    frontend PayoutRecord TypeScript interface.
    """
    id = serializers.SerializerMethodField()
    invoiceNo = serializers.CharField(source='invoice_no', read_only=True)
    projectTitle = serializers.CharField(source='project_title', read_only=True)
    baseAmount = serializers.IntegerField(source='base_amount', read_only=True)
    bonusAmount = serializers.IntegerField(source='bonus_amount', read_only=True)
    totalAmount = serializers.IntegerField(source='total_amount', read_only=True)
    dueDate = serializers.CharField(source='due_date', read_only=True)
    paidDate = serializers.CharField(source='paid_date', read_only=True)

    class Meta:
        model = AssignedPayout
        fields = [
            'id',
            'invoiceNo',
            'month',
            'projectTitle',
            'baseAmount',
            'bonusAmount',
            'totalAmount',
            'status',
            'dueDate',
            'paidDate',
        ]

    def get_id(self, obj):
        return f'pay-{obj.pk}'


# ===========================================================================
# Call Partner Program Serializers
# ===========================================================================

class CallPartnerApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CallPartnerApplication
        fields = [
            'id',
            'full_name',
            'email',
            'whatsapp_number',
            'status',
            'created_at',
        ]
        read_only_fields = ['id', 'status', 'created_at']

    def validate(self, attrs):
        email = (attrs.get('email') or '').strip()
        whatsapp = (attrs.get('whatsapp_number') or '').strip()

        query = Q()
        if email:
            query |= Q(email__iexact=email)
        if whatsapp:
            query |= Q(whatsapp_number__iexact=whatsapp)

        if query and CallPartnerApplication.objects.filter(query).exists():
            raise serializers.ValidationError(
                "An application with this email or WhatsApp number is already registered."
            )
        return attrs


class ClientLeadSerializer(serializers.ModelSerializer):
    partner_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ClientLead
        fields = [
            'id',
            'partner',
            'partner_name',
            'client_name',
            'client_phone',
            'project_type',
            'discussed_price',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'partner', 'partner_name', 'status', 'created_at', 'updated_at']

    def get_partner_name(self, obj):
        return obj.partner.get_full_name() or obj.partner.username


