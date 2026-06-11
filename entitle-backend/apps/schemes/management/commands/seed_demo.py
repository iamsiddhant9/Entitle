"""
Management command to seed a demo profile with entitlements and unclaimed assets.
This also runs seed_schemes to ensure schemes exist first.

Usage:
    python manage.py seed_demo
"""
from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.utils.timezone import now


DEMO_PROFILE_NAME = 'Ramesh Kumar (Demo)'


class Command(BaseCommand):
    help = 'Seeds a demo profile with entitlements and unclaimed assets for showcase.'

    def handle(self, *args, **options):
        # 1. Ensure schemes exist
        self.stdout.write('Seeding schemes…')
        call_command('seed_schemes', verbosity=0)

        # 2. Import models
        from apps.profiles.models import CivicProfile
        from apps.schemes.models import Scheme
        from apps.entitlements.models import Entitlement
        from apps.assets.models import UnclaimedAsset

        # 3. Create or update demo profile
        profile, created = CivicProfile.objects.update_or_create(
            name=DEMO_PROFILE_NAME,
            defaults={
                'age': 34,
                'state': 'maharashtra',
                'district': 'pune',
                'caste_category': 'obc',
                'annual_income': 180000,
                'occupation': 'farmer',
                'land_holding': 1.5,
                'family_size': 4,
                'bpl_card': True,
                'aadhaar_linked': True,
                'pan_linked': True,
                'last_scanned': now(),
            }
        )
        action = 'Created' if created else 'Updated'
        self.stdout.write(self.style.SUCCESS(f'  ✓ {action} demo profile: {profile.name} (id={profile.id})'))

        # 4. Seed entitlements for well-known schemes
        ENTITLEMENT_DATA = [
            {
                'scheme_name': 'Pradhan Mantri Jan Arogya Yojana (PMJAY / Ayushman Bharat)',
                'confidence': 0.97,
                'status': 'eligible',
                'annual_amount': 500000,
            },
            {
                'scheme_name': 'PM-KISAN Samman Nidhi',
                'confidence': 0.95,
                'status': 'applied',
                'annual_amount': 6000,
                'application_ref': 'PMKISAN-2024-MH-038291',
            },
            {
                'scheme_name': 'PM Awas Yojana (Gramin)',
                'confidence': 0.91,
                'status': 'eligible',
                'annual_amount': 120000,
            },
            {
                'scheme_name': 'National OBC Scholarship',
                'confidence': 0.88,
                'status': 'eligible',
                'annual_amount': 48000,
            },
            {
                'scheme_name': 'Atal Pension Yojana',
                'confidence': 0.85,
                'status': 'approved',
                'annual_amount': 60000,
                'application_ref': 'APY-MH-2024-119482',
            },
            {
                'scheme_name': 'PM Ujjwala Yojana',
                'confidence': 0.93,
                'status': 'approved',
                'annual_amount': 3200,
                'application_ref': 'PMUY-2023-MH-554812',
            },
            {
                'scheme_name': 'Maharashtra Ladki Bahin Yojana',
                'confidence': 0.82,
                'status': 'needs_docs',
                'annual_amount': 18000,
                'missing_documents': ['Domicile certificate'],
            },
            {
                'scheme_name': 'Pradhan Mantri Jan Dhan Yojana (PMJDY)',
                'confidence': 0.99,
                'status': 'approved',
                'annual_amount': 10000,
                'application_ref': 'PMJDY-MH-2022-881234',
            },
        ]

        ent_created = 0
        ent_updated = 0
        for data in ENTITLEMENT_DATA:
            try:
                scheme = Scheme.objects.get(name=data['scheme_name'])
            except Scheme.DoesNotExist:
                self.stdout.write(self.style.WARNING(f'  ⚠ Scheme not found: {data["scheme_name"]}'))
                continue

            defaults = {
                'confidence': data['confidence'],
                'status': data['status'],
                'annual_amount': data['annual_amount'],
                'missing_documents': data.get('missing_documents', []),
                'application_ref': data.get('application_ref', ''),
            }
            if data.get('application_ref'):
                defaults['applied_at'] = now()

            ent, created = Entitlement.objects.update_or_create(
                profile=profile,
                scheme=scheme,
                defaults=defaults,
            )
            if created:
                ent_created += 1
            else:
                ent_updated += 1

        self.stdout.write(self.style.SUCCESS(
            f'  ✓ Entitlements: {ent_created} created, {ent_updated} updated'
        ))

        # 5. Seed unclaimed assets
        ASSET_DATA = [
            {
                'asset_type': 'bank_account',
                'institution': 'State Bank of India',
                'amount': 42500,
                'source': 'RBI',
                'reference': 'RBI-UDGAM-2024-SBI-0019283',
                'claim_instructions': 'Visit your nearest SBI branch with Aadhaar and account details.',
                'is_claimed': False,
            },
            {
                'asset_type': 'insurance',
                'institution': 'LIC of India',
                'amount': 75000,
                'source': 'IRDAI',
                'reference': 'IRDAI-LIC-2023-MH-884421',
                'claim_instructions': 'Submit Form 3783 at your nearest LIC office with policy details.',
                'is_claimed': False,
            },
            {
                'asset_type': 'dividend',
                'institution': 'Infosys Ltd',
                'amount': 8200,
                'source': 'SEBI',
                'reference': 'SEBI-IEPF-2024-INF-20291',
                'claim_instructions': 'File IEPF-5 form online at iepf.gov.in.',
                'is_claimed': False,
            },
        ]

        asset_created = 0
        asset_updated = 0
        for data in ASSET_DATA:
            asset, created = UnclaimedAsset.objects.update_or_create(
                profile=profile,
                reference=data['reference'],
                defaults={k: v for k, v in data.items() if k != 'reference'},
            )
            if created:
                asset_created += 1
            else:
                asset_updated += 1

        self.stdout.write(self.style.SUCCESS(
            f'  ✓ Assets: {asset_created} created, {asset_updated} updated'
        ))

        self.stdout.write(self.style.SUCCESS(
            f'\n✅ Demo seeding complete. Profile ID = {profile.id}'
        ))
