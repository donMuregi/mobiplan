from django.contrib import admin
from django.utils.html import format_html
from .models import Sacco, PaymentTimeline, FinancingRequest


@admin.register(Sacco)
class SaccoAdmin(admin.ModelAdmin):
    list_display = ['logo_preview', 'name', 'email', 'phone', 'request_count', 'is_active']
    list_display_links = ['logo_preview', 'name']
    list_filter = ['is_active']
    search_fields = ['name', 'email']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['is_active']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'logo', 'description')
        }),
        ('Contact Information', {
            'fields': ('email', 'phone', 'website')
        }),
        ('Google Sheets Integration', {
            'fields': ('google_sheet_id', 'google_sheet_name'),
            'description': 'Configure Google Sheets integration for this Sacco'
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )

    def logo_preview(self, obj):
        if obj.logo:
            return format_html('<img src="{}" width="40" height="40" style="object-fit: contain;" />', obj.logo.url)
        return '-'
    logo_preview.short_description = 'Logo'

    def request_count(self, obj):
        return obj.financing_requests.count()
    request_count.short_description = 'Requests'


@admin.register(PaymentTimeline)
class PaymentTimelineAdmin(admin.ModelAdmin):
    list_display = ['label', 'months', 'order', 'is_active']
    list_editable = ['order', 'is_active']
    ordering = ['order', 'months']


@admin.register(FinancingRequest)
class FinancingRequestAdmin(admin.ModelAdmin):
    list_display = [
        'request_number', 'full_name', 'phone_number', 
        'product_name', 'sacco_name', 'payment_months',
        'product_price', 'status_badge', 'sheet_status', 'created_at'
    ]
    list_filter = ['status', 'sacco', 'payment_timeline', 'synced_to_sheet', 'created_at']
    search_fields = [
        'request_number', 'first_name', 'last_name', 
        'phone_number', 'email', 'national_id', 'product_name'
    ]
    readonly_fields = [
        'request_number', 'created_at', 'updated_at',
        'customer_email_sent', 'admin_email_sent',
        'synced_to_sheet', 'synced_at'
    ]
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Request Information', {
            'fields': ('request_number', 'status')
        }),
        ('Customer Information', {
            'fields': (
                'user', 'first_name', 'last_name', 
                'phone_number', 'email', 'national_id', 'town_of_residence'
            )
        }),
        ('Product Information', {
            'fields': ('product', 'product_name', 'variation_details', 'product_price')
        }),
        ('Financing Details', {
            'fields': (
                'sacco', 'sacco_name', 
                'payment_timeline', 'payment_months', 'monthly_payment'
            )
        }),
        ('Notes', {
            'fields': ('customer_notes', 'admin_notes')
        }),
        ('Sync Status', {
            'fields': ('synced_to_sheet', 'synced_at', 'customer_email_sent', 'admin_email_sent'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def status_badge(self, obj):
        colors = {
            'pending': '#ffc107',
            'submitted': '#17a2b8',
            'approved': '#28a745',
            'rejected': '#dc3545',
            'completed': '#6f42c1',
            'cancelled': '#6c757d',
        }
        color = colors.get(obj.status, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; border-radius: 3px; font-size: 11px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def sheet_status(self, obj):
        if obj.synced_to_sheet:
            return format_html(
                '<span style="color: #28a745;">✓ Synced</span>'
            )
        return format_html(
            '<span style="color: #dc3545;">✗ Not Synced</span>'
        )
    sheet_status.short_description = 'Sheet'

    actions = ['sync_to_google_sheets', 'send_customer_email', 'mark_as_submitted']

    def sync_to_google_sheets(self, request, queryset):
        # TODO: Implement Google Sheets sync
        count = queryset.count()
        self.message_user(request, f'{count} request(s) queued for Google Sheets sync.')
    sync_to_google_sheets.short_description = 'Sync selected to Google Sheets'

    def send_customer_email(self, request, queryset):
        # TODO: Implement email sending
        count = queryset.count()
        self.message_user(request, f'{count} confirmation email(s) queued for sending.')
    send_customer_email.short_description = 'Send confirmation email to customer'

    def mark_as_submitted(self, request, queryset):
        queryset.update(status='submitted')
        self.message_user(request, f'{queryset.count()} request(s) marked as submitted.')
    mark_as_submitted.short_description = 'Mark as Submitted to Sacco'
