from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for user notifications."""

    class Meta:
        model = Notification
        fields = [
            'id', 'profile', 'title', 'body',
            'notification_type', 'is_read', 'created_at',
        ]
        read_only_fields = ['id', 'profile', 'created_at']
