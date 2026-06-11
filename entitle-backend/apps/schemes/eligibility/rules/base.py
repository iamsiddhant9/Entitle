"""
Abstract base class for scheme eligibility rules.
All concrete rule implementations must inherit from BaseRule.
"""
from abc import ABC, abstractmethod
from typing import Dict, Any


class BaseRule(ABC):
    """
    Abstract base for a single eligibility check.

    Each rule is responsible for one logical domain (income, caste, etc.).
    The engine may compose multiple rules to evaluate a scheme.
    """

    @abstractmethod
    def check(self, profile, rules: Dict[str, Any]) -> bool:
        """
        Evaluate this rule against the given profile and rule configuration.

        :param profile: CivicProfile instance.
        :param rules: The eligibility_rules dict from the Scheme model.
        :return: True if the profile passes this rule, False otherwise.
        """
        raise NotImplementedError

    def get_description(self) -> str:
        """Human-readable description of what this rule checks."""
        return self.__class__.__name__
