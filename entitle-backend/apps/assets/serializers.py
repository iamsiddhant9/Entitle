from rest_framework import serializers
from .models import UnclaimedAsset


class UnclaimedAssetSerializer(serializers.ModelSerializer):
    """Serializer for unclaimed assets with all fields."""

    class Meta:
        model = UnclaimedAsset
        fields = [
            'id', 'profile', 'asset_type', 'institution', 'amount',
            'source', 'reference', 'claim_instructions', 'is_claimed',
            'found_at',
        ]
        read_only_fields = ['id', 'profile', 'found_at']
