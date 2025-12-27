"""
Management command to download images for existing products from WooCommerce URLs
"""
import csv
import re
import requests
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.utils.text import slugify
from store.models import Product, ProductImage


class Command(BaseCommand):
    help = 'Download images for existing products from WooCommerce CSV files'

    def add_arguments(self, parser):
        parser.add_argument(
            'csv_files',
            nargs='+',
            type=str,
            help='Path(s) to WooCommerce CSV export file(s)'
        )
        parser.add_argument(
            '--limit',
            type=int,
            default=0,
            help='Limit number of products to process (0 = no limit)'
        )

    def handle(self, *args, **options):
        csv_files = options['csv_files']
        limit = options['limit']
        
        total_downloaded = 0
        total_skipped = 0
        
        for csv_file in csv_files:
            self.stdout.write(f"\n{'='*60}")
            self.stdout.write(self.style.NOTICE(f"Processing: {csv_file}"))
            self.stdout.write(f"{'='*60}")
            
            downloaded, skipped = self.process_csv(csv_file, limit)
            total_downloaded += downloaded
            total_skipped += skipped
            
            if limit > 0 and total_downloaded >= limit:
                break
        
        self.stdout.write(f"\n{'='*60}")
        self.stdout.write(self.style.SUCCESS(
            f"Complete! {total_downloaded} images downloaded, {total_skipped} skipped."
        ))

    def download_image(self, url, product_name, is_main=False):
        """Download image from URL and return ContentFile"""
        try:
            url = url.strip()
            if not url.startswith('http'):
                return None
            
            self.stdout.write(f"    Downloading: {url[:60]}...")
            response = requests.get(url, timeout=30)
            if response.status_code == 200:
                # Get filename from URL
                filename = url.split('/')[-1].split('?')[0]
                # Ensure proper extension
                if not any(filename.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp']):
                    filename += '.jpg'
                # Prefix with product slug
                safe_name = slugify(product_name)[:30]
                prefix = "main-" if is_main else ""
                filename = f"{prefix}{safe_name}-{filename}"
                return ContentFile(response.content, name=filename)
        except Exception as e:
            self.stdout.write(self.style.WARNING(f"    Failed: {e}"))
        return None

    def process_csv(self, csv_file, limit=0):
        """Process a single CSV file and download images for matching products"""
        downloaded = 0
        skipped = 0
        
        try:
            with open(csv_file, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                
                for row in reader:
                    if limit > 0 and downloaded >= limit:
                        break
                        
                    try:
                        result = self.process_product(row)
                        if result:
                            downloaded += 1
                        else:
                            skipped += 1
                    except Exception as e:
                        self.stdout.write(self.style.ERROR(
                            f"Error processing {row.get('Name', 'Unknown')}: {e}"
                        ))
                        skipped += 1
                        
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f"File not found: {csv_file}"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error reading CSV: {e}"))
        
        self.stdout.write(f"  Downloaded: {downloaded}, Skipped: {skipped}")
        return downloaded, skipped

    def process_product(self, row):
        """Find matching product and download images"""
        name = row.get('Name', '').strip()
        if not name:
            return False
        
        slug = slugify(name)
        
        try:
            product = Product.objects.get(slug=slug)
        except Product.DoesNotExist:
            self.stdout.write(self.style.WARNING(f"  Not found: {name}"))
            return False
        
        # Check if product already has a main image
        if product.main_image:
            self.stdout.write(f"  Already has image: {name}")
            return False
        
        # Get image URLs from CSV
        images_str = row.get('Images', '')
        image_urls = [url.strip() for url in images_str.split(',') if url.strip()]
        
        if not image_urls:
            self.stdout.write(f"  No images in CSV: {name}")
            return False
        
        self.stdout.write(self.style.NOTICE(f"  Processing: {name}"))
        
        # Download main image
        main_image = self.download_image(image_urls[0], name, is_main=True)
        if main_image:
            product.main_image = main_image
            product.save()
            self.stdout.write(self.style.SUCCESS(f"    ✓ Main image saved"))
        else:
            return False
        
        # Download additional images
        for idx, url in enumerate(image_urls[1:5], start=1):  # Limit to first 5 additional images
            img_content = self.download_image(url, name)
            if img_content:
                ProductImage.objects.create(
                    product=product,
                    image=img_content,
                    order=idx,
                    is_primary=False
                )
                self.stdout.write(self.style.SUCCESS(f"    ✓ Additional image {idx} saved"))
        
        return True
