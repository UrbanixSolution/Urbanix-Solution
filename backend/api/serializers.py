from django.utils import timezone
from datetime import timedelta
from django.db.models import Q
from rest_framework import serializers
from .models import Service, Category, PortfolioProject, ContactLead, CareerApplication, WebsiteFeedback, PricingTier, AgencyPartnerLead, CallbackRequest


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
            if raw_url.startsWith('/'):
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
        email = attrs.get('email', '').strip().lower()
        phone = attrs.get('phone', '').strip()
        one_day_ago = timezone.now() - timedelta(days=1)

        if email or phone:
            duplicate_exists = CareerApplication.objects.filter(
                Q(email__iexact=email) | Q(phone=phone),
                created_at__gte=one_day_ago
            ).exists()

            if duplicate_exists:
                raise serializers.ValidationError(
                    "You have already submitted an application using this email or phone number in the last 24 hours. Please wait before applying again."
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

        attrs['full_name'] = full_name
        attrs['phone_number'] = phone_number
        return attrs
