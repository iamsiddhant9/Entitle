from django.urls import path
from .views import AssetListView, AssetClaimView

urlpatterns = [
    path('', AssetListView.as_view(), name='asset-list'),
    path('<int:pk>/claim/', AssetClaimView.as_view(), name='asset-claim'),
]
