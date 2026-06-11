from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(generics.ListAPIView):
    """
    GET /api/notifications/?profile=<id>
    Returns notifications for a profile. By default returns only unread.
    Use ?all=true to include read notifications.
    """
    serializer_class = NotificationSerializer

    def get_queryset(self):
        queryset = Notification.objects.all()

        profile_id = self.request.query_params.get('profile')
        if profile_id:
            queryset = queryset.filter(profile_id=profile_id)

        # Default: unread only; pass ?all=true for all notifications
        show_all = self.request.query_params.get('all', '').lower() == 'true'
        if not show_all:
            queryset = queryset.filter(is_read=False)

        return queryset.order_by('-created_at')


class NotificationMarkReadView(APIView):
    """
    POST /api/notifications/<pk>/read/
    Marks a single notification as read.
    """
    def post(self, request, pk, *args, **kwargs):
        try:
            notification = Notification.objects.get(
                pk=pk
            )
        except Notification.DoesNotExist:
            return Response(
                {'detail': 'Notification not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        notification.is_read = True
        notification.save(update_fields=['is_read'])

        return Response(
            NotificationSerializer(notification).data,
            status=status.HTTP_200_OK,
        )
