'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Smartphone, Tablet, Laptop, Watch, Headphones, Cable, Building2, Lock, Truck, Wrench, Users } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { api } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import { Product, Category, HomepageSlider } from '@/types';

// Hero Slider Component
function HeroSlider() {
  const [sliders, setSliders] = useState<HomepageSlider[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await api.get('/store/sliders/');
        setSliders(response.data.results || response.data || []);
      } catch (error) {
        console.error('Error fetching sliders:', error);
        // Use default slides if API fails
        setSliders([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSliders();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (sliders.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 15000);
    return () => clearInterval(timer);
  }, [sliders.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliders.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length);
  };

  // Default slides when no data from API
  const defaultSlides = [
    {
      id: 1,
      title: 'Latest Smartphones',
      subtitle: 'Experience the future of mobile technology',
      description: 'Get the latest flagship phones with flexible financing options through our Sacco partners.',
      image: null,
      button_text: 'Shop Now',
      button_link: '/shop?category=smartphones',
      gradient: 'from-blue-600 to-purple-700',
    },
    {
      id: 2,
      title: 'Finance Your Dream Device',
      subtitle: 'Easy payment plans available',
      description: 'Partner with your Sacco to get the device you need with convenient monthly payments.',
      image: null,
      button_text: 'Learn More',
      button_link: '/financing',
      gradient: 'from-emerald-600 to-teal-700',
    },
    {
      id: 3,
      title: 'Premium Accessories',
      subtitle: 'Complete your setup',
      description: 'Discover our wide range of accessories to enhance your tech experience.',
      image: null,
      button_text: 'Explore',
      button_link: '/shop?category=accessories',
      gradient: 'from-orange-500 to-red-600',
    },
  ];

  const displaySlides = sliders.length > 0 ? sliders : defaultSlides;

  if (isLoading) {
    return (
      <div className="relative h-[500px] md:h-[600px] bg-gradient-to-r from-primary to-primary-dark animate-pulse flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden">
      {/* Slides */}
      <div 
        className="flex h-full transition-transform duration-1200 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {displaySlides.map((slide: any, index: number) => (
          <div
            key={slide.id || index}
            className={`relative min-w-full h-full ${slide.image ? '' : `bg-gradient-to-r ${slide.gradient || 'from-primary to-primary-dark'}`}`}
          >
            {/* Background Image */}
            {slide.image ? (
              <div className="absolute inset-0">
                <Image
                  src={getImageUrl(slide.image)}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  unoptimized
                />
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
              </div>
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient || 'from-primary to-primary-dark'}`} />
            )}
            
            {/* Content */}
            <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="max-w-2xl text-white">
                {slide.subtitle && (
                  <p className="text-sm md:text-base font-medium text-white/80 mb-2 tracking-wide uppercase">
                    {slide.subtitle}
                  </p>
                )}
                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                  {slide.title}
                </h1>
                {slide.description && (
                  <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                    {slide.description}
                  </p>
                )}
                {slide.button_text && slide.button_link && (
                  <Link
                    href={slide.button_link}
                    className="inline-flex items-center px-8 py-4 bg-white text-primary font-semibold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                  >
                    {slide.button_text}
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {displaySlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {displaySlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
          {displaySlides.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Category fallback images
const categoryImages: Record<string, string> = {
  // Device types
  smartphones: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
  tablets: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
  laptops: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
  wearables: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
  audio: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
  accessories: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
  // Brand-specific fallbacks
  apple: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
  samsung: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
  tecno: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
  infinix: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400&h=400&fit=crop',
  oppo: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop',
  redmi: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
  default: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
};

// Categories Section
function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/store/categories/');
        setCategories(response.data.results || response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const getCategoryImage = (category: Category) => {
    if (category.image) {
      // Image URL is already complete from the API
      return category.image;
    }
    return categoryImages[category.slug.toLowerCase()] || categoryImages.default;
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group flex flex-col items-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="relative w-28 h-28 rounded-xl overflow-hidden mb-4 bg-gray-100">
                <Image
                  src={getCategoryImage(category)}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  unoptimized
                />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors text-center">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Our Approach / About Section
function OurApproachSection() {
  const approaches = [
    {
      icon: Building2,
      text: 'Enable financial institutions to provide secured digital devices financing',
    },
    {
      icon: Lock,
      text: 'Offer a locking mechanism to mitigate loan default risks',
    },
    {
      icon: Truck,
      text: 'Enable last-mile delivery via bank branches, courier pick-ups, or home delivery',
    },
    {
      icon: Wrench,
      text: 'Provide device management, unlocking support & after-sales service',
    },
    {
      icon: Users,
      text: 'Empower under served communities with digital and financial tools',
    },
  ];

  const stats = [
    { value: '2022', label: 'Incorporated', icon: Building2 },
    { value: '2000+', label: 'Smartphones', icon: Smartphone },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2">
              <span className="text-primary font-semibold tracking-wide uppercase text-sm">
                MFI/Sacco Device Financing
              </span>
              <div className="h-px w-12 bg-primary"></div>
            </div>

            {/* Heading */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                <span className="italic">Enabling Secured</span>
                <br />
                <span className="text-primary italic">SmartPhone Loans</span>
              </h2>
              <p className="mt-4 text-gray-600 text-lg">
                A Solution for Banks & Microfinance Institutions, 2025 and Beyond. An initiative of Energy Bora.
              </p>
            </div>

            {/* Our Approach List */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-5">Our Approach</h3>
              <ul className="space-y-4">
                {approaches.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <li key={index} className="flex items-start gap-4 group">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <IconComponent className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <p className="text-gray-700 pt-2">{item.text}</p>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Stats */}
            <div className="flex gap-12 pt-4">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-xl shadow-lg flex items-center justify-center border border-gray-100">
                      <IconComponent className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary">{stat.value}</div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            {/* Decorative Border */}
            <div className="absolute inset-0 rounded-[40%_60%_50%_50%/60%_40%_60%_40%] border-4 border-primary transform translate-x-4 translate-y-4"></div>
            
            {/* Main Image Container */}
            <div className="relative rounded-[40%_60%_50%_50%/60%_40%_60%_40%] overflow-hidden border-4 border-secondary bg-gray-200 aspect-square">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=800&fit=crop"
                alt="Team collaborating with technology"
                fill
                className="object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <div className="font-bold text-gray-900">Trusted Partner</div>
                <div className="text-sm text-gray-500">For Saccos & MFIs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Featured Products Section
function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/store/products/?is_featured=true&limit=8');
        setProducts(response.data.results || response.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Featured Products
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-[300px] lg:h-[400px] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <Link
            href="/shop"
            className="text-primary font-medium hover:underline flex items-center"
          >
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured products available yet.</p>
            <Link href="/shop" className="text-primary font-medium hover:underline mt-2 inline-block">
              Browse all products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

// Financing CTA Section
function FinancingCTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-6">
              Finance Your Purchase Through Your Sacco
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Partner with your Sacco to get the device you need with convenient monthly payment plans. 
              Choose from 3 to 24 months financing options with competitive rates.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
                <div className="text-3xl font-bold">3-24</div>
                <div className="text-sm text-white/80">Month Plans</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
                <div className="text-3xl font-bold">4+</div>
                <div className="text-sm text-white/80">Partner Saccos</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
                <div className="text-3xl font-bold">Easy</div>
                <div className="text-sm text-white/80">Application</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h3>
            <div className="space-y-4">
              {[
                { step: 1, title: 'Choose Your Device', desc: 'Browse our selection of phones and electronics' },
                { step: 2, title: 'Select Financing', desc: 'Click "Select Financing" on any product' },
                { step: 3, title: 'Fill the Form', desc: 'Provide your details and select your Sacco' },
                { step: 4, title: 'Get Approved', desc: 'Your Sacco will contact you to complete the process' },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Latest Products Section
function LatestProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/store/products/?ordering=-created_at&limit=8');
        setProducts(response.data.results || response.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            New Arrivals
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-[300px] lg:h-[400px] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
          <Link
            href="/shop?sort=newest"
            className="text-primary font-medium hover:underline flex items-center"
          >
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No products available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}

// How It Works / Features Section
function HowItWorksSection() {
  const features = [
    {
      id: 1,
      title: 'Secured Financing via MobiPlan Platform',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4l-2-2" />
        </svg>
      ),
      image: 'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=400&h=500&fit=crop',
      gradient: 'from-yellow-400 to-orange-500',
    },
    {
      id: 2,
      title: 'Smartphone locking ensures Compliance',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=500&fit=crop',
      gradient: 'from-green-400 to-teal-500',
    },
    {
      id: 3,
      title: 'Flexible delivery options enhance accessibility',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=500&fit=crop',
      gradient: 'from-purple-400 to-indigo-500',
    },
    {
      id: 4,
      title: 'Aftersales management to device during & after financing period',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop',
      gradient: 'from-orange-400 to-red-500',
    },
  ];

  return (
    <section className="py-16 bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group relative h-[420px] rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Default State - Bottom Banner */}
              <div className="absolute inset-x-0 bottom-0 bg-slate-800/95 p-4 transition-all duration-300 group-hover:opacity-0">
                <div className="flex items-start gap-3">
                  <div className="text-blue-400 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <h3 className="text-white text-sm font-medium leading-tight">
                    {feature.title}
                  </h3>
                </div>
              </div>

              {/* Hover State - Full Overlay */}
              <div className="absolute inset-0 bg-slate-900/85 flex flex-col items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="text-blue-400 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-white text-xl font-semibold text-center leading-tight mb-6">
                  {feature.title}
                </h3>
                <Link
                  href="/shop"
                  className="px-6 py-2.5 border border-white/50 text-white text-sm font-medium rounded hover:bg-white hover:text-slate-900 transition-colors"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Partners Logo Slider Section
function PartnersSection() {
  // Partner logos - replace with actual partner logos
  const partners = [
    { id: 1, name: 'Safaricom', logo: 'https://placehold.co/200x80/ffffff/333333?text=Safaricom' },
    { id: 2, name: 'Samsung', logo: 'https://placehold.co/200x80/ffffff/333333?text=Samsung' },
    { id: 3, name: 'Mwalimu Sacco', logo: 'https://placehold.co/200x80/ffffff/333333?text=Mwalimu+Sacco' },
    { id: 4, name: 'Yehu Microfinance', logo: 'https://placehold.co/200x80/ffffff/333333?text=Yehu' },
    { id: 5, name: 'Apple', logo: 'https://placehold.co/200x80/ffffff/333333?text=Apple' },
    { id: 6, name: 'Google', logo: 'https://placehold.co/200x80/ffffff/333333?text=Google' },
    { id: 7, name: 'Juhudi Kilimo', logo: 'https://placehold.co/200x80/ffffff/333333?text=Juhudi+Kilimo' },
    { id: 8, name: 'National Police Sacco', logo: 'https://placehold.co/200x80/ffffff/333333?text=NP+Sacco' },
  ];

  // Duplicate partners for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
          Our Partners
        </h2>
        <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
          We work with leading brands and Saccos to bring you the best devices and financing options.
        </p>
      </div>
      
      {/* Infinite Scrolling Logo Strip */}
      <div className="relative">
        <div className="flex animate-scroll">
          {duplicatedPartners.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="flex-shrink-0 mx-8 flex items-center justify-center"
            >
              <div className="w-[180px] h-[80px] bg-gray-50 rounded-lg flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={160}
                  height={60}
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS for infinite scroll animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

// Newsletter Section
function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    // TODO: Implement newsletter subscription API
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Stay Updated
        </h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter for the latest deals, new arrivals, and exclusive offers.
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-6 py-4 rounded-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        {status === 'success' && (
          <p className="text-secondary mt-4">Thank you for subscribing!</p>
        )}
      </div>
    </section>
  );
}

// Main Homepage Component
export default function Home() {
  return (
    <main>
      <HeroSlider />
      <CategoriesSection />
      <OurApproachSection />
      <FeaturedProducts />
      <FinancingCTA />
      <LatestProducts />
      <HowItWorksSection />
      <PartnersSection />
      <Newsletter />
    </main>
  );
}
