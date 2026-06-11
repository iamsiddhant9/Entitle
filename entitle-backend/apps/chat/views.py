from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Conversation, ChatMessage
from .serializers import ChatMessageSerializer, ConversationSerializer
from apps.profiles.models import CivicProfile


class ChatMessageView(APIView):
    """
    POST /api/chat/message/
    Body: { "profile_id": 1, "message": "Hello" }

    Runs the CoordinatorAgent with the user's message and returns
    the agent's response. Creates a Conversation if one doesn't exist.
    """
    def post(self, request, *args, **kwargs):
        profile_id = request.data.get('profile_id')
        user_message = request.data.get('message', '').strip()

        if not user_message:
            return Response(
                {'detail': 'Message cannot be empty.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        profile = None
        if profile_id == 'onboard':
            from apps.chat.agents.coordinator import _MOCK_RESPONSES, _MOCK_PROFILE_COMPLETE
            from django.utils.timezone import now
            import uuid
            
            msg_count = request.data.get('msg_count', 0)
            idx = (msg_count + 1) // 2
            
            if idx < len(_MOCK_RESPONSES):
                content = _MOCK_RESPONSES[idx]
            else:
                import re
                content = re.sub(r'<PROFILE_COMPLETE>.*?</PROFILE_COMPLETE>', '', _MOCK_PROFILE_COMPLETE, flags=re.DOTALL).strip()

            return Response({
                'id': str(uuid.uuid4()),
                'role': 'agent',
                'content': content,
                'message_type': 'text',
                'result_data': None,
                'created_at': now().isoformat(),
            }, status=status.HTTP_200_OK)
        elif profile_id:
            try:
                profile = CivicProfile.objects.get(pk=profile_id)
            except (CivicProfile.DoesNotExist, ValueError):
                return Response(
                    {'detail': 'Profile not found.'},
                    status=status.HTTP_404_NOT_FOUND,
                )

        # Get or create conversation
        if profile:
            conversation, _ = Conversation.objects.get_or_create(profile=profile)
        else:
            # If no profile yet, we can't persist; return error guidance
            return Response(
                {'detail': 'profile_id is required to start a conversation.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Run coordinator agent
        from apps.chat.agents.coordinator import CoordinatorAgent
        result = CoordinatorAgent().respond(profile, conversation, user_message)

        return Response(result, status=status.HTTP_200_OK)


class ChatHistoryView(APIView):
    """
    GET /api/chat/history/?profile=<id>
    Returns the full conversation history for a profile.
    """
    def get(self, request, *args, **kwargs):
        profile_id = request.query_params.get('profile')
        if not profile_id:
            return Response(
                {'detail': 'profile query param is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            profile = CivicProfile.objects.get(pk=profile_id)
        except CivicProfile.DoesNotExist:
            return Response(
                {'detail': 'Profile not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            conversation = Conversation.objects.get(profile=profile)
        except Conversation.DoesNotExist:
            return Response({'messages': [], 'conversation_id': None})

        messages = ChatMessage.objects.filter(
            conversation=conversation
        ).order_by('created_at')

        return Response({
            'conversation_id': conversation.id,
            'profile_id': profile.id,
            'messages': ChatMessageSerializer(messages, many=True).data,
        })
