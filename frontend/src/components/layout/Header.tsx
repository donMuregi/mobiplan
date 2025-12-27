'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, User, ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import CartDrawer from './CartDrawer';

const navigation = [
  { 
    name: 'Smartphones', 
    href: '/shop',
    children: [
      { name: 'Samsung', href: '/shop?category=samsung-smartphones' },
      { name: 'Apple', href: '/shop?category=apple-smartphones' },
      { name: 'Tecno', href: '/shop?category=tecno-smartphones' },
      { name: 'Infinix', href: '/shop?category=infinix-smartphones' },
      { name: 'Oppo', href: '/shop?category=oppo-smartphones' },
      { name: 'Redmi', href: '/shop?category=redmi-smartphones' },
    ]
  },
  { 
    name: 'Home Appliances', 
    href: '/shop',
    children: [
      { name: 'Refrigerators', href: '/shop?category=refrigerators' },
      { name: 'Washing Machines', href: '/shop?category=washing-machines' },
      { name: 'TVs', href: '/shop?category=tvs' },
    ]
  },
  { name: 'MFI/Sacco', href: '/mfi-sacco-partnership' },
  { name: 'Smart Farmer Program', href: '/smart-farmer-smartphone-program' },
  { name: 'About', href: '/about' },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const { cart, isCartOpen, setIsCartOpen } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <header 
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled 
            ? 'bg-white shadow-md' 
            : 'bg-white'
        )}
      >
        {/* Top Bar */}
        <div className="hidden lg:block border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-end items-center h-8 text-xs text-gray-600">
              <Link href="/support" className="hover:text-primary-600 transition-colors">
                Support
              </Link>
              <span className="mx-3 text-gray-300">|</span>
              <Link href="/for-business" className="hover:text-primary-600 transition-colors flex items-center">
                For Business
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo and Navigation - Left Aligned */}
            <div className="flex items-center gap-4 xl:gap-6">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0">
                <Image 
                  src="/logo.png" 
                  alt="MobiPlan" 
                  width={300} 
                  height={90} 
                  className="h-16 lg:h-20 w-auto"
                  priority
                />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-2 xl:space-x-4">
              {navigation.map((item) => (
                <div 
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.children && setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'text-xs xl:text-sm font-medium transition-colors flex items-center py-2 whitespace-nowrap',
                      pathname === item.href || pathname.startsWith(item.href + '/')
                        ? 'text-primary-600'
                        : 'text-gray-700 hover:text-primary-600'
                    )}
                  >
                    {item.name}
                    {item.children && (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    )}
                  </Link>
                  
                  {/* Dropdown */}
                  {item.children && activeDropdown === item.name && (
                    <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-lg py-2 mt-0">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden lg:block relative">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-40 xl:w-48 pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </form>
              </div>

              {/* Mobile Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart && cart.total_items > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                    {cart.total_items}
                  </span>
                )}
              </button>

              {/* User Account */}
              <Link
                href={isAuthenticated ? '/account' : '/login'}
                className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="lg:hidden px-4 pb-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </form>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t">
            <nav className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'block py-2 text-base font-medium',
                      pathname === item.href
                        ? 'text-primary-600'
                        : 'text-gray-700'
                    )}
                  >
                    {item.name}
                  </Link>
                  {item.children && (
                    <div className="pl-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-1.5 text-sm text-gray-500 hover:text-primary-600"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="h-16 lg:h-28" />

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
