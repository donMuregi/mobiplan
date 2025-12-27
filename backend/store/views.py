from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend, FilterSet
import django_filters
from .models import Category, Brand, Product, HomepageSlider
from .serializers import (
    CategorySerializer, BrandSerializer,
    ProductListSerializer, ProductDetailSerializer,
    HomepageSliderSerializer
)


def get_category_descendants(category):
    """Recursively get all descendant category IDs including the category itself"""
    descendants = [category.id]
    for child in category.children.filter(is_active=True):
        descendants.extend(get_category_descendants(child))
    return descendants


class ProductFilter(FilterSet):
    """Custom filter for products that includes subcategory products"""
    category = django_filters.CharFilter(method='filter_by_category')
    brand = django_filters.CharFilter(field_name='brand__slug')
    min_price = django_filters.NumberFilter(field_name='base_price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='base_price', lookup_expr='lte')

    class Meta:
        model = Product
        fields = ['is_featured', 'is_new', 'allow_financing']

    def filter_by_category(self, queryset, name, value):
        """Filter by category slug, including all products in subcategories"""
        try:
            category = Category.objects.get(slug=value, is_active=True)
            descendant_ids = get_category_descendants(category)
            return queryset.filter(category_id__in=descendant_ids)
        except Category.DoesNotExist:
            return queryset.none()


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for product categories"""
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

    def get_queryset(self):
        """Return all categories or just top-level ones based on query param"""
        queryset = Category.objects.filter(is_active=True)
        # By default, return only top-level categories for the category tree
        # Use ?all=true to get all categories
        if self.request.query_params.get('all') != 'true':
            queryset = queryset.filter(parent=None)
        return queryset


class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for product brands"""
    queryset = Brand.objects.filter(is_active=True)
    serializer_class = BrandSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for products"""
    queryset = Product.objects.filter(is_active=True).select_related(
        'category', 'brand'
    ).prefetch_related(
        'images', 'variations', 'variations__attribute_values', 'attributes'
    )
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'short_description', 'brand__name']
    ordering_fields = ['base_price', 'created_at', 'name']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer


class HomepageSliderViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for homepage sliders/banners"""
    queryset = HomepageSlider.objects.filter(is_active=True).order_by('order')
    serializer_class = HomepageSliderSerializer
    permission_classes = [AllowAny]
