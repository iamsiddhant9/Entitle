from django.db import models
from apps.profiles.models import CivicProfile
from apps.schemes.models import Scheme


class Entitlement(models.Model):
    STATUS_CHOICES = [
        ('eligible', 'Eligible'),
        ('applied', 'Applied'),
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('needs_docs', 'Needs Documents'),
    ]

    profile = models.ForeignKey(
        CivicProfile,
        related_name='entitlements',
        on_delete=models.CASCADE,
    )
    scheme = models.ForeignKey(
        Scheme,
        on_delete=models.CASCADE,
    )
    confidence = models.FloatField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='eligible',
    )
    application_ref = models.CharField(max_length=100, blank=True)
    annual_amount = models.PositiveIntegerField()
    missing_documents = models.JSONField(default=list)
    applied_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'entitlements'
        unique_together = ['profile', 'scheme']
        ordering = ['-annual_amount']

    def __str__(self):
        return f'{self.profile.name} → {self.scheme.name} [{self.status}]'
