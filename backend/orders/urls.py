from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'orders', views.OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
    path('cart/', views.CartView.as_view(), name='cart'),
    path('cart/add/', views.AddToCartView.as_view(), name='cart-add'),
    path('cart/remove/<int:item_id>/', views.RemoveFromCartView.as_view(), name='cart-remove'),
    path('cart/update/<int:item_id>/', views.UpdateCartItemView.as_view(), name='cart-update'),
    path('checkout/', views.CheckoutView.as_view(), name='checkout'),
]
