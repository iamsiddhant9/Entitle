"""
CoordinatorAgent — The primary chat brain of ENTITLE.

Routes user messages through Claude (or a mock fallback), detects
the PROFILE_COMPLETE signal, triggers the EligibilityAgent, and
returns structured result cards.
"""
import os
import re
import json
from typing import Optional

from apps.profiles.models import CivicProfile
from apps.chat.models import Conversation, ChatMessage

SYSTEM_PROMPT = """
You are ENTITLE, an agentic civic rights engine for Indian citizens.
Your goal is to help users discover and claim all government schemes, 
benefits, and unclaimed assets they are entitled to.

You need to gather the following information to build a complete civic profile:
- Full name
- Age
- State and district of residence
- Caste category (General/OBC/SC/ST/EWS/NT-DNT)
- Annual household income (in rupees)
- Occupation (Farmer/Labourer/Skilled Trade/Small Business/Salaried/Unemployed/Other)
- Land holding in hectares (if farmer)
- Family size (number of people)
- Whether they have a BPL card
- Whether Aadhaar is linked to bank
- Whether PAN is linked

Ask conversationally, in plain language. Accept answers in English, Hindi (transliterated), 
Marathi, Tamil, or Telugu. Once you have all key fields, declare the profile complete.

When profile is complete, output a JSON block like:
<PROFILE_COMPLETE>
{"name": "...", "age": 48, "state": "maharashtra", "district": "satara",
 "caste_category": "obc", "annual_income": 120000, "occupation": "skilled_trade",
 "family_size": 4, "bpl_card": false, "aadhaar_linked": true, "pan_linked": false}
</PROFILE_COMPLETE>

After scanning, you will be given a list of entitlements. Present them clearly.
Be warm, helpful, and in plain language. This is for people who have never 
successfully claimed a government benefit before.
"""

_MOCK_RESPONSES = [
    (
        "Namaste! I'm ENTITLE, your civic rights agent. I'll help you find every "
        "government scheme and benefit you're entitled to — completely free. "
        "Let's start: what is your name, and how old are you?"
    ),
    (
        "Thank you! Which state and district do you live in, and what is your "
        "caste category? (General, OBC, SC, ST, EWS, or NT/DNT)"
    ),
    (
        "Got it. What is your approximate annual household income in rupees, "
        "and what is your occupation? (Farmer, Labourer, Skilled Trade, "
        "Small Business, Salaried, or Unemployed)"
    ),
    (
        "Almost there! How many people are in your family? And do you have a "
        "BPL card? Is your Aadhaar linked to your bank account?"
    ),
]

_MOCK_PROFILE_COMPLETE = """Perfect! I have all the details I need. Let me scan all schemes for you now.

<PROFILE_COMPLETE>
{"name": "Demo User", "age": 48, "state": "maharashtra", "district": "satara", "caste_category": "obc", "annual_income": 120000, "occupation": "skilled_trade", "family_size": 4, "bpl_card": false, "aadhaar_linked": true, "pan_linked": false}
</PROFILE_COMPLETE>"""


class CoordinatorAgent:
    """
    Orchestrates the full ENTITLE conversation flow:
    1. Collects profile info conversationally (via Claude or mock)
    2. Detects PROFILE_COMPLETE signal
    3. Updates profile + runs EligibilityAgent + AssetHunterAgent
    4. Returns structured result card
    """

    def __init__(self):
        self.api_key = os.environ.get('GROQ_API_KEY', '')

    def respond(
        self,
        profile: Optional[CivicProfile],
        conversation: Conversation,
        user_message: str,
    ) -> dict:
        """
        Process a user message and return the agent's response dict.
        Saves both user and agent messages to the DB.
        """
        # 1. Build history for LLM
        history = []
        for msg in conversation.messages.order_by('created_at'):
            history.append({
                'role': 'user' if msg.role == 'user' else 'assistant',
                'content': msg.content,
            })
        history.append({'role': 'user', 'content': user_message})

        # 2. Persist the user message
        ChatMessage.objects.create(
            conversation=conversation,
            role='user',
            content=user_message,
            message_type='text',
        )

        # 3. Call Groq or fall back to mock
        agent_content = self._call_groq(history)
        if agent_content is None:
            agent_content = self._mock_response(conversation)

        # 4. Detect PROFILE_COMPLETE signal
        result_data = None
        message_type = 'text'

        if '<PROFILE_COMPLETE>' in agent_content and profile:
            agent_content, result_data, message_type = self._handle_profile_complete(
                agent_content, profile
            )

        # 5. Persist agent response
        agent_msg = ChatMessage.objects.create(
            conversation=conversation,
            role='agent',
            content=agent_content,
            message_type=message_type,
            result_data=result_data,
        )

        return {
            'id': agent_msg.id,
            'role': 'agent',
            'content': agent_content,
            'message_type': message_type,
            'result_data': result_data,
            'created_at': agent_msg.created_at.isoformat(),
        }

    # ──────────────────────────────────────────────────────────────────────────
    # Internal helpers
    # ──────────────────────────────────────────────────────────────────────────

    def _call_groq(self, history: list) -> Optional[str]:
        """Try calling the Groq API. Returns None on any failure."""
        if not self.api_key or self.api_key == 'your-groq-api-key-here':
            return None
        try:
            import groq
            client = groq.Groq(api_key=self.api_key)
            
            messages = [{'role': 'system', 'content': SYSTEM_PROMPT}] + history
            
            response = client.chat.completions.create(
                model='llama3-70b-8192',
                max_tokens=1024,
                messages=messages,
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Groq API Error: {e}")
            return None

    def _mock_response(self, conversation: Conversation) -> str:
        """
        Returns canned responses in sequence, ending with a PROFILE_COMPLETE
        trigger after all questions have been asked.
        """
        msg_count = conversation.messages.count()
        if msg_count <= len(_MOCK_RESPONSES):
            return _MOCK_RESPONSES[min(msg_count - 1, len(_MOCK_RESPONSES) - 1)]
        return _MOCK_PROFILE_COMPLETE

    def _handle_profile_complete(
        self,
        agent_content: str,
        profile: CivicProfile,
    ):
        """
        Parse PROFILE_COMPLETE JSON, update profile, run agents,
        build result card. Returns (cleaned_content, result_data, message_type).
        """
        match = re.search(
            r'<PROFILE_COMPLETE>(.*?)</PROFILE_COMPLETE>',
            agent_content,
            re.DOTALL,
        )
        result_data = None
        message_type = 'text'

        if match:
            try:
                profile_data = json.loads(match.group(1).strip())
                self._update_profile(profile, profile_data)

                # Run eligibility scan
                from apps.chat.agents.eligibility_agent import EligibilityAgent
                entitlements = EligibilityAgent().run(profile.id)

                # Run asset hunter
                from apps.chat.agents.asset_hunter import AssetHunterAgent
                AssetHunterAgent().run(profile.id)

                result_data = self._build_result_data(entitlements, profile)
                message_type = 'result_card'

                # Strip the XML tag from the message
                agent_content = agent_content.replace(match.group(0), '').strip()
                if not agent_content:
                    agent_content = (
                        f"Scanning complete! I found {len(entitlements)} schemes "
                        f"you're eligible for. Here's your entitlement summary:"
                    )
            except Exception:
                pass  # Silently continue; content already set

        return agent_content, result_data, message_type

    def _update_profile(self, profile: CivicProfile, data: dict):
        """Apply extracted profile fields to the CivicProfile instance."""
        field_map = {
            'name': 'name',
            'age': 'age',
            'state': 'state',
            'district': 'district',
            'caste_category': 'caste_category',
            'annual_income': 'annual_income',
            'occupation': 'occupation',
            'family_size': 'family_size',
            'bpl_card': 'bpl_card',
            'aadhaar_linked': 'aadhaar_linked',
            'pan_linked': 'pan_linked',
            'land_holding': 'land_holding',
        }
        for key, field in field_map.items():
            if key in data and data[key] is not None:
                setattr(profile, field, data[key])
        profile.save()

    def _build_result_data(self, entitlements, profile: CivicProfile) -> dict:
        """Assemble the result card payload."""
        from apps.assets.models import UnclaimedAsset

        total_schemes = sum(e.annual_amount for e in entitlements)
        assets = UnclaimedAsset.objects.filter(profile=profile, is_claimed=False)
        asset_total = sum(a.amount for a in assets)

        return {
            'total_amount': total_schemes + asset_total,
            'scheme_count': len(entitlements),
            'asset_count': assets.count(),
            'entitlements': [
                {
                    'id': e.id,
                    'scheme_name': e.scheme.name,
                    'annual_amount': e.annual_amount,
                    'confidence': round(e.confidence, 2),
                    'status': e.status,
                    'category': e.scheme.category,
                    'portal_url': e.scheme.portal_url,
                }
                for e in entitlements[:6]
            ],
            'unclaimed_assets': [
                {
                    'id': a.id,
                    'institution': a.institution,
                    'amount': a.amount,
                    'source': a.source,
                    'asset_type': a.asset_type,
                }
                for a in assets[:3]
            ],
        }
