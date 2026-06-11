from django.db import models


class Scheme(models.Model):
    CATEGORY_CHOICES = [
        ('agriculture', 'Agriculture'),
        ('health', 'Health'),
        ('education', 'Education'),
        ('housing', 'Housing'),
        ('pension', 'Pension'),
        ('welfare', 'Welfare'),
    ]

    LEVEL_CHOICES = [
        ('central', 'Central'),
        ('state', 'State'),
        ('local', 'Local'),
    ]

    name = models.CharField(max_length=300)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    department = models.CharField(max_length=200)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    state = models.CharField(max_length=100, blank=True)
    annual_benefit = models.PositiveIntegerField()
    eligibility_summary = models.TextField()
    eligibility_rules = models.JSONField()
    documents_required = models.JSONField()
    portal_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    launched_at = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'schemes'
        ordering = ['-annual_benefit']

    def __str__(self):
        return self.name
