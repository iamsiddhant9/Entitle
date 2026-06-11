from rest_framework import serializers
from apps.schemes.serializers import SchemeSerializer
from .models import Entitlement


class EntitlementSerializer(serializers.ModelSerializer):
    """Entitlement serializer with full scheme details embedded."""
    scheme = SchemeSerializer(read_only=True)

    class Meta:
        model = Entitlement
        fields = [
            'id', 'profile', 'scheme', 'confidence', 'status',
            'application_ref', 'annual_amount', 'missing_documents',
            'applied_at', 'created_at',
        ]
        read_only_fields = [
            'id', 'profile', 'scheme', 'confidence', 'annual_amount',
            'missing_documents', 'applied_at', 'created_at',
        ]


class EntitlementUpdateSerializer(serializers.ModelSerializer):
    """Lightweight serializer for PATCH operations (status only)."""

    class Meta:
        model = Entitlement
        fields = ['status', 'application_ref']
