'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Filter, X, ChevronDown, ChevronRight, Grid, List, SlidersHorizontal, Loader2 } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { api } from '@/lib/api';
import { Product, Category, Brand } from '@/types';

const sortOptions = [
  { value: '-created_at', label: 'Newest' },
  { value: 'created_at', label: 'Oldest' },
  { value: 'base_price', label: 'Price: Low to High' },
  { value: '-base_price', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A to Z' },
  { value: '-name', label: 'Name: Z to A' },
];

// Recursive category item component for nested categories
interface CategoryItemProps {
  category: Category;
  categorySlug: string;
  expandedCategories: Set<number>;
  toggleCategoryExpansion: (id: number) => void;
  updateParams: (key: string, value: string) => void;
  level: number;
}

function CategoryItem({
  category,
  categorySlug,
  expandedCategories,
  toggleCategoryExpansion,
  updateParams,
  level,
}: CategoryItemProps) {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedCategories.has(category.id);
  const isSelected = categorySlug === category.slug;
  const hasProducts = category.product_count > 0;

  return (
    <li>
      <div className="flex items-center">
        {hasChildren && (
          <button
            onClick={() => toggleCategoryExpansion(category.id)}
            className="p-1 hover:bg-gray-100 rounded mr-1"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-gray-500" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-500" />
            )}
          </button>
        )}
        {!hasChildren && <span className="w-5" />}
        <button
          onClick={() => updateParams('category', category.slug)}
          className={`flex-1 text-left py-1 text-sm truncate ${
            isSelected
              ? 'text-primary font-medium'
              : hasProducts
              ? 'text-gray-700 hover:text-gray-900'
              : 'text-gray-400'
          }`}
          style={{ paddingLeft: `${level * 8}px` }}
        >
          {category.name}
          {hasProducts && (
            <span className="text-gray-400 ml-1 text-xs">({category.product_count})</span>
          )}
        </button>
      </div>
      {hasChildren && isExpanded && (
        <ul className="ml-2 border-l border-gray-100 pl-2 space-y-0.5">
          {category.children.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              categorySlug={categorySlug}
              expandedCategories={expandedCategories}
              toggleCategoryExpansion={toggleCategoryExpansion}
              updateParams={updateParams}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function ShopPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  
  // Filter state from URL
  const categorySlug = searchParams.get('category') || '';
  const brandSlug = searchParams.get('brand') || '';
  const sortBy = searchParams.get('sort') || '-created_at';
  const searchQuery = searchParams.get('q') || '';
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';
  const page = parseInt(searchParams.get('page') || '1');

  // Fetch categories and brands
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          api.get('/store/categories/'),
          api.get('/store/brands/'),
        ]);
        setCategories(categoriesRes.data.results || categoriesRes.data || []);
        setBrands(brandsRes.data.results || brandsRes.data || []);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
    fetchFilters();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (categorySlug) params.append('category', categorySlug);
        if (brandSlug) params.append('brand', brandSlug);
        if (sortBy) params.append('ordering', sortBy);
        if (searchQuery) params.append('search', searchQuery);
        if (minPrice) params.append('min_price', minPrice);
        if (maxPrice) params.append('max_price', maxPrice);
        params.append('page', page.toString());

        const response = await api.get(`/store/products/?${params.toString()}`);
        setProducts(response.data.results || response.data || []);
        setTotalCount(response.data.count || response.data.length || 0);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [categorySlug, brandSlug, sortBy, searchQuery, minPrice, maxPrice, page]);

  // Update URL params
  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset page on filter change, but not when changing page itself
    if (key !== 'page') {
      params.delete('page');
    }
    router.push(`/shop?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/shop');
  };

  const toggleCategoryExpansion = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Check if category or any of its descendants match the current filter
  const isCategoryOrChildSelected = (category: Category): boolean => {
    if (category.slug === categorySlug) return true;
    return category.children?.some(child => isCategoryOrChildSelected(child)) ?? false;
  };

  // Auto-expand categories that contain the selected category
  useEffect(() => {
    if (categorySlug) {
      const findAndExpandParents = (cats: Category[], parentIds: number[] = []): boolean => {
        for (const cat of cats) {
          if (cat.slug === categorySlug) {
            setExpandedCategories(prev => new Set([...prev, ...parentIds]));
            return true;
          }
          if (cat.children?.length > 0) {
            if (findAndExpandParents(cat.children, [...parentIds, cat.id])) {
              return true;
            }
          }
        }
        return false;
      };
      findAndExpandParents(categories);
    }
  }, [categorySlug, categories]);

  const hasActiveFilters = categorySlug || brandSlug || minPrice || maxPrice;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {searchQuery ? `Search results for "${searchQuery}"` : 'Shop'}
          </h1>
          <p className="text-gray-500 mt-2">
            {totalCount} {totalCount === 1 ? 'product' : 'products'} found
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 flex flex-col max-h-[calc(100vh-8rem)]">
              {/* Scrollable Categories & Brands */}
              <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                {/* Categories */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                  <ul className="space-y-1">
                    <li>
                      <button
                        onClick={() => updateParams('category', '')}
                        className={`w-full text-left py-1.5 text-sm ${
                          !categorySlug ? 'text-primary font-medium' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        All Categories
                      </button>
                    </li>
                    {categories.map((category) => (
                      <CategoryItem
                        key={category.id}
                        category={category}
                        categorySlug={categorySlug}
                        expandedCategories={expandedCategories}
                        toggleCategoryExpansion={toggleCategoryExpansion}
                        updateParams={updateParams}
                        level={0}
                      />
                    ))}
                  </ul>
                </div>

                {/* Brands */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4">Brands</h3>
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => updateParams('brand', '')}
                        className={`w-full text-left py-1.5 text-sm ${
                          !brandSlug ? 'text-primary font-medium' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        All Brands
                      </button>
                    </li>
                    {brands.map((brand) => (
                      <li key={brand.id}>
                        <button
                          onClick={() => updateParams('brand', brand.slug)}
                          className={`w-full text-left py-1.5 text-sm ${
                            brandSlug === brand.slug
                              ? 'text-primary font-medium'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          {brand.name}
                          {brand.product_count > 0 && (
                            <span className="text-gray-400 ml-1">({brand.product_count})</span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Fixed bottom section */}
              <div className="flex-shrink-0 space-y-4 pt-4">
                {/* Price Range */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => updateParams('min_price', e.target.value)}
                      className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-gray-400 self-center">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => updateParams('max_price', e.target.value)}
                      className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="w-full py-3 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-4 shadow-sm">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <span className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                    !
                  </span>
                )}
              </button>

              {/* Active Filters - Desktop */}
              <div className="hidden lg:flex items-center gap-2 flex-wrap">
                {categorySlug && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-sm rounded-full">
                    {categories.find(c => c.slug === categorySlug)?.name}
                    <button onClick={() => updateParams('category', '')} className="hover:text-primary">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {brandSlug && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-sm rounded-full">
                    {brands.find(b => b.slug === brandSlug)?.name}
                    <button onClick={() => updateParams('brand', '')} className="hover:text-primary">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-500">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => updateParams('sort', e.target.value)}
                  className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-2xl h-[400px] animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl">
                <div className="text-gray-400 mb-4">
                  <Filter className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary-dark transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalCount > 12 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  {page > 1 && (
                    <button
                      onClick={() => updateParams('page', (page - 1).toString())}
                      className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50"
                    >
                      Previous
                    </button>
                  )}
                  <span className="px-4 py-2 text-sm text-gray-500">
                    Page {page} of {Math.ceil(totalCount / 12)}
                  </span>
                  {page < Math.ceil(totalCount / 12) && (
                    <button
                      onClick={() => updateParams('page', (page + 1).toString())}
                      className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute inset-y-0 left-0 w-full max-w-xs bg-white overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => { updateParams('category', ''); setShowFilters(false); }}
                      className={`w-full text-left py-1.5 text-sm ${
                        !categorySlug ? 'text-primary font-medium' : 'text-gray-600'
                      }`}
                    >
                      All Categories
                    </button>
                  </li>
                  {categories.map((category) => (
                    <CategoryItem
                      key={category.id}
                      category={category}
                      categorySlug={categorySlug}
                      expandedCategories={expandedCategories}
                      toggleCategoryExpansion={toggleCategoryExpansion}
                      updateParams={(key, value) => { updateParams(key, value); setShowFilters(false); }}
                      level={0}
                    />
                  ))}
                </ul>
              </div>

              {/* Brands */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Brands</h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => { updateParams('brand', ''); setShowFilters(false); }}
                      className={`w-full text-left py-1.5 text-sm ${
                        !brandSlug ? 'text-primary font-medium' : 'text-gray-600'
                      }`}
                    >
                      All Brands
                    </button>
                  </li>
                  {brands.map((brand) => (
                    <li key={brand.id}>
                      <button
                        onClick={() => { updateParams('brand', brand.slug); setShowFilters(false); }}
                        className={`w-full text-left py-1.5 text-sm ${
                          brandSlug === brand.slug ? 'text-primary font-medium' : 'text-gray-600'
                        }`}
                      >
                        {brand.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => updateParams('min_price', e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-lg"
                  />
                  <span className="text-gray-400 self-center">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => updateParams('max_price', e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-lg"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={() => { clearFilters(); setShowFilters(false); }}
                  className="w-full py-3 text-sm font-medium text-primary border border-primary rounded-lg"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>}>
      <ShopPageInner />
    </Suspense>
  );
}
