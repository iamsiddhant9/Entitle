from django.db import models


class CivicProfile(models.Model):
    CASTE_CHOICES = [
        ('general', 'General'),
        ('obc', 'OBC'),
        ('sc', 'SC'),
        ('st', 'ST'),
        ('ews', 'EWS'),
        ('nt_dnt', 'NT/DNT'),
    ]

    OCCUPATION_CHOICES = [
        ('farmer', 'Farmer'),
        ('labourer', 'Labourer'),
        ('skilled_trade', 'Skilled Trade'),
        ('small_business', 'Small Business'),
        ('salaried', 'Salaried'),
        ('unemployed', 'Unemployed'),
        ('other', 'Other'),
    ]

    user = models.OneToOneField(
        'users.User',
        on_delete=models.CASCADE,
        related_name='civic_profile',
        null=True,
        blank=True
    )
    name = models.CharField(max_length=200)
    age = models.PositiveIntegerField()
    state = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    caste_category = models.CharField(max_length=20, choices=CASTE_CHOICES)
    annual_income = models.PositiveIntegerField()
    occupation = models.CharField(max_length=30, choices=OCCUPATION_CHOICES)
    land_holding = models.DecimalField(
        max_digits=6, decimal_places=2, null=True, blank=True
    )
    family_size = models.PositiveIntegerField()
    bpl_card = models.BooleanField(default=False)
    aadhaar_linked = models.BooleanField(default=False)
    pan_linked = models.BooleanField(default=False)
    last_scanned = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'civic_profiles'

    def __str__(self):
        return f'{self.name} ({self.state})'


class FamilyMember(models.Model):
    profile = models.ForeignKey(
        CivicProfile,
        related_name='family_members',
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=200)
    age = models.PositiveIntegerField()
    relation = models.CharField(max_length=50)
    occupation = models.CharField(max_length=100, blank=True)

    class Meta:
        db_table = 'family_members'

    def __str__(self):
        return f'{self.name} ({self.relation}) – {self.profile.name}'
