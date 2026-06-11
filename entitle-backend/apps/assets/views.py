from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import UnclaimedAsset
from .serializers import UnclaimedAssetSerializer


class AssetListView(generics.ListAPIView):
    """
    GET /api/assets/?profile=<id>
    Returns all unclaimed assets for the authenticated user's profiles.
    Optionally filter by ?profile=<profile_id> or ?claimed=false.
    """
    serializer_class = UnclaimedAssetSerializer

    def get_queryset(self):
        queryset = UnclaimedAsset.objects.all()
        profile_id = self.request.query_params.get('profile')
        if profile_id:
            queryset = queryset.filter(profile_id=profile_id)

        claimed = self.request.query_params.get('claimed', '').lower()
        if claimed == 'false':
            queryset = queryset.filter(is_claimed=False)
        elif claimed == 'true':
            queryset = queryset.filter(is_claimed=True)

        return queryset.order_by('-amount')


class AssetClaimView(APIView):
    """
    POST /api/assets/<pk>/claim/
    Returns claim instructions for the asset and marks it as initiated
    in the metadata (stores instructions back on the record).
    """
    def post(self, request, pk, *args, **kwargs):
        try:
            asset = UnclaimedAsset.objects.get(
                pk=pk
            )
        except UnclaimedAsset.DoesNotExist:
            return Response(
                {'detail': 'Asset not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if asset.is_claimed:
            return Response(
                {'detail': 'This asset has already been claimed.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Generate claim instructions based on source
        instructions = self._build_claim_instructions(asset)

        # Save instructions to the record (mark as initiated)
        asset.claim_instructions = instructions
        asset.save(update_fields=['claim_instructions'])

        return Response(
            {
                'asset_id': asset.id,
                'institution': asset.institution,
                'amount': asset.amount,
                'source': asset.source,
                'asset_type': asset.asset_type,
                'reference': asset.reference,
                'claim_instructions': instructions,
                'status': 'initiated',
            }
        )

    def _build_claim_instructions(self, asset: UnclaimedAsset) -> str:
        base_instructions = {
            'RBI': (
                f"To claim your unclaimed bank account at {asset.institution}:\n"
                f"1. Visit the nearest branch of {asset.institution} with your Aadhaar.\n"
                f"2. Fill the 'Unclaimed Deposit Claim' form.\n"
                f"3. Provide your reference number: {asset.reference}.\n"
                f"4. Submit KYC documents (Aadhaar, PAN, passport photo).\n"
                f"5. The bank will process your claim within 30 days.\n"
                f"Alternatively, visit the RBI UDGAM portal: https://udgam.rbi.org.in"
            ),
            'IRDAI': (
                f"To claim your insurance policy at {asset.institution}:\n"
                f"1. Contact {asset.institution}'s claims department with policy reference: {asset.reference}.\n"
                f"2. Submit a completed claim form with Aadhaar, PAN, and death certificate (if applicable).\n"
                f"3. The insurer must settle within 30 days of receiving all documents.\n"
                f"Alternatively, raise a complaint at IRDAI Bima Bharosa: https://bimabharosa.irdai.gov.in"
            ),
            'SEBI': (
                f"To claim your unclaimed dividend from {asset.institution}:\n"
                f"1. Contact the Registrar & Transfer Agent for {asset.institution}.\n"
                f"2. Submit a dividend claim form with your folio/reference: {asset.reference}.\n"
                f"3. Provide Aadhaar, PAN, and bank details for direct credit.\n"
                f"For IEPF claims, visit: https://iepf.gov.in"
            ),
        }
        return base_instructions.get(
            asset.source,
            f"Please contact {asset.institution} directly with reference: {asset.reference}."
        )
