"""
PM-KISAN Samman Nidhi eligibility rule implementation.

Criteria:
  - Income <= ₹2,00,000 per year
  - Occupation: farmer
  - Land holding: < 2 hectares
  - Age: 18–70 years
"""
from typing import Dict, Any
from .base import BaseRule


class PMKisanRule(BaseRule):
    """
    Evaluates eligibility for PM-KISAN Samman Nidhi scheme.
    All four conditions must be satisfied for the rule to pass.
    """

    INCOME_LIMIT = 200_000   # ₹2 lakh per annum
    LAND_LIMIT = 2.0         # hectares
    AGE_MIN = 18
    AGE_MAX = 70
    ALLOWED_OCCUPATIONS = {'farmer'}

    def check(self, profile, rules: Dict[str, Any]) -> bool:
        """
        Returns True only if profile meets all PM-KISAN hard criteria.
        """
        # Income check
        if profile.annual_income > self.INCOME_LIMIT:
            return False

        # Occupation check
        if profile.occupation.lower() not in self.ALLOWED_OCCUPATIONS:
            return False

        # Land holding check (must be provided and < 2 ha)
        if profile.land_holding is None:
            return False
        if float(profile.land_holding) >= self.LAND_LIMIT:
            return False

        # Age check
        if profile.age < self.AGE_MIN or profile.age > self.AGE_MAX:
            return False

        return True

    def get_description(self) -> str:
        return (
            f'PM-KISAN rule: income ≤ ₹{self.INCOME_LIMIT:,}, '
            f'farmer, land < {self.LAND_LIMIT} ha, age {self.AGE_MIN}–{self.AGE_MAX}'
        )
