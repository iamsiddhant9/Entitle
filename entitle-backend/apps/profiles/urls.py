from django.urls import path
from .views import ProfileCreateView, ProfileDetailView, ProfileScanView, ProfileSummaryView, DemoProfileView

urlpatterns = [
    path('', ProfileCreateView.as_view(), name='profile-create'),
    path('demo/', DemoProfileView.as_view(), name='profile-demo'),
    path('<int:pk>/', ProfileDetailView.as_view(), name='profile-detail'),
    path('<int:pk>/scan/', ProfileScanView.as_view(), name='profile-scan'),
    path('<int:pk>/summary/', ProfileSummaryView.as_view(), name='profile-summary'),
]
