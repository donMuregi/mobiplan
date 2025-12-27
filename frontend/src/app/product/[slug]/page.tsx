'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Minus, Plus, Check, Heart, Share2, Shield, RotateCcw } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { api } from '@/lib/api';
import { formatPrice, getImageUrl } from '@/lib/utils';
import FinancingModal from '@/components/product/FinancingModal';
import ProductCard from '@/components/product/ProductCard';
import type { Product, ProductVariation, AttributeValue } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, number>>({});
  const [quantity, setQuantity] = useState(1);
  const [isFinancingOpen, setIsFinancingOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

  const { addToCart } = useCartStore();

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/store/products/${slug}/`);
        setProduct(response.data);
        
        // Fetch related products - cheapest in the same category
        const categoryId = response.data.category?.id || response.data.category;
        if (categoryId) {
          const categorySlug = response.data.category?.slug;
          const relatedRes = await api.get(`/store/products/?${categorySlug ? `category__slug=${categorySlug}` : `category=${categoryId}`}&ordering=base_price`);
          const related = (relatedRes.data.results || relatedRes.data || [])
            .filter((p: Product) => p.id !== response.data.id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  // Find matching variation based on selected attributes
  useEffect(() => {
    if (!product?.variations?.length) return;
    
    const matchingVariation = product.variations.find(variation => {
      return variation.attribute_values.every(av => 
        selectedAttributes[av.attribute_name] === av.id
      );
    });
    
    setSelectedVariation(matchingVariation || null);
  }, [selectedAttributes, product]);

  const handleAttributeSelect = (attributeName: string, valueId: number) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attributeName]: valueId
    }));
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    const result = await addToCart(product.id, selectedVariation?.id, quantity);
    
    if (result.success) {
      setShowAddedMessage(true);
      setTimeout(() => setShowAddedMessage(false), 3000);
    }
    
    setIsAddingToCart(false);
  };

  const currentPrice = selectedVariation?.price || product?.current_price || 0;
  const basePrice = product?.base_price || 0;
  const hasDiscount = product?.sale_price && basePrice > product.sale_price;
  
  // Build images array - always include main_image first, then additional images
  const buildImageGallery = () => {
    const gallery: { id: number; image: string; alt_text: string; is_primary: boolean; order: number }[] = [];
    
    // Add main image first if it exists
    if (product?.main_image) {
      gallery.push({
        id: 0,
        image: product.main_image,
        alt_text: product.name,
        is_primary: true,
        order: 0
      });
    }
    
    // Add additional images (filter out duplicates of main_image)
    if (product?.images?.length) {
      product.images.forEach((img, index) => {
        if (img.image !== product.main_image) {
          gallery.push({
            ...img,
            id: img.id || index + 1,
            order: index + 1
          });
        }
      });
    }
    
    return gallery.length > 0 ? gallery : [{ id: 0, image: '', alt_text: product?.name || '', is_primary: true, order: 0 }];
  };
  
  const images = buildImageGallery();
  const isInStock = selectedVariation ? selectedVariation.stock_quantity > 0 : (product?.is_in_stock ?? false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-100 rounded-2xl h-[500px] animate-pulse" />
            <div className="space-y-4">
              <div className="bg-gray-100 h-8 w-3/4 rounded animate-pulse" />
              <div className="bg-gray-100 h-12 w-1/2 rounded animate-pulse" />
              <div className="bg-gray-100 h-32 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Link href="/shop" className="text-primary hover:underline">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/shop" className="hover:text-gray-700">Shop</Link>
            {product.category_name && (
              <>
                <ChevronRight className="h-4 w-4 mx-2" />
                <Link 
                  href={`/shop?category=${typeof product.category === 'object' ? product.category.slug : ''}`}
                  className="hover:text-gray-700"
                >
                  {product.category_name}
                </Link>
              </>
            )}
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden">
              <Image
                src={getImageUrl(images[selectedImage]?.image || product.main_image)}
                alt={images[selectedImage]?.alt_text || product.name}
                fill
                className="object-contain p-8"
                priority
                unoptimized
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.discount_percentage > 0 && (
                  <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                    -{product.discount_percentage}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Image Gallery Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <Image
                    src={getImageUrl(image.image)}
                    alt={image.alt_text || `${product.name} ${index + 1}`}
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand */}
            {product.brand_name && (
              <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                {product.brand_name}
              </p>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-accent">
                {formatPrice(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(basePrice)}
                </span>
              )}
            </div>

            {/* Short Description */}
            {product.short_description && (
              <div className="text-gray-600 leading-relaxed">
                <ul className="space-y-1.5">
                  {product.short_description
                    .replace(/<[^>]*>/g, '') // Remove HTML tags
                    .replace(/&amp;/g, '&') // Decode HTML entities
                    .split(/[•·\n]/) // Split by bullet points or newlines
                    .map(item => item.trim())
                    .filter(item => item.length > 0)
                    .slice(0, 6) // Show first 6 points for short description
                    .map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-primary">•</span>
                        <span>{item}</span>
                      </li>
                    ))
                  }
                </ul>
              </div>
            )}

            {/* Variations */}
            {product.variations_summary && Object.keys(product.variations_summary).length > 0 && (
              <div className="space-y-4 pt-4 border-t">
                {Object.entries(product.variations_summary).map(([attributeName, values]) => (
                  <div key={attributeName}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {attributeName}
                      {selectedAttributes[attributeName] && (
                        <span className="text-gray-500 font-normal ml-2">
                          - {values.find(v => v.id === selectedAttributes[attributeName])?.value}
                        </span>
                      )}
                    </label>
                    
                    {attributeName.toLowerCase() === 'color' ? (
                      <div className="flex flex-wrap gap-2">
                        {values.map((value) => (
                          <button
                            key={value.id}
                            onClick={() => handleAttributeSelect(attributeName, value.id)}
                            className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                              selectedAttributes[attributeName] === value.id
                                ? 'border-primary ring-2 ring-primary ring-offset-2'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            style={{ backgroundColor: value.color_code || '#ccc' }}
                            title={value.value}
                          >
                            {selectedAttributes[attributeName] === value.id && (
                              <Check className={`h-5 w-5 ${
                                value.color_code?.toLowerCase() === '#ffffff' ? 'text-gray-800' : 'text-white'
                              }`} />
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {values.map((value) => (
                          <button
                            key={value.id}
                            onClick={() => handleAttributeSelect(attributeName, value.id)}
                            className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all ${
                              selectedAttributes[attributeName] === value.id
                                ? 'border-primary bg-primary text-white'
                                : 'border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            {value.value}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="pt-4 border-t">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-50 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className={`text-sm ${isInStock ? 'text-green-600' : 'text-red-500'}`}>
                  {isInStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !isInStock}
                className={`flex-1 py-4 rounded-full font-semibold text-lg transition-all ${
                  isInStock
                    ? 'bg-accent text-white hover:bg-accent-dark'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isAddingToCart ? 'Adding...' : isInStock ? 'Buy Cash' : 'Out of Stock'}
              </button>

              {product.allow_financing && isInStock && (
                <button
                  onClick={() => setIsFinancingOpen(true)}
                  className="flex-1 py-4 rounded-full font-semibold text-lg border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary transition-all"
                >
                  Select Financing
                </button>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t">
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="text-xs text-gray-600">Warranty Available on All Products</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="text-xs text-gray-600">Fast Delivery</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="border-b">
            <nav className="flex gap-8">
              {[
                { id: 'description', label: 'Description' },
                { id: 'specifications', label: 'Specifications' },
                { id: 'reviews', label: 'Reviews' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="bg-white rounded-xl p-6">
                {product.description ? (
                  <ul className="space-y-2">
                    {product.description
                      .replace(/<[^>]*>/g, '') // Remove HTML tags
                      .split(/[•·\n]/) // Split by bullet points or newlines
                      .map(item => item.trim())
                      .filter(item => item.length > 0)
                      .map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-600">
                          <span className="text-primary mt-1.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))
                    }
                  </ul>
                ) : (
                  <p className="text-gray-500">No description available.</p>
                )}
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div className="bg-white rounded-xl p-6">
                {product.attributes && product.attributes.length > 0 ? (
                  <table className="w-full">
                    <tbody>
                      {product.attributes.map((attr, index) => (
                        <tr key={attr.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                          <td className="py-3 px-4 font-medium text-gray-700">{attr.attribute_name}</td>
                          <td className="py-3 px-4 text-gray-600">{attr.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">No specifications available.</p>
                )}
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No reviews yet.</p>
                <button className="text-primary font-medium hover:underline">
                  Be the first to review this product
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              More {product.category_name ? `${product.category_name} ` : ''}Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Added to Cart Message */}
      {showAddedMessage && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom fade-in duration-300">
          <p className="font-medium">Added to cart!</p>
          <Link href="/cart" className="text-sm underline">
            View Cart
          </Link>
        </div>
      )}

      {/* Financing Modal */}
      <FinancingModal
        isOpen={isFinancingOpen}
        onClose={() => setIsFinancingOpen(false)}
        product={product}
        variationId={selectedVariation?.id}
      />
    </div>
  );
}
