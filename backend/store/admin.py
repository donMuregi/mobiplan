from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Category, Brand, Attribute, AttributeValue, 
    Product, ProductImage, ProductVariation, HomepageSlider
)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'alt_text', 'is_primary', 'order']


class ProductVariationInline(admin.TabularInline):
    model = ProductVariation
    extra = 1
    fields = ['attribute_values', 'price_override', 'sku', 'stock_quantity', 'is_active', 'image']
    autocomplete_fields = ['attribute_values']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'parent', 'is_active', 'product_count', 'created_at']
    list_filter = ['is_active', 'parent']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['is_active']
    ordering = ['name']

    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = 'Products'


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ['name', 'logo_preview', 'is_active', 'product_count', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['is_active']
    ordering = ['name']

    def logo_preview(self, obj):
        if obj.logo:
            return format_html('<img src="{}" width="40" height="40" style="object-fit: contain;" />', obj.logo.url)
        return '-'
    logo_preview.short_description = 'Logo'

    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = 'Products'


class AttributeValueInline(admin.TabularInline):
    model = AttributeValue
    extra = 3
    fields = ['value', 'slug', 'color_code']
    prepopulated_fields = {'slug': ('value',)}


@admin.register(Attribute)
class AttributeAdmin(admin.ModelAdmin):
    list_display = ['name', 'value_count']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [AttributeValueInline]

    def value_count(self, obj):
        return obj.values.count()
    value_count.short_description = 'Values'


@admin.register(AttributeValue)
class AttributeValueAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'attribute', 'value', 'color_preview']
    list_filter = ['attribute']
    search_fields = ['value', 'attribute__name']
    ordering = ['attribute__name', 'value']

    def color_preview(self, obj):
        if obj.color_code:
            return format_html(
                '<span style="display:inline-block;width:20px;height:20px;background-color:{};border:1px solid #ccc;border-radius:3px;"></span> {}',
                obj.color_code, obj.color_code
            )
        return '-'
    color_preview.short_description = 'Color'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'image_preview', 'name', 'category', 'brand', 
        'base_price', 'sale_price', 'stock_quantity',
        'is_active', 'is_featured', 'allow_financing'
    ]
    list_display_links = ['image_preview', 'name']
    list_filter = ['is_active', 'is_featured', 'is_new', 'allow_financing', 'category', 'brand']
    search_fields = ['name', 'description', 'sku']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['is_active', 'is_featured', 'allow_financing']
    filter_horizontal = ['attributes']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [ProductImageInline, ProductVariationInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'short_description', 'description')
        }),
        ('Pricing', {
            'fields': ('base_price', 'sale_price')
        }),
        ('Organization', {
            'fields': ('category', 'brand', 'attributes')
        }),
        ('Images', {
            'fields': ('main_image',)
        }),
        ('Inventory', {
            'fields': ('sku', 'stock_quantity', 'is_in_stock')
        }),
        ('Visibility & Features', {
            'fields': ('is_active', 'is_featured', 'is_new', 'allow_financing')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def image_preview(self, obj):
        if obj.main_image:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover; border-radius: 4px;" />', obj.main_image.url)
        return '-'
    image_preview.short_description = 'Image'


@admin.register(HomepageSlider)
class HomepageSliderAdmin(admin.ModelAdmin):
    list_display = ['image_preview', 'title', 'button_text', 'order', 'is_active', 'created_at']
    list_display_links = ['image_preview', 'title']
    list_filter = ['is_active']
    list_editable = ['order', 'is_active']
    search_fields = ['title', 'subtitle', 'description']
    ordering = ['order']

    fieldsets = (
        ('Content', {
            'fields': ('title', 'subtitle', 'description')
        }),
        ('Images', {
            'fields': ('image', 'mobile_image')
        }),
        ('Link/Button', {
            'fields': ('button_text', 'button_link')
        }),
        ('Display Settings', {
            'fields': ('order', 'is_active', 'start_date', 'end_date')
        }),
    )

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="100" height="50" style="object-fit: cover; border-radius: 4px;" />', obj.image.url)
        return '-'
    image_preview.short_description = 'Preview'


# Customize admin site
admin.site.site_header = 'MobiPlan Admin'
admin.site.site_title = 'MobiPlan'
admin.site.index_title = 'Dashboard'
