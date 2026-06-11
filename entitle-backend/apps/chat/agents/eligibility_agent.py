"""
EligibilityAgent — Scans all active schemes against a CivicProfile
and creates/updates Entitlement records.
"""
from django.utils.timezone import now

from apps.profiles.models import CivicProfile
from apps.schemes.models import Scheme
from apps.entitlements.models import Entitlement
from apps.schemes.eligibility.engine import EligibilityEngine


class EligibilityAgent:
    """
    Runs the EligibilityEngine against every active Scheme for a given profile.
    Creates or updates Entitlement records for all schemes where
    eligible=True and confidence >= 0.3.
    """

    CONFIDENCE_THRESHOLD = 0.3

    def run(self, profile_id: int):
        """
        Scan all active schemes for profile_id.
        Returns a list of Entitlement instances (newly created or updated).
        """
        profile = CivicProfile.objects.get(id=profile_id)
        schemes = Scheme.objects.filter(is_active=True)
        engine = EligibilityEngine()
        created_entitlements = []

        for scheme in schemes:
            eligible, confidence = engine.score(profile, scheme)

            if eligible and confidence >= self.CONFIDENCE_THRESHOLD:
                missing_docs = engine.missing_documents(profile, scheme)
                entitlement, _ = Entitlement.objects.update_or_create(
                    profile=profile,
                    scheme=scheme,
                    defaults={
                        'confidence': confidence,
                        'annual_amount': scheme.annual_benefit,
                        'missing_documents': missing_docs,
                        'status': 'eligible',
                    },
                )
                created_entitlements.append(entitlement)

        # Update last_scanned timestamp
        profile.last_scanned = now()
        profile.save(update_fields=['last_scanned'])

        # Sort by annual_amount descending
        created_entitlements.sort(key=lambda e: e.annual_amount, reverse=True)
        return created_entitlements
