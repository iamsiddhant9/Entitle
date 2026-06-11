"""
Celery task: scheme_monitor
Polls for new government schemes and triggers re-scans when new ones are found.
"""
from celery import shared_task
from apps.schemes.models import Scheme


MOCK_NEW_SCHEMES = [
    {
        'name': 'PM Kaushal Vikas Yojana 4.0',
        'category': 'welfare',
        'department': 'Ministry of Skill Development',
        'level': 'central',
        'state': '',
        'annual_benefit': 8000,
        'eligibility_summary': (
            'Skill training for youth aged 15–45 with stipend support '
            'under the fourth phase of PMKVY.'
        ),
        'eligibility_rules': {
            'age_min': 15,
            'age_max': 45,
        },
        'documents_required': ['Aadhaar', 'Educational certificate'],
        'portal_url': 'https://pmkvyofficial.org',
        'is_active': True,
    },
]


@shared_task(name='tasks.scheme_monitor.monitor_schemes')
def monitor_schemes():
    """
    Check for new schemes and add them to the DB.
    If new schemes are added, trigger a full re-scan of all profiles.
    """
    added = 0
    for scheme_data in MOCK_NEW_SCHEMES:
        obj, created = Scheme.objects.get_or_create(
            name=scheme_data['name'],
            defaults=scheme_data,
        )
        if created:
            added += 1

    if added > 0:
        from tasks.eligibility_rescan import rescan_all_profiles
        rescan_all_profiles.delay()

    return f'Checked {len(MOCK_NEW_SCHEMES)} mock schemes. Added: {added}.'
