"""
ProfileAgent — Extracts structured civic profile data from natural language text.

Handles multi-lingual inputs (English, Hindi transliteration, Marathi, Tamil, Telugu)
and detects life events that might trigger a re-scan.
"""
import re
from typing import Optional, Dict, Any

from apps.profiles.models import CivicProfile


# ── Regex patterns for field extraction ───────────────────────────────────────

_PATTERNS: Dict[str, list] = {
    'age': [
        r'\b(\d{1,3})\s*(?:years?\s*old|sal|varsh|saal)\b',
        r'\bage\s*(?:is|:)?\s*(\d{1,3})\b',
        r'\bi\s*am\s*(\d{1,3})\b',
        r'\b(\d{1,3})\s*years?\b',
    ],
    'annual_income': [
        r'(?:income|earning|kamaata|kamata)\s*(?:is|:)?\s*(?:rs\.?|₹|inr)?\s*([\d,]+)',
        r'(?:rs\.?|₹|inr)\s*([\d,]+)\s*(?:per\s*year|annual|pa|p\.a\.)',
        r'([\d,]+)\s*(?:rs\.?|₹)\s*(?:per\s*year|annual|pa)',
        r'\b(\d+)\s*lakh\b',
        r'\b(\d+)\s*(?:thousand|hazaar|hazar)\b',
    ],
    'family_size': [
        r'family\s*(?:of|size|members?)?\s*(\d+)',
        r'(\d+)\s*(?:members?|persons?|log|jann?a?)\s*(?:in\s*family)?',
        r'(?:ghar\s*mein|hamare|amare)\s*(\d+)',
    ],
    'state': None,  # handled separately with keyword map
    'caste_category': None,  # handled with keyword map
    'occupation': None,  # handled with keyword map
}

_STATE_KEYWORDS = {
    'maharashtra': 'maharashtra',
    'gujarat': 'gujarat',
    'rajasthan': 'rajasthan',
    'punjab': 'punjab',
    'haryana': 'haryana',
    'uttar pradesh': 'uttar_pradesh',
    'up': 'uttar_pradesh',
    'bihar': 'bihar',
    'west bengal': 'west_bengal',
    'bengal': 'west_bengal',
    'tamil nadu': 'tamil_nadu',
    'tamilnadu': 'tamil_nadu',
    'karnataka': 'karnataka',
    'andhra': 'andhra_pradesh',
    'telangana': 'telangana',
    'kerala': 'kerala',
    'madhya pradesh': 'madhya_pradesh',
    'mp': 'madhya_pradesh',
    'odisha': 'odisha',
    'assam': 'assam',
    'jharkhand': 'jharkhand',
    'chhattisgarh': 'chhattisgarh',
    'uttarakhand': 'uttarakhand',
    'himachal': 'himachal_pradesh',
    'goa': 'goa',
    'delhi': 'delhi',
}

_CASTE_KEYWORDS = {
    'general': 'general',
    'gen': 'general',
    'open': 'general',
    'unreserved': 'general',
    'obc': 'obc',
    'other backward': 'obc',
    'sc': 'sc',
    'scheduled caste': 'sc',
    'dalit': 'sc',
    'harijan': 'sc',
    'st': 'st',
    'scheduled tribe': 'st',
    'adivasi': 'st',
    'tribal': 'st',
    'ews': 'ews',
    'economically weaker': 'ews',
    'nt': 'nt_dnt',
    'dnt': 'nt_dnt',
    'nomadic': 'nt_dnt',
    'vimukta': 'nt_dnt',
}

_OCCUPATION_KEYWORDS = {
    'farmer': 'farmer',
    'kisan': 'farmer',
    'shetkari': 'farmer',
    'agricultur': 'farmer',
    'labour': 'labourer',
    'laborer': 'labourer',
    'majdoor': 'labourer',
    'mazdoor': 'labourer',
    'skilled': 'skilled_trade',
    'technician': 'skilled_trade',
    'carpenter': 'skilled_trade',
    'plumber': 'skilled_trade',
    'electrician': 'skilled_trade',
    'mechanic': 'skilled_trade',
    'welder': 'skilled_trade',
    'business': 'small_business',
    'shop': 'small_business',
    'vendor': 'small_business',
    'trader': 'small_business',
    'vyapari': 'small_business',
    'salaried': 'salaried',
    'job': 'salaried',
    'employee': 'salaried',
    'government job': 'salaried',
    'private job': 'salaried',
    'unemployed': 'unemployed',
    'jobless': 'unemployed',
    'no job': 'unemployed',
    'berozgaar': 'unemployed',
}

_LIFE_EVENT_PATTERNS = {
    'new_baby': [r'\b(born|baby|newborn|naya bachcha|bachcha hua|navjaat)\b'],
    'job_loss': [r'\b(lost job|naukri gayi|berozgaar|laid off|retrenched|dismissed)\b'],
    'retirement': [r'\b(retired|retirement|niverutti|sevamukti|turned 60|turned 58)\b'],
    'marriage': [r'\b(married|shaadi|vivah|lagna|wedding)\b'],
    'widowed': [r'\b(widow|widower|husband died|wife died|vidhwa)\b'],
    'age_milestone': [r'\b(turned 18|turned 21|turned 40|turned 60|turned 65)\b'],
}


class ProfileAgent:
    """
    Extracts structured profile fields from free-text user messages.
    Updates the given CivicProfile in-place for each confidently extracted field.
    """

    def extract_fields(self, text: str, profile: CivicProfile) -> Dict[str, Any]:
        """
        Extract all recognisable profile fields from `text`.
        Updates `profile` for each field found with high confidence.
        Returns a dict of the extracted fields.
        """
        text_lower = text.lower()
        extracted: Dict[str, Any] = {}

        # Age
        age = self._extract_age(text_lower)
        if age:
            extracted['age'] = age
            profile.age = age

        # Annual income
        income = self._extract_income(text_lower)
        if income:
            extracted['annual_income'] = income
            profile.annual_income = income

        # Family size
        family_size = self._extract_family_size(text_lower)
        if family_size:
            extracted['family_size'] = family_size
            profile.family_size = family_size

        # State
        state = self._extract_from_keywords(text_lower, _STATE_KEYWORDS)
        if state:
            extracted['state'] = state
            profile.state = state

        # Caste
        caste = self._extract_from_keywords(text_lower, _CASTE_KEYWORDS)
        if caste:
            extracted['caste_category'] = caste
            profile.caste_category = caste

        # Occupation
        occupation = self._extract_from_keywords(text_lower, _OCCUPATION_KEYWORDS)
        if occupation:
            extracted['occupation'] = occupation
            profile.occupation = occupation

        # Boolean flags
        if any(kw in text_lower for kw in ['bpl card', 'bpl', 'below poverty', 'garib card']):
            if any(kw in text_lower for kw in ['have', 'hai', 'yes', 'haan', 'han', 'ahe']):
                extracted['bpl_card'] = True
                profile.bpl_card = True

        if any(kw in text_lower for kw in ['aadhaar linked', 'aadhar linked', 'bank linked', 'linked']):
            if any(kw in text_lower for kw in ['yes', 'haan', 'han', 'ahe', 'ho', 'aho']):
                extracted['aadhaar_linked'] = True
                profile.aadhaar_linked = True

        if extracted:
            profile.save()

        return extracted

    def detect_life_event(self, text: str) -> Optional[str]:
        """
        Scan text for life event keywords.
        Returns the event type string or None.
        """
        text_lower = text.lower()
        for event_type, patterns in _LIFE_EVENT_PATTERNS.items():
            for pattern in patterns:
                if re.search(pattern, text_lower):
                    return event_type
        return None

    # ──────────────────────────────────────────────────────────────────────────
    # Private helpers
    # ──────────────────────────────────────────────────────────────────────────

    def _extract_age(self, text: str) -> Optional[int]:
        for pattern in _PATTERNS['age']:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                try:
                    age = int(match.group(1))
                    if 5 <= age <= 110:
                        return age
                except ValueError:
                    continue
        return None

    def _extract_income(self, text: str) -> Optional[int]:
        # Check for lakh expressions first
        lakh_match = re.search(r'(\d+(?:\.\d+)?)\s*lakh', text, re.IGNORECASE)
        if lakh_match:
            try:
                return int(float(lakh_match.group(1)) * 100_000)
            except ValueError:
                pass

        # Thousand expressions
        thousand_match = re.search(
            r'(\d+(?:\.\d+)?)\s*(?:thousand|hazaar|hazar)', text, re.IGNORECASE
        )
        if thousand_match:
            try:
                return int(float(thousand_match.group(1)) * 1_000)
            except ValueError:
                pass

        # Raw number patterns
        for pattern in _PATTERNS['annual_income']:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                try:
                    raw = match.group(1).replace(',', '')
                    income = int(raw)
                    if 1_000 <= income <= 10_000_000:
                        return income
                except ValueError:
                    continue
        return None

    def _extract_family_size(self, text: str) -> Optional[int]:
        for pattern in _PATTERNS['family_size']:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                try:
                    size = int(match.group(1))
                    if 1 <= size <= 30:
                        return size
                except ValueError:
                    continue
        return None

    def _extract_from_keywords(self, text: str, keyword_map: dict) -> Optional[str]:
        """Match any keyword in `keyword_map` against `text`, return mapped value."""
        # Longer keys first to prefer specific matches
        for keyword in sorted(keyword_map.keys(), key=len, reverse=True):
            if keyword in text:
                return keyword_map[keyword]
        return None
