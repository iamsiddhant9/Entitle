from django.urls import path
from .views import SchemeListView, SchemeDetailView

urlpatterns = [
    path('', SchemeListView.as_view(), name='scheme-list'),
    path('<int:pk>/', SchemeDetailView.as_view(), name='scheme-detail'),
]
