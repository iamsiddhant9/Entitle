"""
Celery application instance for ENTITLE.
"""
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'entitle.settings.development')

app = Celery('entitle')

# Use Django settings with CELERY_ namespace
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks in all installed apps and the tasks/ package
app.autodiscover_tasks()
