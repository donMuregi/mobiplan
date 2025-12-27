from rest_framework import serializers
from .models import Sacco, PaymentTimeline, FinancingRequest


class SaccoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sacco
        fields = ['id', 'name', 'slug', 'description', 'logo', 'is_active']


class PaymentTimelineSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentTimeline
        fields = ['id', 'months', 'label', 'is_active']


class FinancingRequestSerializer(serializers.ModelSerializer):
    sacco_name = serializers.CharField(read_only=True)
    timeline_months = serializers.IntegerField(source='payment_months', read_only=True)
    full_name = serializers.CharField(read_only=True)
    
    class Meta:
        model = FinancingRequest
        fields = [
            'id', 'request_number', 'user', 'product', 'product_name', 'product_price',
            'sacco', 'sacco_name', 'payment_timeline', 'payment_months', 'timeline_months',
            'monthly_payment', 'status', 'first_name', 'last_name', 'full_name',
            'email', 'phone_number', 'national_id', 'town_of_residence',
            'variation', 'variation_details', 'customer_notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['request_number', 'user', 'product_name', 'product_price', 'sacco_name', 'payment_months', 'monthly_payment', 'created_at', 'updated_at']


class CreateFinancingRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancingRequest
        fields = [
            'product', 'variation', 'sacco', 'payment_timeline',
            'first_name', 'last_name', 'phone_number', 'email', 
            'national_id', 'town_of_residence', 'customer_notes'
        ]
    
    def create(self, validated_data):
        # Get product details
        product = validated_data['product']
        variation = validated_data.get('variation')
        sacco = validated_data['sacco']
        timeline = validated_data['payment_timeline']
        
        # Get price
        if variation and variation.price:
            price = variation.price
        else:
            price = product.current_price
        
        # Store snapshot data
        validated_data['product_name'] = product.name
        validated_data['product_price'] = price
        validated_data['sacco_name'] = sacco.name
        validated_data['payment_months'] = timeline.months
        
        # Variation details
        if variation:
            variation_parts = [f"{av.attribute_name}: {av.value}" for av in variation.attribute_values.all()]
            validated_data['variation_details'] = ', '.join(variation_parts)
        
        return super().create(validated_data)
