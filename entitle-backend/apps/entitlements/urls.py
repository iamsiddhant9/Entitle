from django.urls import path
from .views import EntitlementListView, EntitlementDetailView, EntitlementApplyView

urlpatterns = [
    path('', EntitlementListView.as_view(), name='entitlement-list'),
    path('<int:pk>/', EntitlementDetailView.as_view(), name='entitlement-detail'),
    path('<int:pk>/apply/', EntitlementApplyView.as_view(), name='entitlement-apply'),
]
