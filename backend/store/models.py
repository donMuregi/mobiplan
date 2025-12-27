from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator
from decimal import Decimal


class Category(models.Model):
    """Product categories like Phones, Electronics, Accessories, etc."""
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    parent = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='children'
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Brand(models.Model):
    """Product brands like Samsung, Apple, Sony, etc."""
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    logo = models.ImageField(upload_to='brands/', blank=True, null=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Attribute(models.Model):
    """
    Product attributes like Color, Storage, RAM, Screen Size, etc.
    These define the types of variations a product can have.
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True, blank=True)

    class Meta:
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class AttributeValue(models.Model):
    """
    Values for attributes, e.g., for Color: Black, Blue, White
    For Storage: 64GB, 128GB, 256GB, 512GB
    """
    attribute = models.ForeignKey(
        Attribute, 
        on_delete=models.CASCADE, 
        related_name='values'
    )
    value = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, blank=True)
    color_code = models.CharField(
        max_length=7, 
        blank=True, 
        help_text='Hex color code for color attributes (e.g., #000000)'
    )

    class Meta:
        ordering = ['attribute', 'value']
        unique_together = ['attribute', 'value']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.attribute.name}-{self.value}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.attribute.name}: {self.value}"


class Product(models.Model):
    """Main product model"""
    name = models.CharField(max_length=300)
    slug = models.SlugField(max_length=300, unique=True, blank=True)
    description = models.TextField()
    short_description = models.CharField(max_length=500, blank=True)
    
    # Pricing
    base_price = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    sale_price = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        null=True, 
        blank=True,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    
    # Relationships
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True,
        related_name='products'
    )
    brand = models.ForeignKey(
        Brand, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='products'
    )
    
    # Product attributes (for filtering)
    attributes = models.ManyToManyField(
        AttributeValue, 
        blank=True,
        related_name='products'
    )
    
    # Images
    main_image = models.ImageField(upload_to='products/')
    
    # Inventory
    sku = models.CharField(max_length=100, unique=True, blank=True, null=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    is_in_stock = models.BooleanField(default=True)
    
    # Flags
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_new = models.BooleanField(default=False)
    allow_financing = models.BooleanField(
        default=True, 
        help_text='Allow customers to purchase this product through Sacco financing'
    )
    
    # SEO
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def current_price(self):
        """Return sale price if available, otherwise base price"""
        return self.sale_price if self.sale_price else self.base_price

    @property
    def discount_percentage(self):
        """Calculate discount percentage if on sale"""
        if self.sale_price and self.base_price > self.sale_price:
            discount = ((self.base_price - self.sale_price) / self.base_price) * 100
            return round(discount, 0)
        return 0

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    """Additional product images"""
    product = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE, 
        related_name='images'
    )
    image = models.ImageField(upload_to='products/')
    alt_text = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Image for {self.product.name}"


class ProductVariation(models.Model):
    """
    Product variations based on attributes.
    E.g., iPhone 15 Pro - 256GB - Titanium Black
    """
    product = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE, 
        related_name='variations'
    )
    attribute_values = models.ManyToManyField(
        AttributeValue,
        related_name='variations'
    )
    
    # Variation-specific pricing (optional override)
    price_override = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        null=True, 
        blank=True,
        help_text='Leave blank to use product base price'
    )
    
    # Variation-specific stock
    sku = models.CharField(max_length=100, unique=True, blank=True, null=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    # Variation image (optional)
    image = models.ImageField(upload_to='products/variations/', blank=True, null=True)

    class Meta:
        ordering = ['product', 'id']

    @property
    def price(self):
        """Return variation price or product base price"""
        return self.price_override if self.price_override else self.product.current_price

    @property
    def variation_name(self):
        """Generate variation name from attributes"""
        try:
            attrs = self.attribute_values.all()
            if attrs:
                return " / ".join([str(attr.value) for attr in attrs])
            return "(No attributes)"
        except Exception:
            return "(Unsaved)"

    def __str__(self):
        try:
            if self.pk:
                return f"{self.product.name} - {self.variation_name}"
            return f"{self.product.name} - (New Variation)"
        except Exception:
            return "New Variation"


class HomepageSlider(models.Model):
    """Homepage slider/banner management"""
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='sliders/')
    mobile_image = models.ImageField(
        upload_to='sliders/mobile/', 
        blank=True, 
        null=True,
        help_text='Optional mobile-optimized image'
    )
    
    # Link
    button_text = models.CharField(max_length=50, blank=True)
    button_link = models.CharField(max_length=500, blank=True)
    
    # Display settings
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    # Scheduling
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title
