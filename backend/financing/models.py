from django.db import models
from django.conf import settings
from store.models import Product, ProductVariation
import uuid


class Sacco(models.Model):
    """Sacco/Microfinance institutions that provide financing"""
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    logo = models.ImageField(upload_to='saccos/', blank=True, null=True)
    description = models.TextField(blank=True)
    
    # Contact info
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    website = models.URLField(blank=True)
    
    # Google Sheets integration
    google_sheet_id = models.CharField(
        max_length=200, 
        blank=True,
        help_text='Google Sheet ID for storing financing requests'
    )
    google_sheet_name = models.CharField(
        max_length=100,
        blank=True,
        default='Sheet1',
        help_text='Name of the sheet tab within the Google Sheet'
    )
    
    # Status
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Sacco'
        verbose_name_plural = 'Saccos'
        ordering = ['name']

    def __str__(self):
        return self.name


class PaymentTimeline(models.Model):
    """Available payment timelines for financing"""
    months = models.PositiveIntegerField(unique=True)
    label = models.CharField(max_length=50)  # e.g., "3 Months", "6 Months"
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'months']

    def __str__(self):
        return self.label


class FinancingRequest(models.Model):
    """
    Financing requests from customers who want to purchase
    through a Sacco/Microfinance institution
    """
    
    class RequestStatus(models.TextChoices):
        PENDING = 'pending', 'Pending Review'
        SUBMITTED_TO_SACCO = 'submitted', 'Submitted to Sacco'
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'

    # Request identification
    request_number = models.CharField(max_length=50, unique=True, editable=False)
    
    # Customer information
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='financing_requests'
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField()
    national_id = models.CharField(max_length=20)
    town_of_residence = models.CharField(max_length=100)
    
    # Product information
    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        related_name='financing_requests'
    )
    variation = models.ForeignKey(
        ProductVariation,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    product_name = models.CharField(max_length=300)  # Store name at time of request
    product_price = models.DecimalField(max_digits=12, decimal_places=2)
    variation_details = models.CharField(max_length=200, blank=True)
    
    # Financing details
    sacco = models.ForeignKey(
        Sacco,
        on_delete=models.SET_NULL,
        null=True,
        related_name='financing_requests'
    )
    sacco_name = models.CharField(max_length=200)  # Store name at time of request
    payment_timeline = models.ForeignKey(
        PaymentTimeline,
        on_delete=models.SET_NULL,
        null=True
    )
    payment_months = models.PositiveIntegerField()  # Store months at time of request
    
    # Calculated fields
    monthly_payment = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Estimated monthly payment (can be set by admin)'
    )
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=RequestStatus.choices,
        default=RequestStatus.PENDING
    )
    
    # Google Sheets sync
    synced_to_sheet = models.BooleanField(default=False)
    synced_at = models.DateTimeField(null=True, blank=True)
    
    # Email notifications
    customer_email_sent = models.BooleanField(default=False)
    admin_email_sent = models.BooleanField(default=False)
    
    # Notes
    customer_notes = models.TextField(blank=True)
    admin_notes = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Financing Request'
        verbose_name_plural = 'Financing Requests'

    def save(self, *args, **kwargs):
        if not self.request_number:
            self.request_number = f"FIN-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return f"{self.request_number} - {self.full_name} - {self.product_name}"
