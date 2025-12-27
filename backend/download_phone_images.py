#!/usr/bin/env python
import os
import csv
import requests
import django
from django.utils.text import slugify

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mobiplan.settings')
django.setup()

from store.models import Product, ProductImage
from django.core.files.base import ContentFile

def download_image(url, name):
    """Download image from URL"""
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, timeout=30, headers=headers)
        if response.status_code == 200:
            return response.content
    except Exception as e:
        print(f"Error downloading {name}: {e}")
    return None

def save_image(product, img_content, url, is_primary=False):
    """Save image to product"""
    filename = url.split('/')[-1].split('?')[0]
    ext = os.path.splitext(filename)[1] or '.jpg'
    slug = slugify(product.name)[:50]
    final_name = f"{slug}-{filename[:30]}{ext}"
    
    img = ProductImage(product=product, is_primary=is_primary)
    img.image.save(final_name, ContentFile(img_content), save=True)
    return True

# Read CSV and find products that need images
with open('smartphones and wearables.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        name = row.get('Name', '').strip()
        images_str = row.get('Images', '').strip()
        
        if not images_str:
            continue
            
        image_urls = [u.strip() for u in images_str.split(',') if u.strip()]
        if not image_urls:
            continue
        
        # Find products that start with this name (to get variations)
        matching_products = list(Product.objects.filter(name__istartswith=name))
        
        # Also try exact match
        exact = list(Product.objects.filter(name=name))
        matching_products.extend([p for p in exact if p not in matching_products])
        
        for product in matching_products:
            if product.images.exists():
                continue
            
            print(f"Downloading images for: {product.name}")
            for i, url in enumerate(image_urls[:3]):
                content = download_image(url, product.name)
                if content:
                    is_primary = (i == 0)
                    save_image(product, content, url, is_primary)
                    print(f"  ✓ Image {i+1}")

print("\nDone!")
