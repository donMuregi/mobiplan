"""
Management command to seed initial data for MobiPlan
"""
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from financing.models import Sacco, PaymentTimeline
from store.models import Category, Brand, Attribute, AttributeValue, Product, ProductVariation


class Command(BaseCommand):
    help = 'Seed initial data for MobiPlan'

    def handle(self, *args, **options):
        self.stdout.write('Seeding initial data...')
        
        # Create Saccos
        saccos_data = [
            {'name': 'Mwalimu Sacco', 'slug': 'mwalimu-sacco'},
            {'name': 'Yehu Microfinance', 'slug': 'yehu-microfinance'},
            {'name': 'Juhudi Kilimo', 'slug': 'juhudi-kilimo'},
            {'name': 'National Police Sacco', 'slug': 'national-police-sacco'},
        ]
        for sacco_data in saccos_data:
            Sacco.objects.get_or_create(
                slug=sacco_data['slug'],
                defaults=sacco_data
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(saccos_data)} Saccos'))

        # Create Payment Timelines
        timelines_data = [
            {'months': 3, 'label': '3 Months', 'order': 1},
            {'months': 6, 'label': '6 Months', 'order': 2},
            {'months': 12, 'label': '12 Months', 'order': 3},
            {'months': 18, 'label': '18 Months', 'order': 4},
            {'months': 24, 'label': '24 Months', 'order': 5},
        ]
        for timeline_data in timelines_data:
            PaymentTimeline.objects.get_or_create(
                months=timeline_data['months'],
                defaults=timeline_data
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(timelines_data)} Payment Timelines'))

        # Create Categories
        categories_data = [
            {'name': 'Smartphones', 'slug': 'smartphones'},
            {'name': 'Laptops', 'slug': 'laptops'},
            {'name': 'Tablets', 'slug': 'tablets'},
            {'name': 'TVs & Audio', 'slug': 'tvs-audio'},
            {'name': 'Wearables', 'slug': 'wearables'},
            {'name': 'Accessories', 'slug': 'accessories'},
        ]
        for cat_data in categories_data:
            Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults=cat_data
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(categories_data)} Categories'))

        # Create Brands
        brands_data = [
            {'name': 'Samsung', 'slug': 'samsung'},
            {'name': 'Apple', 'slug': 'apple'},
            {'name': 'Google', 'slug': 'google'},
            {'name': 'OnePlus', 'slug': 'oneplus'},
            {'name': 'Xiaomi', 'slug': 'xiaomi'},
            {'name': 'Sony', 'slug': 'sony'},
            {'name': 'LG', 'slug': 'lg'},
            {'name': 'HP', 'slug': 'hp'},
            {'name': 'Dell', 'slug': 'dell'},
            {'name': 'Lenovo', 'slug': 'lenovo'},
        ]
        for brand_data in brands_data:
            Brand.objects.get_or_create(
                slug=brand_data['slug'],
                defaults=brand_data
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(brands_data)} Brands'))

        # Create Attributes
        # Storage
        storage_attr, _ = Attribute.objects.get_or_create(
            slug='storage',
            defaults={'name': 'Storage'}
        )
        storage_values = ['64GB', '128GB', '256GB', '512GB', '1TB']
        for value in storage_values:
            AttributeValue.objects.get_or_create(
                attribute=storage_attr,
                value=value,
                defaults={'slug': f'storage-{value.lower()}'}
            )

        # Color
        color_attr, _ = Attribute.objects.get_or_create(
            slug='color',
            defaults={'name': 'Color'}
        )
        color_values = [
            ('Titanium Black', '#1a1a1a'),
            ('Titanium Blue', '#4a6fa5'),
            ('Titanium White', '#f5f5f5'),
            ('Titanium Natural', '#8c7853'),
            ('Phantom Black', '#000000'),
            ('Cream', '#f5f5dc'),
            ('Green', '#228b22'),
            ('Lavender', '#e6e6fa'),
            ('Graphite', '#41424c'),
            ('Silver', '#c0c0c0'),
            ('Gold', '#ffd700'),
            ('Space Gray', '#4a4a4a'),
        ]
        for value, color_code in color_values:
            AttributeValue.objects.get_or_create(
                attribute=color_attr,
                value=value,
                defaults={
                    'slug': f'color-{value.lower().replace(" ", "-")}',
                    'color_code': color_code
                }
            )

        # RAM
        ram_attr, _ = Attribute.objects.get_or_create(
            slug='ram',
            defaults={'name': 'RAM'}
        )
        ram_values = ['4GB', '8GB', '12GB', '16GB', '32GB', '64GB']
        for value in ram_values:
            AttributeValue.objects.get_or_create(
                attribute=ram_attr,
                value=value,
                defaults={'slug': f'ram-{value.lower()}'}
            )

        self.stdout.write(self.style.SUCCESS('Created Attributes and Values'))

        # Create Samsung Products
        self.create_samsung_products()

        self.stdout.write(self.style.SUCCESS('Successfully seeded initial data!'))

    def create_samsung_products(self):
        """Create 10 Samsung phone demo products"""
        samsung = Brand.objects.get(slug='samsung')
        smartphones = Category.objects.get(slug='smartphones')
        storage_attr = Attribute.objects.get(slug='storage')
        color_attr = Attribute.objects.get(slug='color')

        samsung_phones = [
            {
                'name': 'Samsung Galaxy S24 Ultra',
                'short_description': 'The ultimate Galaxy experience with S Pen and advanced AI features',
                'description': '''<p>The Samsung Galaxy S24 Ultra represents the pinnacle of smartphone technology. Featuring a stunning 6.8-inch Dynamic AMOLED 2X display with 120Hz refresh rate, the S24 Ultra delivers breathtaking visuals.</p>
                <p>Powered by the Snapdragon 8 Gen 3 processor and equipped with up to 12GB of RAM, this device handles everything from intensive gaming to professional productivity with ease.</p>
                <p><strong>Key Features:</strong></p>
                <ul>
                    <li>200MP main camera with advanced AI processing</li>
                    <li>Built-in S Pen for notes and creativity</li>
                    <li>5000mAh battery with 45W fast charging</li>
                    <li>Titanium frame for durability</li>
                    <li>Galaxy AI features for enhanced productivity</li>
                </ul>''',
                'base_price': 189999,
                'sale_price': 179999,
                'is_featured': True,
                'is_new': True,
                'variations': [
                    {'storage': '256GB', 'colors': ['Titanium Black', 'Titanium Blue', 'Titanium White']},
                    {'storage': '512GB', 'colors': ['Titanium Black', 'Titanium Blue']},
                    {'storage': '1TB', 'colors': ['Titanium Black']},
                ]
            },
            {
                'name': 'Samsung Galaxy S24+',
                'short_description': 'Premium Galaxy experience with large display and powerful performance',
                'description': '''<p>The Galaxy S24+ delivers flagship performance in a sleek design. With its 6.7-inch QHD+ Dynamic AMOLED display and Snapdragon 8 Gen 3 processor, you get exceptional performance and stunning visuals.</p>
                <p><strong>Key Features:</strong></p>
                <ul>
                    <li>50MP main camera with Nightography</li>
                    <li>4900mAh battery with all-day power</li>
                    <li>Galaxy AI for smart features</li>
                    <li>IP68 water resistance</li>
                </ul>''',
                'base_price': 149999,
                'sale_price': None,
                'is_featured': True,
                'is_new': True,
                'variations': [
                    {'storage': '256GB', 'colors': ['Phantom Black', 'Cream', 'Lavender']},
                    {'storage': '512GB', 'colors': ['Phantom Black', 'Cream']},
                ]
            },
            {
                'name': 'Samsung Galaxy S24',
                'short_description': 'Compact flagship with Galaxy AI and premium features',
                'description': '''<p>The Galaxy S24 packs flagship features into a compact form. Perfect for those who prefer a smaller device without compromising on performance.</p>
                <p><strong>Key Features:</strong></p>
                <ul>
                    <li>6.2-inch Dynamic AMOLED display</li>
                    <li>50MP camera system</li>
                    <li>4000mAh battery</li>
                    <li>Galaxy AI features</li>
                </ul>''',
                'base_price': 119999,
                'sale_price': 109999,
                'is_featured': False,
                'is_new': True,
                'variations': [
                    {'storage': '128GB', 'colors': ['Phantom Black', 'Cream', 'Lavender']},
                    {'storage': '256GB', 'colors': ['Phantom Black', 'Cream']},
                ]
            },
            {
                'name': 'Samsung Galaxy Z Fold 5',
                'short_description': 'Revolutionary foldable smartphone with tablet-sized display',
                'description': '''<p>Unfold the future with Galaxy Z Fold 5. This innovative device transforms from a phone to a tablet, giving you the best of both worlds.</p>
                <p><strong>Key Features:</strong></p>
                <ul>
                    <li>7.6-inch foldable main display</li>
                    <li>6.2-inch cover display</li>
                    <li>Flex Mode for hands-free use</li>
                    <li>Multi-window productivity</li>
                    <li>IPX8 water resistance</li>
                </ul>''',
                'base_price': 259999,
                'sale_price': 239999,
                'is_featured': True,
                'is_new': False,
                'variations': [
                    {'storage': '256GB', 'colors': ['Phantom Black', 'Cream']},
                    {'storage': '512GB', 'colors': ['Phantom Black']},
                ]
            },
            {
                'name': 'Samsung Galaxy Z Flip 5',
                'short_description': 'Stylish flip phone with large cover screen',
                'description': '''<p>Make a statement with the Galaxy Z Flip 5. Its compact flip design and large cover screen make it the most stylish smartphone around.</p>
                <p><strong>Key Features:</strong></p>
                <ul>
                    <li>6.7-inch foldable display</li>
                    <li>3.4-inch cover screen</li>
                    <li>Flex Mode camera features</li>
                    <li>Compact pocket-friendly design</li>
                </ul>''',
                'base_price': 159999,
                'sale_price': None,
                'is_featured': True,
                'is_new': False,
                'variations': [
                    {'storage': '256GB', 'colors': ['Phantom Black', 'Cream', 'Lavender', 'Green']},
                    {'storage': '512GB', 'colors': ['Phantom Black', 'Cream']},
                ]
            },
            {
                'name': 'Samsung Galaxy A55 5G',
                'short_description': 'Premium mid-range phone with flagship features',
                'description': '''<p>The Galaxy A55 5G brings premium features to the mid-range segment. Enjoy flagship-level performance without breaking the bank.</p>
                <p><strong>Key Features:</strong></p>
                <ul>
                    <li>6.6-inch Super AMOLED display</li>
                    <li>50MP OIS camera</li>
                    <li>5000mAh battery</li>
                    <li>5G connectivity</li>
                    <li>IP67 water resistance</li>
                </ul>''',
                'base_price': 54999,
                'sale_price': 49999,
                'is_featured': False,
                'is_new': True,
                'variations': [
                    {'storage': '128GB', 'colors': ['Phantom Black', 'Lavender']},
                    {'storage': '256GB', 'colors': ['Phantom Black']},
                ]
            },
            {
                'name': 'Samsung Galaxy A35 5G',
                'short_description': 'Great value 5G smartphone with awesome display',
                'description': '''<p>Get amazing value with the Galaxy A35 5G. Features a stunning display and capable cameras at an affordable price.</p>
                <p><strong>Key Features:</strong></p>
                <ul>
                    <li>6.6-inch Super AMOLED display</li>
                    <li>50MP main camera</li>
                    <li>5000mAh battery</li>
                    <li>5G ready</li>
                </ul>''',
                'base_price': 39999,
                'sale_price': 36999,
                'is_featured': False,
                'is_new': True,
                'variations': [
                    {'storage': '128GB', 'colors': ['Phantom Black', 'Lavender', 'Cream']},
                    {'storage': '256GB', 'colors': ['Phantom Black']},
                ]
            },
            {
                'name': 'Samsung Galaxy A15 5G',
                'short_description': 'Affordable 5G smartphone for everyone',
                'description': '''<p>Experience 5G at an incredible price with the Galaxy A15. Perfect for those entering the 5G world.</p>
                <p><strong>Key Features:</strong></p>
                <ul>
                    <li>6.5-inch Super AMOLED display</li>
                    <li>50MP camera</li>
                    <li>5000mAh battery</li>
                    <li>5G connectivity</li>
                </ul>''',
                'base_price': 24999,
                'sale_price': 22999,
                'is_featured': False,
                'is_new': False,
                'variations': [
                    {'storage': '128GB', 'colors': ['Phantom Black', 'Lavender']},
                ]
            },
            {
                'name': 'Samsung Galaxy S23 FE',
                'short_description': 'Fan Edition with flagship features at great value',
                'description': '''<p>The Galaxy S23 FE delivers the features fans love most at a more accessible price point.</p>
                <p><strong>Key Features:</strong></p>
                <ul>
                    <li>6.4-inch Dynamic AMOLED display</li>
                    <li>50MP camera with Night Mode</li>
                    <li>4500mAh battery</li>
                    <li>IP68 water resistance</li>
                </ul>''',
                'base_price': 79999,
                'sale_price': 69999,
                'is_featured': True,
                'is_new': False,
                'variations': [
                    {'storage': '128GB', 'colors': ['Phantom Black', 'Cream', 'Green']},
                    {'storage': '256GB', 'colors': ['Phantom Black', 'Cream']},
                ]
            },
            {
                'name': 'Samsung Galaxy M55 5G',
                'short_description': 'Monster performance for gaming and multimedia',
                'description': '''<p>The Galaxy M55 5G is built for power users who demand top performance for gaming and content creation.</p>
                <p><strong>Key Features:</strong></p>
                <ul>
                    <li>6.7-inch Super AMOLED Plus display</li>
                    <li>Snapdragon 7 Gen 1 processor</li>
                    <li>50MP OIS camera</li>
                    <li>5000mAh battery with 45W charging</li>
                </ul>''',
                'base_price': 44999,
                'sale_price': None,
                'is_featured': False,
                'is_new': True,
                'variations': [
                    {'storage': '128GB', 'colors': ['Phantom Black']},
                    {'storage': '256GB', 'colors': ['Phantom Black']},
                ]
            },
        ]

        for phone_data in samsung_phones:
            slug = slugify(phone_data['name'])
            product, created = Product.objects.get_or_create(
                slug=slug,
                defaults={
                    'name': phone_data['name'],
                    'short_description': phone_data['short_description'],
                    'description': phone_data['description'],
                    'base_price': phone_data['base_price'],
                    'sale_price': phone_data['sale_price'],
                    'category': smartphones,
                    'brand': samsung,
                    'is_featured': phone_data['is_featured'],
                    'is_new': phone_data['is_new'],
                    'allow_financing': True,
                    'is_active': True,
                    'stock_quantity': 50,
                }
            )

            if created:
                # Create variations
                for var_data in phone_data['variations']:
                    storage_value = AttributeValue.objects.get(
                        attribute=storage_attr,
                        value=var_data['storage']
                    )
                    for color_name in var_data['colors']:
                        color_value = AttributeValue.objects.get(
                            attribute=color_attr,
                            value=color_name
                        )
                        variation = ProductVariation.objects.create(
                            product=product,
                            sku=f"{slug}-{var_data['storage'].lower()}-{slugify(color_name)}",
                            stock_quantity=20,
                            is_active=True,
                        )
                        variation.attribute_values.add(storage_value, color_value)

                self.stdout.write(f'  Created: {phone_data["name"]}')

        self.stdout.write(self.style.SUCCESS(f'Created {len(samsung_phones)} Samsung products'))
