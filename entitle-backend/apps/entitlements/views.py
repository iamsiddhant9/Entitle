import uuid
from django.utils.timezone import now
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Entitlement
from .serializers import EntitlementSerializer, EntitlementUpdateSerializer


class EntitlementListView(generics.ListAPIView):
    """
    GET /api/entitlements/?profile=<id>
    Returns all entitlements for a profile.
    """
    serializer_class = EntitlementSerializer

    def get_queryset(self):
        queryset = Entitlement.objects.select_related('scheme').all()
        profile_id = self.request.query_params.get('profile')
        if profile_id:
            queryset = queryset.filter(profile_id=profile_id)
        return queryset.order_by('-annual_amount')


class EntitlementDetailView(generics.RetrieveUpdateAPIView):
    """
    GET   /api/entitlements/<pk>/  → full entitlement detail
    PATCH /api/entitlements/<pk>/  → update status
    """
    http_method_names = ['get', 'patch', 'head', 'options']

    def get_queryset(self):
        return Entitlement.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            return EntitlementUpdateSerializer
        return EntitlementSerializer


class EntitlementApplyView(APIView):
    """
    POST /api/entitlements/<pk>/apply/
    Triggers the FormFillAgent to pre-fill and submit an application.
    Sets status → 'applied' and records application reference.
    """
    def post(self, request, pk, *args, **kwargs):
        try:
            entitlement = Entitlement.objects.select_related('scheme', 'profile').get(
                pk=pk
            )
        except Entitlement.DoesNotExist:
            return Response(
                {'detail': 'Entitlement not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if entitlement.status == 'approved':
            return Response(
                {'detail': 'This entitlement has already been approved.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Call FormFillAgent
        from apps.chat.agents.formfill_agent import FormFillAgent
        result = FormFillAgent().fill(entitlement)

        # Update entitlement record
        entitlement.status = 'applied'
        entitlement.application_ref = result.get('ref', '')
        entitlement.applied_at = now()
        entitlement.save(update_fields=['status', 'application_ref', 'applied_at'])

        return Response(
            {
                'entitlement_id': entitlement.id,
                'scheme': entitlement.scheme.name,
                'status': entitlement.status,
                'application_ref': entitlement.application_ref,
                'applied_at': entitlement.applied_at,
                'form_data': result.get('form_data', {}),
                'portal_url': entitlement.scheme.portal_url,
            },
            status=status.HTTP_200_OK,
        )
