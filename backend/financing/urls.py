from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'saccos', views.SaccoViewSet, basename='sacco')
router.register(r'financing-requests', views.FinancingRequestViewSet, basename='financing-request')

urlpatterns = [
    path('', include(router.urls)),
    path('payment-timelines/', views.PaymentTimelineListView.as_view(), name='payment-timelines'),
]
