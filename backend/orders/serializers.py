from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem
from store.serializers import ProductListSerializer


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    variation_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    unit_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = [
            'id', 'product', 'product_id', 'variation', 'variation_id',
            'quantity', 'unit_price', 'subtotal', 'added_at'
        ]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    total_items = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total', 'total_items', 'created_at', 'updated_at']


class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    variation_id = serializers.IntegerField(required=False, allow_null=True)
    quantity = serializers.IntegerField(default=1, min_value=1)


class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_name', 'variation_details',
            'quantity', 'unit_price', 'subtotal'
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'full_name', 'email', 'phone',
            'first_name', 'last_name',
            'shipping_address', 'shipping_city', 'shipping_county', 'shipping_postal_code',
            'subtotal', 'shipping_cost', 'tax', 'total',
            'status', 'payment_status', 'payment_method',
            'customer_notes', 'items',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['order_number', 'status', 'payment_status', 'subtotal', 'total']


class CheckoutSerializer(serializers.Serializer):
    """Serializer for checkout process"""
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    shipping_address = serializers.CharField()
    shipping_city = serializers.CharField(max_length=100)
    shipping_county = serializers.CharField(max_length=100, required=False, allow_blank=True)
    shipping_postal_code = serializers.CharField(max_length=20, required=False, allow_blank=True)
    customer_notes = serializers.CharField(required=False, allow_blank=True)
    payment_method = serializers.CharField(max_length=50)
