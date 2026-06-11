"""
FormFillAgent — Pre-fills government application forms from a CivicProfile
and generates a reference number for tracking.
"""
import uuid
from typing import Dict, Any

from apps.entitlements.models import Entitlement


class FormFillAgent:
    """
    Simulates form pre-filling for government scheme applications.
    In production this would integrate with NIC/DigiLocker APIs.
    For now it returns a mock-filled form with a generated reference.
    """

    REF_PREFIX = 'ENTITLE'

    def fill(self, entitlement: Entitlement) -> Dict[str, Any]:
        """
        Pre-fill application form data from the profile linked to this entitlement.
        Returns a dict with ref, form_data, and status.
        """
        profile = entitlement.profile
        scheme = entitlement.scheme

        # Generate unique application reference
        ref_suffix = uuid.uuid4().hex[:8].upper()
        ref = f'{self.REF_PREFIX}-{ref_suffix}'

        # Build pre-filled form data
        form_data = self._build_form_data(profile, scheme)

        return {
            'ref': ref,
            'form_data': form_data,
            'status': 'submitted',
            'scheme_name': scheme.name,
            'portal_url': scheme.portal_url,
        }

    def _build_form_data(self, profile, scheme) -> Dict[str, Any]:
        """Assemble a pre-filled form dict from the profile fields."""
        form: Dict[str, Any] = {
            # Personal details
            'applicant_name': profile.name,
            'age': profile.age,
            'state': profile.state,
            'district': profile.district,
            'caste_category': profile.get_caste_category_display(),
            'annual_income': profile.annual_income,
            'occupation': profile.get_occupation_display(),
            'family_size': profile.family_size,
            # Documents available
            'aadhaar_linked': profile.aadhaar_linked,
            'pan_linked': profile.pan_linked,
            'bpl_card': profile.bpl_card,
            # Scheme-specific
            'scheme_name': scheme.name,
            'scheme_category': scheme.category,
            'scheme_department': scheme.department,
            # Missing documents (need to be provided by user)
            'missing_documents': getattr(
                profile.entitlements.filter(scheme=scheme).first(),
                'missing_documents',
                []
            ),
        }

        # Add land holding if present (relevant for agriculture schemes)
        if profile.land_holding is not None:
            form['land_holding_hectares'] = float(profile.land_holding)

        # Add family members summary
        if hasattr(profile, 'family_members') and profile.family_members.exists():
            form['family_members'] = [
                {
                    'name': m.name,
                    'age': m.age,
                    'relation': m.relation,
                    'occupation': m.occupation,
                }
                for m in profile.family_members.all()
            ]

        return form
