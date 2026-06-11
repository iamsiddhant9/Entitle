"""
Management command to seed the database with 10 core government schemes.

Usage:
    python manage.py seed_schemes
"""
from django.core.management.base import BaseCommand
from apps.schemes.models import Scheme


SCHEMES = [
    {
        'name': 'PM-KISAN Samman Nidhi',
        'category': 'agriculture',
        'department': 'Ministry of Agriculture',
        'level': 'central',
        'state': '',
        'annual_benefit': 6000,
        'eligibility_summary': (
            'Financial support of ₹6,000 per year (in 3 instalments) '
            'to small and marginal farmers with land up to 2 hectares.'
        ),
        'eligibility_rules': {
            'income_max': 200000,
            'occupation': ['farmer'],
            'age_min': 18,
            'age_max': 70,
            'land_max_hectares': 2.0,
        },
        'documents_required': [
            'Aadhaar',
            'Bank passbook',
            'Land records',
            'Kisan Credit Card',
        ],
        'portal_url': 'https://pmkisan.gov.in',
        'is_active': True,
    },
    {
        'name': 'PM Awas Yojana (Gramin)',
        'category': 'housing',
        'department': 'Ministry of Rural Development',
        'level': 'central',
        'state': '',
        'annual_benefit': 120000,
        'eligibility_summary': (
            'Financial assistance to homeless rural households for '
            'construction of a pucca house.'
        ),
        'eligibility_rules': {
            'income_max': 200000,
            'bpl_required': False,
            'family_size_min': 2,
        },
        'documents_required': [
            'Aadhaar',
            'BPL Card',
            'Income certificate',
            'Land ownership proof',
        ],
        'portal_url': 'https://pmayg.nic.in',
        'is_active': True,
    },
    {
        'name': 'Pradhan Mantri Jan Arogya Yojana (PMJAY / Ayushman Bharat)',
        'category': 'health',
        'department': 'National Health Authority',
        'level': 'central',
        'state': '',
        'annual_benefit': 500000,
        'eligibility_summary': (
            'Health insurance cover of up to ₹5 lakh per family per year '
            'for secondary and tertiary care hospitalisation.'
        ),
        'eligibility_rules': {
            'income_max': 300000,
            'family_size_min': 1,
        },
        'documents_required': [
            'Aadhaar',
            'Ration card',
            'Income certificate',
        ],
        'portal_url': 'https://pmjay.gov.in',
        'is_active': True,
    },
    {
        'name': 'National OBC Scholarship',
        'category': 'education',
        'department': 'Ministry of Social Justice',
        'level': 'central',
        'state': '',
        'annual_benefit': 48000,
        'eligibility_summary': (
            'Pre-matric and post-matric scholarships for OBC students '
            'to support their education expenses.'
        ),
        'eligibility_rules': {
            'caste': ['obc'],
            'income_max': 300000,
            'age_min': 10,
            'age_max': 30,
        },
        'documents_required': [
            'Aadhaar',
            'Caste certificate',
            'Income certificate',
            'Marksheet',
            'Bank passbook',
        ],
        'portal_url': 'https://scholarships.gov.in',
        'is_active': True,
    },
    {
        'name': 'PM Ujjwala Yojana',
        'category': 'welfare',
        'department': 'Ministry of Petroleum',
        'level': 'central',
        'state': '',
        'annual_benefit': 3200,
        'eligibility_summary': (
            'Free LPG connection and initial subsidy for women from '
            'below poverty line households.'
        ),
        'eligibility_rules': {
            'bpl_required': False,
            'income_max': 200000,
        },
        'documents_required': [
            'Aadhaar',
            'BPL card or income certificate',
            'Bank passbook',
        ],
        'portal_url': 'https://pmuy.gov.in',
        'is_active': True,
    },
    {
        'name': 'Pradhan Mantri Jan Dhan Yojana (PMJDY)',
        'category': 'welfare',
        'department': 'Ministry of Finance',
        'level': 'central',
        'state': '',
        'annual_benefit': 10000,
        'eligibility_summary': (
            'Zero-balance savings account with RuPay debit card, '
            'accident insurance of ₹2 lakh and overdraft facility.'
        ),
        'eligibility_rules': {
            'age_min': 10,
        },
        'documents_required': [
            'Aadhaar',
        ],
        'portal_url': 'https://pmjdy.gov.in',
        'is_active': True,
    },
    {
        'name': 'Atal Pension Yojana',
        'category': 'pension',
        'department': 'PFRDA',
        'level': 'central',
        'state': '',
        'annual_benefit': 60000,
        'eligibility_summary': (
            'Guaranteed monthly pension of ₹1,000–₹5,000 for '
            'unorganised sector workers aged 18–40.'
        ),
        'eligibility_rules': {
            'age_min': 18,
            'age_max': 40,
            'occupation': ['farmer', 'labourer', 'skilled_trade', 'small_business', 'other'],
        },
        'documents_required': [
            'Aadhaar',
            'Bank account',
            'Mobile number',
        ],
        'portal_url': 'https://npscra.nsdl.co.in',
        'is_active': True,
    },
    {
        'name': 'PM SVANidhi (Street Vendor Micro-credit)',
        'category': 'welfare',
        'department': 'Ministry of Housing and Urban Affairs',
        'level': 'central',
        'state': '',
        'annual_benefit': 30000,
        'eligibility_summary': (
            'Collateral-free working capital loans up to ₹50,000 '
            'for street vendors to restart their businesses.'
        ),
        'eligibility_rules': {
            'occupation': ['small_business', 'labourer'],
            'income_max': 300000,
        },
        'documents_required': [
            'Aadhaar',
            'Vending certificate',
            'Bank account',
        ],
        'portal_url': 'https://pmsvanidhi.mohua.gov.in',
        'is_active': True,
    },
    {
        'name': 'National SC Scholarship',
        'category': 'education',
        'department': 'Ministry of Social Justice',
        'level': 'central',
        'state': '',
        'annual_benefit': 42000,
        'eligibility_summary': (
            'Pre-matric and post-matric scholarships for Scheduled Caste '
            'students to prevent drop-out and encourage higher education.'
        ),
        'eligibility_rules': {
            'caste': ['sc'],
            'income_max': 250000,
            'age_min': 10,
            'age_max': 35,
        },
        'documents_required': [
            'Aadhaar',
            'SC certificate',
            'Income certificate',
            'Marksheet',
            'Bank passbook',
        ],
        'portal_url': 'https://scholarships.gov.in',
        'is_active': True,
    },
    {
        'name': 'Maharashtra Ladki Bahin Yojana',
        'category': 'welfare',
        'department': 'Government of Maharashtra',
        'level': 'state',
        'state': 'maharashtra',
        'annual_benefit': 18000,
        'eligibility_summary': (
            '₹1,500 per month financial assistance to eligible women '
            'residents of Maharashtra aged 21–65.'
        ),
        'eligibility_rules': {
            'state': ['maharashtra'],
            'income_max': 250000,
            'age_min': 21,
            'age_max': 65,
        },
        'documents_required': [
            'Aadhaar',
            'Domicile certificate',
            'Income certificate',
            'Bank passbook',
        ],
        'portal_url': 'https://ladakibahin.maharashtra.gov.in',
        'is_active': True,
    },
]


class Command(BaseCommand):
    help = 'Seeds the database with 10 core government welfare schemes.'

    def handle(self, *args, **options):
        created_count = 0
        updated_count = 0

        for scheme_data in SCHEMES:
            name = scheme_data['name']
            obj, created = Scheme.objects.update_or_create(
                name=name,
                defaults=scheme_data,
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'  ✓ Created: {name}'))
            else:
                updated_count += 1
                self.stdout.write(self.style.WARNING(f'  ↺ Updated: {name}'))

        self.stdout.write(
            self.style.SUCCESS(
                f'\nDone. Created {created_count} schemes, updated {updated_count} schemes.'
            )
        )
