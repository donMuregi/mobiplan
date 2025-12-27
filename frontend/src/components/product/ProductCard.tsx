'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn, formatPrice, getImageUrl } from '@/lib/utils';
import { useCartStore } from '@/store/cart';
import type { Product } from '@/types';
import FinancingModal from './FinancingModal';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartStore();
  const [selectedVariations, setSelectedVariations] = useState<Record<string, number>>({});
  const [isFinancingOpen, setIsFinancingOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const variationsSummary = product.variations_summary || {};

  const handleVariationSelect = (attributeName: string, valueId: number) => {
    setSelectedVariations(prev => ({
      ...prev,
      [attributeName]: valueId
    }));
  };

  const handleBuyCash = async () => {
    setIsAddingToCart(true);
    
    // Find the variation ID if variations are selected
    let variationId: number | undefined;
    // For now, just add the base product
    
    const result = await addToCart(product.id, variationId, 1);
    
    if (result.success) {
      setShowAddedMessage(true);
      setTimeout(() => setShowAddedMessage(false), 3000);
    }
    
    setIsAddingToCart(false);
  };

  return (
    <>
      <div className="group bg-white rounded-2xl p-4 shadow-sm transition-all duration-300 hover:shadow-xl">
        {/* Product Image */}
        <Link href={`/product/${product.slug}`} className="block relative">
          <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4">
            <Image
              src={getImageUrl(product.main_image)}
              alt={product.name}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              unoptimized
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.discount_percentage > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded">
                  -{product.discount_percentage}%
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Product Info */}
        <div className="space-y-3">
          {/* Category */}
          {product.category_name && (
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {product.category_name}
            </p>
          )}

          {/* Title */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Storage Variations - Only show storage, not colors */}
          {Object.keys(variationsSummary).length > 0 && (
            <div className="space-y-2">
              {Object.entries(variationsSummary)
                .filter(([attributeName]) => attributeName.toLowerCase() !== 'color')
                .map(([attributeName, values]) => (
                <div key={attributeName}>
                  <div className="flex flex-wrap gap-1.5">
                    {values.slice(0, 3).map((value) => (
                      <button
                        key={value.id}
                        onClick={() => handleVariationSelect(attributeName, value.id)}
                        className={cn(
                          'px-2 py-1 text-xs border rounded-md transition-all',
                          selectedVariations[attributeName] === value.id
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        )}
                      >
                        {value.value}
                      </button>
                    ))}
                    {values.length > 3 && (
                      <span className="px-2 py-1 text-xs text-gray-400">+{values.length - 3}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-accent">
              {formatPrice(product.current_price)}
            </span>
            {product.sale_price && product.base_price > product.sale_price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.base_price)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleBuyCash}
              disabled={isAddingToCart || !product.is_in_stock}
              className={cn(
                'w-full py-3 rounded-full font-medium text-sm transition-all',
                product.is_in_stock
                  ? 'bg-accent text-white hover:bg-accent-dark active:scale-[0.98]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              )}
            >
              {isAddingToCart ? 'Adding...' : product.is_in_stock ? 'Buy Cash' : 'Out of Stock'}
            </button>

            {product.allow_financing && product.is_in_stock && (
              <button
                onClick={() => setIsFinancingOpen(true)}
                className="w-full py-3 rounded-full font-medium text-sm border-2 border-gray-200 text-gray-700 hover:border-primary-600 hover:text-primary-600 transition-all active:scale-[0.98]"
              >
                Select Financing
              </button>
            )}
          </div>
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
      </div>

      {/* Financing Modal */}
      <FinancingModal
        isOpen={isFinancingOpen}
        onClose={() => setIsFinancingOpen(false)}
        product={product}
      />
    </>
  );
}
