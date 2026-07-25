"""DRF serializers for the Leads app."""

from rest_framework import serializers
from .models import Lead


class LeadSerializer(serializers.ModelSerializer):
    """Full serializer for Lead model."""

    class Meta:
        model = Lead
        fields = [
            'id',
            'name',
            'whatsapp_number',
            'service_required',
            'message',
            'status',
            'created_at',
        ]
        read_only_fields = ['id', 'status', 'created_at']

    def validate_whatsapp_number(self, value):
        """Basic validation: must be at least 7 digits."""
        digits = ''.join(filter(str.isdigit, value))
        if len(digits) < 7:
            raise serializers.ValidationError(
                'Please provide a valid WhatsApp number (at least 7 digits).'
            )
        return value
