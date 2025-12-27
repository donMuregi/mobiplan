"""
Management command to import products from WooCommerce CSV exports
"""
import csv
import re
import os
import requests
from io import BytesIO
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.utils.text import slugify
from store.models import Category, Brand, Product, ProductImage


class Command(BaseCommand):
    help = 'Import products from WooCommerce CSV export files'

    def add_arguments(self, parser):
        parser.add_argument(
            'csv_files',
            nargs='+',
            type=str,
            help='Path(s) to WooCommerce CSV export file(s)'
        )
        parser.add_argument(
            '--download-images',
            action='store_true',
            default=False,
            help='Download images from URLs (may take longer)'
        )

    def handle(self, *args, **options):
        csv_files = options['csv_files']
        download_images = options['download_images']
        
        total_imported = 0
        total_skipped = 0
        
        for csv_file in csv_files:
            self.stdout.write(f"\n{'='*60}")
            self.stdout.write(self.style.NOTICE(f"Processing: {csv_file}"))
            self.stdout.write(f"{'='*60}")
            
            imported, skipped = self.import_csv(csv_file, download_images)
            total_imported += imported
            total_skipped += skipped
        
        self.stdout.write(f"\n{'='*60}")
        self.stdout.write(self.style.SUCCESS(
            f"Import complete! {total_imported} products imported, {total_skipped} skipped."
        ))

    def clean_html(self, html_text):
        """Remove HTML tags and clean up text"""
        if not html_text:
            return ""
        # Replace \n with actual newlines
        text = html_text.replace('\\n', '\n')
        # Remove HTML tags but keep content
        text = re.sub(r'<[^>]+>', ' ', text)
        # Clean up whitespace
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

    def extract_short_description(self, short_desc, max_length=500):
        """Extract clean short description"""
        clean_text = self.clean_html(short_desc)
        if len(clean_text) > max_length:
            clean_text = clean_text[:max_length-3] + "..."
        return clean_text

    def get_or_create_category(self, category_string):
        """Parse category string and get/create category hierarchy"""
        if not category_string:
            return None
        
        # WooCommerce format: "TVs > Samsung TVs > Samsung 4K QLED TVs, TVs"
        # Take the most specific category (last in hierarchy)
        categories = category_string.split(',')[0].strip()  # Take first category path
        parts = [p.strip() for p in categories.split('>')]
        
        parent = None
        category = None
        
        for part in parts:
            if not part:
                continue
            slug = slugify(part)
            category, created = Category.objects.get_or_create(
                slug=slug,
                defaults={
                    'name': part,
                    'parent': parent,
                    'is_active': True
                }
            )
            if created:
                self.stdout.write(f"  Created category: {part}")
            parent = category
        
        return category

    def get_or_create_brand(self, brand_name):
        """Get or create brand"""
        if not brand_name:
            return None
        
        slug = slugify(brand_name)
        brand, created = Brand.objects.get_or_create(
            slug=slug,
            defaults={
                'name': brand_name,
                'is_active': True
            }
        )
        if created:
            self.stdout.write(f"  Created brand: {brand_name}")
        return brand

    def parse_price(self, price_str):
        """Parse price string to Decimal"""
        if not price_str:
            return None
        try:
            # Remove any currency symbols and whitespace
            clean_price = re.sub(r'[^\d.]', '', str(price_str))
            return Decimal(clean_price)
        except:
            return None

    def download_image(self, url, product_name):
        """Download image from URL and return ContentFile"""
        try:
            # Clean up URL
            url = url.strip()
            if not url.startswith('http'):
                return None
            
            response = requests.get(url, timeout=30)
            if response.status_code == 200:
                # Get filename from URL
                filename = url.split('/')[-1].split('?')[0]
                # Ensure proper extension
                if not any(filename.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp']):
                    filename += '.jpg'
                # Prefix with product slug
                safe_name = slugify(product_name)[:30]
                filename = f"{safe_name}-{filename}"
                return ContentFile(response.content, name=filename)
        except Exception as e:
            self.stdout.write(self.style.WARNING(f"  Failed to download image {url}: {e}"))
        return None

    def import_csv(self, csv_file, download_images=False):
        """Import products from a single CSV file"""
        imported = 0
        skipped = 0
        
        try:
            with open(csv_file, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                
                for row in reader:
                    try:
                        result = self.import_product(row, download_images)
                        if result:
                            imported += 1
                        else:
                            skipped += 1
                    except Exception as e:
                        self.stdout.write(self.style.ERROR(
                            f"Error importing {row.get('Name', 'Unknown')}: {e}"
                        ))
                        skipped += 1
                        
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f"File not found: {csv_file}"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error reading CSV: {e}"))
        
        self.stdout.write(f"  Imported: {imported}, Skipped: {skipped}")
        return imported, skipped

    def import_product(self, row, download_images=False):
        """Import a single product from CSV row"""
        name = row.get('Name', '').strip()
        if not name:
            return False
        
        # Check if product already exists by SKU or name
        sku = row.get('SKU', '').strip() or None
        slug = slugify(name)
        
        if Product.objects.filter(slug=slug).exists():
            self.stdout.write(self.style.WARNING(f"  Skipping (exists): {name}"))
            return False
        
        if sku and Product.objects.filter(sku=sku).exists():
            self.stdout.write(self.style.WARNING(f"  Skipping (SKU exists): {name}"))
            return False
        
        # Parse prices
        regular_price = self.parse_price(row.get('Regular price', ''))
        sale_price = self.parse_price(row.get('Sale price', ''))
        
        if not regular_price:
            self.stdout.write(self.style.WARNING(f"  Skipping (no price): {name}"))
            return False
        
        # Get/create category and brand
        category = self.get_or_create_category(row.get('Categories', ''))
        brand = self.get_or_create_brand(row.get('Brands', 'Samsung'))  # Default to Samsung
        
        # Parse descriptions
        short_desc = self.extract_short_description(row.get('Short description', ''))
        description = row.get('Description', '').replace('\\n', '\n')
        
        # Create product
        product = Product(
            name=name,
            slug=slug,
            description=description or short_desc or name,
            short_description=short_desc,
            base_price=regular_price,
            sale_price=sale_price if sale_price and sale_price < regular_price else None,
            category=category,
            brand=brand,
            sku=sku,
            stock_quantity=10,  # Default stock
            is_in_stock=row.get('In stock?', '1') == '1',
            is_active=row.get('Published', '1') == '1',
            is_featured=row.get('Is featured?', '0') == '1',
            is_new=True,
            allow_financing=True,
        )
        
        # Handle images
        images_str = row.get('Images', '')
        image_urls = [url.strip() for url in images_str.split(',') if url.strip()]
        
        if download_images and image_urls:
            # Download and set main image
            main_image = self.download_image(image_urls[0], name)
            if main_image:
                product.main_image = main_image
        
        product.save()
        self.stdout.write(self.style.SUCCESS(f"  Imported: {name} @ KES {regular_price}"))
        
        # Download additional images
        if download_images and len(image_urls) > 1:
            for idx, url in enumerate(image_urls[1:], start=1):
                img_content = self.download_image(url, name)
                if img_content:
                    ProductImage.objects.create(
                        product=product,
                        image=img_content,
                        order=idx,
                        is_primary=False
                    )
        
        return True
