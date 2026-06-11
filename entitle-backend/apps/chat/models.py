from django.db import models


class Conversation(models.Model):
    """A conversation thread tied to a civic profile."""
    profile = models.ForeignKey(
        'profiles.CivicProfile',
        related_name='conversations',
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'conversations'
        ordering = ['-created_at']

    def __str__(self):
        return f'Conversation #{self.id} – {self.profile.name}'


class ChatMessage(models.Model):
    """A single message within a conversation."""
    ROLE_CHOICES = [
        ('user', 'User'),
        ('agent', 'Agent'),
    ]

    TYPE_CHOICES = [
        ('text', 'Text'),
        ('result_card', 'Result Card'),
    ]

    conversation = models.ForeignKey(
        Conversation,
        related_name='messages',
        on_delete=models.CASCADE,
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    message_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default='text',
    )
    result_data = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'chat_messages'
        ordering = ['created_at']

    def __str__(self):
        return f'[{self.role}] {self.content[:60]}'
