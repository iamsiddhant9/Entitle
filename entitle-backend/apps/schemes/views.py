from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Scheme
from .serializers import SchemeSerializer


class SchemeListView(generics.ListAPIView):
    """
    GET /api/schemes/
    Lists all active schemes with optional filtering:
      ?category=agriculture
      ?state=maharashtra
      ?level=central
    """
    permission_classes = [IsAuthenticated]
    serializer_class = SchemeSerializer

    def get_queryset(self):
        queryset = Scheme.objects.filter(is_active=True)

        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)

        state = self.request.query_params.get('state')
        if state:
            # Include both state-specific and central/local schemes
            queryset = queryset.filter(state__iexact=state) | Scheme.objects.filter(
                is_active=True, state=''
            )

        level = self.request.query_params.get('level')
        if level:
            queryset = queryset.filter(level=level)

        return queryset.order_by('-annual_benefit')


class SchemeDetailView(generics.RetrieveAPIView):
    """
    GET /api/schemes/<pk>/
    Returns full details for a single scheme.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = SchemeSerializer
    queryset = Scheme.objects.all()
