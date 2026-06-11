"""
Pradhan Mantri Jan Arogya Yojana (PMJAY / Ayushman Bharat) eligibility rule.

Criteria:
  - Income <= ₹5,00,000 per year
  - Family size >= 1
  - All castes eligible
  - BPL card preferred (soft rule, not hard requirement)
"""
from typing import Dict, Any
from .base import BaseRule


class PMJAYRule(BaseRule):
    """
    Evaluates eligibility for PMJAY (Ayushman Bharat) health coverage.
    PMJAY is one of India's most inclusive schemes – the main barriers
    are income and residency, not caste.
    """

    INCOME_LIMIT = 500_000   # ₹5 lakh per annum
    FAMILY_SIZE_MIN = 1

    def check(self, profile, rules: Dict[str, Any]) -> bool:
        """
        Returns True if profile is eligible for PMJAY coverage.
        """
        # Income check
        if profile.annual_income > self.INCOME_LIMIT:
            return False

        # Family size check (practically always passes, but enforced)
        if profile.family_size < self.FAMILY_SIZE_MIN:
            return False

        # All castes are eligible – no caste restriction applied.
        # BPL card is preferred but NOT a hard disqualifier.

        return True

    def get_description(self) -> str:
        return (
            f'PMJAY rule: income ≤ ₹{self.INCOME_LIMIT:,}, '
            f'family_size ≥ {self.FAMILY_SIZE_MIN}, all castes eligible, '
            f'BPL preferred'
        )
