from apps.profiles.models import CivicProfile
from apps.schemes.models import Scheme
from typing import Tuple, List


class EligibilityEngine:
    """
    Core rule-based engine that scores a CivicProfile against a Scheme's
    eligibility_rules JSON and returns (eligible: bool, confidence: float).
    """

    def score(self, profile: CivicProfile, scheme: Scheme) -> Tuple[bool, float]:
        """
        Returns (True, confidence) if profile meets all hard rules,
        otherwise (False, 0.0).
        Confidence is 0.0–1.0, reflecting how well soft rules are met.
        """
        rules = scheme.eligibility_rules
        if not rules:
            return True, 0.5

        checks = 0
        passed = 0
        soft_score = 1.0

        # ── HARD RULES ────────────────────────────────────────────────────────

        # Income cap
        if 'income_max' in rules and rules['income_max']:
            checks += 1
            if profile.annual_income <= rules['income_max']:
                passed += 1
            else:
                return False, 0.0

        # Caste restriction
        if 'caste' in rules and rules['caste']:
            checks += 1
            allowed = [c.lower() for c in rules['caste']]
            if profile.caste_category.lower() in allowed:
                passed += 1
            else:
                return False, 0.0

        # Age minimum
        if 'age_min' in rules and rules['age_min'] is not None:
            checks += 1
            if profile.age >= rules['age_min']:
                passed += 1
            else:
                return False, 0.0

        # Age maximum
        if 'age_max' in rules and rules['age_max'] is not None:
            checks += 1
            if profile.age <= rules['age_max']:
                passed += 1
            else:
                return False, 0.0

        # Occupation restriction
        if 'occupation' in rules and rules['occupation']:
            checks += 1
            allowed = [o.lower() for o in rules['occupation']]
            if profile.occupation.lower() in allowed:
                passed += 1
            else:
                return False, 0.0

        # State restriction
        if 'state' in rules and rules['state']:
            checks += 1
            allowed = [s.lower() for s in rules['state']]
            if profile.state.lower() in allowed:
                passed += 1
            else:
                return False, 0.0

        # BPL card required
        if rules.get('bpl_required'):
            checks += 1
            if profile.bpl_card:
                passed += 1
            else:
                return False, 0.0

        # ── SOFT RULES ────────────────────────────────────────────────────────

        # Land holding cap (soft – reduces confidence but doesn't disqualify)
        if (
            'land_max_hectares' in rules
            and rules['land_max_hectares'] is not None
            and profile.land_holding is not None
        ):
            checks += 1
            if float(profile.land_holding) <= rules['land_max_hectares']:
                passed += 1
            else:
                soft_score *= 0.7

        # Minimum family size (soft)
        if 'family_size_min' in rules and rules['family_size_min'] is not None:
            checks += 1
            if profile.family_size >= rules['family_size_min']:
                passed += 1
            else:
                soft_score *= 0.8

        # ── CONFIDENCE CALCULATION ────────────────────────────────────────────
        if checks > 0:
            confidence = (passed / checks) * soft_score
        else:
            confidence = 0.7  # No rules → moderate confidence

        confidence = max(0.1, min(1.0, confidence))
        return True, confidence

    def missing_documents(self, profile: CivicProfile, scheme: Scheme) -> List[str]:
        """
        Returns a list of documents the profile appears to be missing
        based on what is linked/available and what the scheme requires.
        """
        required = (
            scheme.documents_required
            if isinstance(scheme.documents_required, list)
            else []
        )

        # Determine what the profile has
        profile_docs: List[str] = []
        if profile.aadhaar_linked:
            profile_docs.extend(['aadhaar', 'aadhar'])
        if profile.pan_linked:
            profile_docs.extend(['pan'])
        if profile.bpl_card:
            profile_docs.extend(['bpl_card', 'bpl card', 'bpl'])

        missing = []
        for doc in required:
            doc_normalised = doc.lower().replace(' ', '_')
            # Check if any known doc token is in the normalised document name
            if not any(p in doc_normalised for p in profile_docs):
                missing.append(doc)

        return missing
