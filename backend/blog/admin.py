from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from .models import BlogCategory, BlogPost


@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'post_count', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['is_active']

    def post_count(self, obj):
        return obj.posts.count()
    post_count.short_description = 'Posts'


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = [
        'image_preview', 'title', 'category', 'author',
        'status_badge', 'views', 'published_at'
    ]
    list_display_links = ['image_preview', 'title']
    list_filter = ['status', 'category', 'author', 'created_at']
    search_fields = ['title', 'excerpt', 'content']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['views', 'created_at', 'updated_at']
    date_hierarchy = 'created_at'

    fieldsets = (
        ('Content', {
            'fields': ('title', 'slug', 'excerpt', 'content', 'featured_image')
        }),
        ('Organization', {
            'fields': ('category', 'author', 'status')
        }),
        ('Publishing', {
            'fields': ('published_at',)
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
        ('Statistics', {
            'fields': ('views', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def image_preview(self, obj):
        if obj.featured_image:
            return format_html(
                '<img src="{}" width="60" height="40" style="object-fit: cover; border-radius: 4px;" />',
                obj.featured_image.url
            )
        return '-'
    image_preview.short_description = 'Image'

    def status_badge(self, obj):
        colors = {
            'draft': '#6c757d',
            'published': '#28a745',
            'archived': '#ffc107',
        }
        color = colors.get(obj.status, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; border-radius: 3px; font-size: 11px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    actions = ['publish_posts', 'draft_posts', 'archive_posts']

    def publish_posts(self, request, queryset):
        queryset.update(status='published', published_at=timezone.now())
        self.message_user(request, f'{queryset.count()} post(s) published.')
    publish_posts.short_description = 'Publish selected posts'

    def draft_posts(self, request, queryset):
        queryset.update(status='draft')
        self.message_user(request, f'{queryset.count()} post(s) set to draft.')
    draft_posts.short_description = 'Set selected to draft'

    def archive_posts(self, request, queryset):
        queryset.update(status='archived')
        self.message_user(request, f'{queryset.count()} post(s) archived.')
    archive_posts.short_description = 'Archive selected posts'
