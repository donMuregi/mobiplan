from rest_framework import serializers
from .models import BlogCategory, BlogPost


class BlogCategorySerializer(serializers.ModelSerializer):
    post_count = serializers.SerializerMethodField()

    class Meta:
        model = BlogCategory
        fields = ['id', 'name', 'slug', 'description', 'is_active', 'post_count']

    def get_post_count(self, obj):
        return obj.posts.filter(status='published').count()


class BlogPostListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for blog listing"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    author_name = serializers.CharField(source='author.full_name', read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'featured_image',
            'category', 'category_name', 'author', 'author_name',
            'status', 'views', 'published_at', 'created_at'
        ]


class BlogPostDetailSerializer(serializers.ModelSerializer):
    """Full serializer for single blog post"""
    category = BlogCategorySerializer(read_only=True)
    author_name = serializers.CharField(source='author.full_name', read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content', 'featured_image',
            'category', 'author', 'author_name',
            'status', 'meta_title', 'meta_description',
            'views', 'published_at', 'created_at', 'updated_at'
        ]
