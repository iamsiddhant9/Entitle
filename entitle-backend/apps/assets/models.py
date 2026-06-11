from django.db import models
from apps.profiles.models import CivicProfile


class UnclaimedAsset(models.Model):
    TYPE_CHOICES = [
        ('bank_account', 'Bank Account'),
        ('insurance', 'Insurance'),
        ('dividend', 'Dividend'),
        ('pension', 'Pension'),
    ]

    SOURCE_CHOICES = [
        ('RBI', 'RBI'),
        ('IRDAI', 'IRDAI'),
        ('SEBI', 'SEBI'),
    ]

    profile = models.ForeignKey(
        CivicProfile,
        related_name='unclaimed_assets',
        on_delete=models.CASCADE,
    )
    asset_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    institution = models.CharField(max_length=200)
    amount = models.PositiveIntegerField()
    source = models.CharField(max_length=10, choices=SOURCE_CHOICES)
    reference = models.CharField(max_length=200)
    claim_instructions = models.TextField(blank=True)
    is_claimed = models.BooleanField(default=False)
    found_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'unclaimed_assets'
        ordering = ['-amount']

    def __str__(self):
        return f'{self.asset_type} @ {self.institution} – ₹{self.amount:,}'
