"""
URL configuration for ENTITLE project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.users.urls')),
    path('api/profiles/', include('apps.profiles.urls')),
    path('api/schemes/', include('apps.schemes.urls')),
    path('api/entitlements/', include('apps.entitlements.urls')),
    path('api/assets/', include('apps.assets.urls')),
    path('api/chat/', include('apps.chat.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
    path('api/health/', lambda r: __import__('django.http').http.HttpResponse("OK")),
]
