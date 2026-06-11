"""
Scholarship eligibility rule for OBC/SC/ST students.

Criteria:
  - Caste: OBC, SC, or ST
  - Age: 10–30
  - Has at least one child/student-age family member
"""
from typing import Dict, Any
from .base import BaseRule


class ScholarshipRule(BaseRule):
    """
    Evaluates eligibility for minority/OBC/SC/ST scholarship schemes.
    Requires specific caste categories and an age-appropriate student
    in the family.
    """

    ELIGIBLE_CASTES = {'obc', 'sc', 'st'}
    AGE_MIN = 10
    AGE_MAX = 30
    # Age range considered to be a student / child in family
    STUDENT_AGE_MIN = 5
    STUDENT_AGE_MAX = 28

    def check(self, profile, rules: Dict[str, Any]) -> bool:
        """
        Returns True if the profile or a family member is eligible
        for a scholarship under OBC/SC/ST categories.
        """
        # Caste check
        if profile.caste_category.lower() not in self.ELIGIBLE_CASTES:
            return False

        # Primary applicant age check (direct student)
        applicant_eligible = self.AGE_MIN <= profile.age <= self.AGE_MAX

        # Family member check: at least one child/student-age member
        has_student = False
        if hasattr(profile, 'family_members'):
            for member in profile.family_members.all():
                if self.STUDENT_AGE_MIN <= member.age <= self.STUDENT_AGE_MAX:
                    has_student = True
                    break

        # Pass if the applicant or a family member is in student age range
        if not applicant_eligible and not has_student:
            return False

        return True

    def get_description(self) -> str:
        return (
            f'Scholarship rule: caste in {self.ELIGIBLE_CASTES}, '
            f'age {self.AGE_MIN}–{self.AGE_MAX} or has child in family'
        )
