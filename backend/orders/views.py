from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem, Order, OrderItem
from .serializers import (
    CartSerializer, AddToCartSerializer, UpdateCartItemSerializer,
    OrderSerializer, CheckoutSerializer
)
from store.models import Product, ProductVariation


def get_or_create_cart(request):
    """Get or create cart for user or session"""
    if request.user.is_authenticated:
        cart, created = Cart.objects.get_or_create(user=request.user)
    else:
        session_key = request.session.session_key
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        cart, created = Cart.objects.get_or_create(session_key=session_key)
    return cart


class CartView(APIView):
    """View and manage shopping cart"""
    permission_classes = [AllowAny]

    def get(self, request):
        cart = get_or_create_cart(request)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class AddToCartView(APIView):
    """Add item to cart"""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        cart = get_or_create_cart(request)
        product = get_object_or_404(Product, id=serializer.validated_data['product_id'], is_active=True)
        
        variation = None
        variation_id = serializer.validated_data.get('variation_id')
        if variation_id:
            variation = get_object_or_404(ProductVariation, id=variation_id, product=product)
        
        # Check if item already exists in cart
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            variation=variation,
            defaults={'quantity': serializer.validated_data['quantity']}
        )
        
        if not created:
            cart_item.quantity += serializer.validated_data['quantity']
            cart_item.save()
        
        return Response({
            'message': 'Item added to cart',
            'cart': CartSerializer(cart).data
        }, status=status.HTTP_201_CREATED)


class RemoveFromCartView(APIView):
    """Remove item from cart"""
    permission_classes = [AllowAny]

    def delete(self, request, item_id):
        cart = get_or_create_cart(request)
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        cart_item.delete()
        return Response({
            'message': 'Item removed from cart',
            'cart': CartSerializer(cart).data
        })


class UpdateCartItemView(APIView):
    """Update cart item quantity"""
    permission_classes = [AllowAny]

    def patch(self, request, item_id):
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        cart = get_or_create_cart(request)
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        cart_item.quantity = serializer.validated_data['quantity']
        cart_item.save()
        
        return Response({
            'message': 'Cart updated',
            'cart': CartSerializer(cart).data
        })


class CheckoutView(APIView):
    """Process checkout"""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        cart = get_or_create_cart(request)
        
        if not cart.items.exists():
            return Response(
                {'error': 'Cart is empty'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calculate totals
        subtotal = cart.total
        shipping_cost = 0  # Can be calculated based on location
        tax = 0  # Can be calculated based on rules
        total = subtotal + shipping_cost + tax
        
        # Create order
        order = Order.objects.create(
            user=request.user if request.user.is_authenticated else None,
            email=serializer.validated_data['email'],
            phone=serializer.validated_data['phone'],
            first_name=serializer.validated_data['first_name'],
            last_name=serializer.validated_data['last_name'],
            shipping_address=serializer.validated_data['shipping_address'],
            shipping_city=serializer.validated_data['shipping_city'],
            shipping_county=serializer.validated_data.get('shipping_county', ''),
            shipping_postal_code=serializer.validated_data.get('shipping_postal_code', ''),
            customer_notes=serializer.validated_data.get('customer_notes', ''),
            payment_method=serializer.validated_data['payment_method'],
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            tax=tax,
            total=total,
        )
        
        # Create order items
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                product_name=cart_item.product.name,
                variation_details=cart_item.variation.variation_name if cart_item.variation else '',
                quantity=cart_item.quantity,
                unit_price=cart_item.unit_price,
                subtotal=cart_item.subtotal,
            )
        
        # Clear cart
        cart.items.all().delete()
        
        # TODO: Send confirmation email
        
        return Response({
            'message': 'Order placed successfully',
            'order': OrderSerializer(order).data
        }, status=status.HTTP_201_CREATED)


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for viewing orders"""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')
