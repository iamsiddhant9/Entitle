from rest_framework import serializers
from .models import Scheme


class SchemeSerializer(serializers.ModelSerializer):
    """Full serializer for Scheme with all fields."""

    class Meta:
        model = Scheme
        fields = [
            'id', 'name', 'category', 'department', 'level', 'state',
            'annual_benefit', 'eligibility_summary', 'eligibility_rules',
            'documents_required', 'portal_url', 'is_active',
            'launched_at', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']
