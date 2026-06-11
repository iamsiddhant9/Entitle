from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import CivicProfile
from .serializers import CivicProfileSerializer, ProfileSummarySerializer


class ProfileCreateView(generics.CreateAPIView):
    """
    POST /api/profiles/
    Creates a civic profile for the authenticated user.
    """
    serializer_class = CivicProfileSerializer

    def perform_create(self, serializer):
        serializer.save()


class ProfileDetailView(generics.RetrieveUpdateAPIView):
    """
    GET   /api/profiles/<pk>/  → retrieve profile
    PATCH /api/profiles/<pk>/  → partial update profile
    """
    serializer_class = CivicProfileSerializer
    queryset = CivicProfile.objects.prefetch_related('family_members').all()
    http_method_names = ['get', 'patch', 'head', 'options']

    def get_queryset(self):
        return CivicProfile.objects.prefetch_related('family_members').all()


class ProfileScanView(APIView):
    """
    POST /api/profiles/<pk>/scan/
    Runs the EligibilityAgent and AssetHunterAgent on this profile,
    returning the full list of matched Entitlements.
    """
    def post(self, request, pk, *args, **kwargs):
        try:
            profile = CivicProfile.objects.get(pk=pk)
        except CivicProfile.DoesNotExist:
            return Response({'detail': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Run eligibility agent
        from apps.chat.agents.eligibility_agent import EligibilityAgent
        entitlements = EligibilityAgent().run(profile.id)

        # Run asset hunter agent
        from apps.chat.agents.asset_hunter import AssetHunterAgent
        assets = AssetHunterAgent().run(profile.id)

        # Serialize entitlements inline to avoid circular imports
        from apps.entitlements.serializers import EntitlementSerializer
        from apps.assets.serializers import UnclaimedAssetSerializer

        return Response({
            'profile_id': profile.id,
            'entitlements_found': len(entitlements),
            'assets_found': len(assets),
            'entitlements': EntitlementSerializer(entitlements, many=True).data,
            'assets': UnclaimedAssetSerializer(assets, many=True).data,
            'last_scanned': profile.last_scanned,
        })


class ProfileSummaryView(APIView):
    """
    GET /api/profiles/<pk>/summary/
    Returns financial totals: total_annual_amount, scheme_count, asset_count, asset_total.
    """
    def get(self, request, pk, *args, **kwargs):
        try:
            profile = CivicProfile.objects.get(pk=pk)
        except CivicProfile.DoesNotExist:
            return Response({'detail': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)

        from apps.entitlements.models import Entitlement
        from apps.assets.models import UnclaimedAsset

        entitlements = Entitlement.objects.filter(profile=profile)
        assets = UnclaimedAsset.objects.filter(profile=profile, is_claimed=False)

        total_annual_amount = sum(e.annual_amount for e in entitlements)
        asset_total = sum(a.amount for a in assets)

        data = {
            'profile_id': profile.id,
            'name': profile.name,
            'total_annual_amount': total_annual_amount,
            'scheme_count': entitlements.count(),
            'asset_count': assets.count(),
            'asset_total': asset_total,
            'last_scanned': profile.last_scanned,
        }

        serializer = ProfileSummarySerializer(data)
        return Response(serializer.data)


class DemoProfileView(APIView):
    """
    GET /api/profiles/demo/
    Returns the seeded demo profile so the frontend can load it without signup.
    """
    permission_classes = []  # Public — no auth needed

    def get(self, request, *args, **kwargs):
        from apps.schemes.management.commands.seed_demo import DEMO_PROFILE_NAME
        try:
            profile = CivicProfile.objects.get(name=DEMO_PROFILE_NAME)
        except CivicProfile.DoesNotExist:
            return Response(
                {'detail': 'Demo profile not found. Run `python manage.py seed_demo` first.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = CivicProfileSerializer(profile)
        return Response(serializer.data)
