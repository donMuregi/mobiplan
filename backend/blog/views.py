from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import BlogCategory, BlogPost
from .serializers import (
    BlogCategorySerializer,
    BlogPostListSerializer, BlogPostDetailSerializer
)


class BlogCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for blog categories"""
    queryset = BlogCategory.objects.filter(is_active=True)
    serializer_class = BlogCategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for blog posts"""
    queryset = BlogPost.objects.filter(status='published').select_related('category', 'author')
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug']
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['published_at', 'views']
    ordering = ['-published_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BlogPostDetailSerializer
        return BlogPostListSerializer

    def retrieve(self, request, *args, **kwargs):
        # Increment view count
        instance = self.get_object()
        instance.views += 1
        instance.save(update_fields=['views'])
        return super().retrieve(request, *args, **kwargs)
