from rest_framework import serializers
from .models import CivicProfile, FamilyMember


class FamilyMemberSerializer(serializers.ModelSerializer):
    """Serializer for family members nested inside CivicProfile."""

    class Meta:
        model = FamilyMember
        fields = ['id', 'name', 'age', 'relation', 'occupation']


class CivicProfileSerializer(serializers.ModelSerializer):
    """Full serializer for CivicProfile with nested family members."""
    family_members = FamilyMemberSerializer(many=True, required=False)

    class Meta:
        model = CivicProfile
        fields = [
            'id', 'user', 'name', 'age', 'state', 'district',
            'caste_category', 'annual_income', 'occupation',
            'land_holding', 'family_size', 'bpl_card',
            'aadhaar_linked', 'pan_linked', 'last_scanned',
            'family_members', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'user', 'last_scanned', 'created_at', 'updated_at']

    def create(self, validated_data):
        family_data = validated_data.pop('family_members', [])
        profile = CivicProfile.objects.create(**validated_data)
        for member_data in family_data:
            FamilyMember.objects.create(profile=profile, **member_data)
        return profile

    def update(self, instance, validated_data):
        family_data = validated_data.pop('family_members', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if family_data is not None:
            # Replace all family members
            instance.family_members.all().delete()
            for member_data in family_data:
                FamilyMember.objects.create(profile=instance, **member_data)

        return instance


class ProfileSummarySerializer(serializers.Serializer):
    """Read-only summary of a profile's financial entitlements."""
    profile_id = serializers.IntegerField()
    name = serializers.CharField()
    total_annual_amount = serializers.IntegerField()
    scheme_count = serializers.IntegerField()
    asset_count = serializers.IntegerField()
    asset_total = serializers.IntegerField()
    last_scanned = serializers.DateTimeField(allow_null=True)
