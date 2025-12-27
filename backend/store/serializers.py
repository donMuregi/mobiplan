from rest_framework import serializers
from .models import (
    Category, Brand, Attribute, AttributeValue,
    Product, ProductImage, ProductVariation, HomepageSlider
)


def get_category_product_count(category):
    """Recursively count all products in category and its descendants"""
    count = category.products.filter(is_active=True).count()
    for child in category.children.filter(is_active=True):
        count += get_category_product_count(child)
    return count


class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'image',
            'parent', 'children', 'is_active', 'product_count'
        ]

    def get_children(self, obj):
        children = obj.children.filter(is_active=True)
        return CategorySerializer(children, many=True).data

    def get_product_count(self, obj):
        # Count products in this category and all subcategories
        return get_category_product_count(obj)


class BrandSerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'logo', 'description', 'is_active', 'product_count']

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class AttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attribute
        fields = ['id', 'name', 'slug']


class AttributeValueSerializer(serializers.ModelSerializer):
    attribute_name = serializers.CharField(source='attribute.name', read_only=True)

    class Meta:
        model = AttributeValue
        fields = ['id', 'attribute', 'attribute_name', 'value', 'slug', 'color_code']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']


class ProductVariationSerializer(serializers.ModelSerializer):
    attribute_values = AttributeValueSerializer(many=True, read_only=True)
    price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    variation_name = serializers.CharField(read_only=True)

    class Meta:
        model = ProductVariation
        fields = [
            'id', 'attribute_values', 'price_override', 'price',
            'sku', 'stock_quantity', 'is_active', 'image', 'variation_name'
        ]


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for product listing"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    current_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    variations_summary = serializers.SerializerMethodField()
    main_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'short_description',
            'base_price', 'sale_price', 'current_price', 'discount_percentage',
            'category', 'category_name', 'brand', 'brand_name',
            'main_image', 'is_in_stock', 'is_featured', 'is_new',
            'allow_financing', 'variations_summary'
        ]

    def get_main_image(self, obj):
        """Get main image from model field or primary image from related images"""
        # First check the main_image field on the model
        if obj.main_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.main_image.url)
            return obj.main_image.url
        # Fall back to primary image from ProductImage relation
        primary_image = obj.images.filter(is_primary=True).first()
        if not primary_image:
            primary_image = obj.images.first()
        if primary_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary_image.image.url)
            return primary_image.image.url
        return None

    def get_variations_summary(self, obj):
        """Get a summary of available variations grouped by attribute"""
        variations = obj.variations.filter(is_active=True)
        if not variations.exists():
            return {}
        
        # Group by attribute
        result = {}
        for variation in variations:
            for attr_value in variation.attribute_values.all():
                attr_name = attr_value.attribute.name
                if attr_name not in result:
                    result[attr_name] = []
                value_data = {
                    'id': attr_value.id,
                    'value': attr_value.value,
                    'color_code': attr_value.color_code
                }
                if value_data not in result[attr_name]:
                    result[attr_name].append(value_data)
        return result


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full serializer for single product view"""
    category = CategorySerializer(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    brand = BrandSerializer(read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    attributes = AttributeValueSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variations = ProductVariationSerializer(many=True, read_only=True)
    variations_summary = serializers.SerializerMethodField()
    current_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    main_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'short_description',
            'base_price', 'sale_price', 'current_price', 'discount_percentage',
            'category', 'category_name', 'brand', 'brand_name', 'attributes',
            'main_image', 'images', 'variations', 'variations_summary',
            'sku', 'stock_quantity', 'is_in_stock',
            'is_active', 'is_featured', 'is_new', 'allow_financing',
            'meta_title', 'meta_description',
            'created_at', 'updated_at'
        ]

    def get_main_image(self, obj):
        """Get main image from model field or primary image from related images"""
        # First check the main_image field on the model
        if obj.main_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.main_image.url)
            return obj.main_image.url
        # Fall back to primary image from ProductImage relation
        primary_image = obj.images.filter(is_primary=True).first()
        if not primary_image:
            primary_image = obj.images.first()
        if primary_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary_image.image.url)
            return primary_image.image.url
        return None

    def get_variations_summary(self, obj):
        """Get a summary of available variations grouped by attribute"""
        variations = obj.variations.filter(is_active=True)
        if not variations.exists():
            return {}
        
        # Group by attribute
        result = {}
        for variation in variations:
            for attr_value in variation.attribute_values.all():
                attr_name = attr_value.attribute.name
                if attr_name not in result:
                    result[attr_name] = []
                value_data = {
                    'id': attr_value.id,
                    'value': attr_value.value,
                    'color_code': attr_value.color_code
                }
                if value_data not in result[attr_name]:
                    result[attr_name].append(value_data)
        return result


class HomepageSliderSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomepageSlider
        fields = [
            'id', 'title', 'subtitle', 'description',
            'image', 'mobile_image',
            'button_text', 'button_link',
            'order', 'is_active'
        ]
