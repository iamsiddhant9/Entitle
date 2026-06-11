from django.db import models
from apps.profiles.models import CivicProfile


class Notification(models.Model):
    TYPE_CHOICES = [
        ('new_scheme', 'New Scheme'),
        ('status_change', 'Status Change'),
        ('asset_found', 'Asset Found'),
        ('action_required', 'Action Required'),
    ]

    profile = models.ForeignKey(
        CivicProfile,
        related_name='notifications',
        on_delete=models.CASCADE,
    )
    title = models.CharField(max_length=200)
    body = models.TextField()
    notification_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default='new_scheme',
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']

    def __str__(self):
        return f'[{self.notification_type}] {self.title}'
