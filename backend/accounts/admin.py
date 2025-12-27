from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User, Address


class AddressInline(admin.TabularInline):
    model = Address
    extra = 0
    fields = ['address_type', 'first_name', 'last_name', 'address_line_1', 'city', 'is_default']


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = [
        'email', 'full_name', 'phone', 'is_active', 
        'is_staff', 'order_count', 'date_joined'
    ]
    list_filter = ['is_active', 'is_staff', 'is_superuser', 'date_joined']
    search_fields = ['email', 'first_name', 'last_name', 'phone']
    ordering = ['-date_joined']
    inlines = [AddressInline]
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {
            'fields': ('first_name', 'last_name', 'phone', 'date_of_birth', 'profile_image')
        }),
        ('Address', {
            'fields': ('address', 'city', 'county', 'postal_code')
        }),
        ('Preferences', {
            'fields': ('email_notifications', 'sms_notifications')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
            'classes': ('collapse',)
        }),
        ('Important Dates', {
            'fields': ('last_login', 'date_joined'),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2'),
        }),
    )

    def order_count(self, obj):
        return obj.orders.count()
    order_count.short_description = 'Orders'


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['user', 'address_type', 'full_name', 'city', 'is_default']
    list_filter = ['address_type', 'is_default', 'city']
    search_fields = ['user__email', 'first_name', 'last_name', 'address_line_1', 'city']
