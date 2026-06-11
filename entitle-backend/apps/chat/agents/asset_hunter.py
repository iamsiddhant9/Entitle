"""
AssetHunterAgent — Discovers mock unclaimed financial assets for a CivicProfile.

In production, this would integrate with:
  - RBI UDGAM portal (unclaimed bank deposits)
  - IRDAI Bima Bharosa (unclaimed insurance)
  - SEBI SCORES / IEPF (unclaimed dividends)
  - Ministry of Labour EPFO (unclaimed PF/pension)

For now it generates realistic mock assets based on profile characteristics.
"""
import uuid
from typing import List

from apps.profiles.models import CivicProfile
from apps.assets.models import UnclaimedAsset


class AssetHunterAgent:
    """
    Generates realistic unclaimed asset records based on profile demographics.
    Assets are deduplicated by reference to avoid re-creating on re-scans.
    """

    def run(self, profile_id: int) -> List[UnclaimedAsset]:
        """
        Check for unclaimed assets for the given profile.
        Returns list of UnclaimedAsset records created/found.
        """
        profile = CivicProfile.objects.get(id=profile_id)
        assets_found: List[UnclaimedAsset] = []

        asset_specs = self._generate_asset_specs(profile)

        for spec in asset_specs:
            asset, _ = UnclaimedAsset.objects.get_or_create(
                profile=profile,
                reference=spec['reference'],
                defaults={
                    'asset_type': spec['asset_type'],
                    'institution': spec['institution'],
                    'amount': spec['amount'],
                    'source': spec['source'],
                    'claim_instructions': spec.get('claim_instructions', ''),
                    'is_claimed': False,
                },
            )
            assets_found.append(asset)

        return assets_found

    # ──────────────────────────────────────────────────────────────────────────
    # Asset generation logic
    # ──────────────────────────────────────────────────────────────────────────

    def _generate_asset_specs(self, profile: CivicProfile) -> list:
        """
        Build a list of mock asset spec dicts based on profile characteristics.
        Uses profile.id as seed component for deterministic but unique refs.
        """
        specs = []
        pid = profile.id

        # ── Everyone gets a small SEBI dividend ──────────────────────────────
        sebi_amount = 500 + (pid % 10) * 150  # ₹500–₹1,850
        specs.append({
            'asset_type': 'dividend',
            'institution': 'Reliance Industries Limited',
            'amount': sebi_amount,
            'source': 'SEBI',
            'reference': f'SEBI-DIV-{pid:06d}-RIL',
            'claim_instructions': (
                'Contact RIL Registrar (Link Intime India) with your folio '
                'number and Aadhaar to claim unpaid dividend.'
            ),
        })

        # ── OBC/SC/ST aged 40+: LIC policy (IRDAI) ──────────────────────────
        if profile.caste_category in ('obc', 'sc', 'st', 'nt_dnt') and profile.age >= 40:
            lic_amount = 8000 + (pid % 20) * 500  # ₹8,000–₹17,500
            specs.append({
                'asset_type': 'insurance',
                'institution': 'Life Insurance Corporation of India',
                'amount': lic_amount,
                'source': 'IRDAI',
                'reference': f'LIC-POL-{pid:07d}',
                'claim_instructions': (
                    'Visit your nearest LIC branch with policy number, '
                    'Aadhaar, and original bond to initiate the maturity/claim process.'
                ),
            })

        # ── Farmers: dormant cooperative bank account (RBI) ──────────────────
        if profile.occupation == 'farmer':
            bank_amount = 2000 + (pid % 15) * 300  # ₹2,000–₹6,200
            specs.append({
                'asset_type': 'bank_account',
                'institution': f'{profile.state.title()} State Cooperative Bank',
                'amount': bank_amount,
                'source': 'RBI',
                'reference': f'COOP-ACC-{pid:06d}-AGR',
                'claim_instructions': (
                    'Visit your local cooperative bank branch with Aadhaar, '
                    'passbook (if available), and land records to claim the dormant account.'
                ),
            })

        # ── Age 55+: old pension / PF account ────────────────────────────────
        if profile.age >= 55:
            pension_amount = 5000 + (pid % 25) * 400  # ₹5,000–₹14,600
            specs.append({
                'asset_type': 'pension',
                'institution': 'Employees Provident Fund Organisation (EPFO)',
                'amount': pension_amount,
                'source': 'RBI',
                'reference': f'EPFO-UAN-{pid:09d}',
                'claim_instructions': (
                    'Log in to the EPFO member portal (unifiedportal-mem.epfindia.gov.in) '
                    'with your UAN and Aadhaar-linked mobile to check and claim any '
                    'unclaimed PF balance.'
                ),
            })

        # ── Low-income labourers: construction welfare fund ───────────────────
        if profile.occupation == 'labourer' and profile.annual_income <= 200_000:
            welfare_amount = 3000 + (pid % 10) * 200  # ₹3,000–₹4,800
            specs.append({
                'asset_type': 'bank_account',
                'institution': f'{profile.state.title()} Building & Other Construction Workers Welfare Board',
                'amount': welfare_amount,
                'source': 'RBI',
                'reference': f'BOCW-{pid:06d}-{profile.state[:3].upper()}',
                'claim_instructions': (
                    'Register on the BOCW Welfare Board portal for your state and '
                    'submit your Aadhaar, BOCW registration card, and bank details '
                    'to claim unclaimed welfare benefits.'
                ),
            })

        return specs
