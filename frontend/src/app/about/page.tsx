'use client';

import Link from 'next/link';
import { Target, Eye, Heart, Users, Smartphone, Globe, Award, TrendingUp } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a2b4a] to-[#2a3b5a] py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            About Mobiplan
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Empowering communities through accessible technology and innovative smartphone financing solutions.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1a2b4a] mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Mobiplan was founded with a simple yet powerful vision: to make smartphones accessible to everyone, regardless of their financial situation.
                </p>
                <p>
                  We recognized that in today&apos;s digital world, a smartphone is not just a luxury—it&apos;s a necessity for accessing information, financial services, education, and opportunities.
                </p>
                <p>
                  Through partnerships with Saccos, Microfinance Institutions, and community organizations across Kenya, we&apos;ve helped thousands of individuals and families access quality smartphones through flexible, affordable financing plans.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#e67e22]/10 to-[#e67e22]/5 rounded-2xl p-12 flex items-center justify-center">
              <div className="text-center">
                <Smartphone className="w-24 h-24 text-[#e67e22] mx-auto mb-4" />
                <p className="text-[#1a2b4a] font-semibold text-lg">Connecting Communities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-[#1a2b4a] rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1a2b4a] mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To bridge the digital divide by providing affordable smartphone financing solutions that empower individuals, farmers, and communities to access technology that transforms their lives and livelihoods.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-[#e67e22] rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1a2b4a] mb-4">Our Vision</h3>
              <p className="text-gray-600">
                A world where everyone has access to the digital tools they need to thrive—where technology is a bridge to opportunity, not a barrier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1a2b4a] mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Accessibility */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#e67e22]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-[#e67e22]" />
              </div>
              <h3 className="text-lg font-bold text-[#1a2b4a] mb-2">Accessibility</h3>
              <p className="text-gray-600 text-sm">
                Making technology accessible to everyone, regardless of income level
              </p>
            </div>

            {/* Integrity */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#e67e22]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-[#e67e22]" />
              </div>
              <h3 className="text-lg font-bold text-[#1a2b4a] mb-2">Integrity</h3>
              <p className="text-gray-600 text-sm">
                Transparent pricing, honest communication, and fair practices
              </p>
            </div>

            {/* Innovation */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#e67e22]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-[#e67e22]" />
              </div>
              <h3 className="text-lg font-bold text-[#1a2b4a] mb-2">Innovation</h3>
              <p className="text-gray-600 text-sm">
                Continuously improving our solutions to better serve our customers
              </p>
            </div>

            {/* Impact */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#e67e22]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-[#e67e22]" />
              </div>
              <h3 className="text-lg font-bold text-[#1a2b4a] mb-2">Impact</h3>
              <p className="text-gray-600 text-sm">
                Measuring success by the positive change we create in communities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 lg:py-20 bg-[#1a2b4a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl lg:text-5xl font-bold text-[#e67e22] mb-2">10K+</p>
              <p className="text-gray-300">Devices Financed</p>
            </div>
            <div>
              <p className="text-4xl lg:text-5xl font-bold text-[#e67e22] mb-2">50+</p>
              <p className="text-gray-300">Partner Saccos</p>
            </div>
            <div>
              <p className="text-4xl lg:text-5xl font-bold text-[#e67e22] mb-2">47</p>
              <p className="text-gray-300">Counties Reached</p>
            </div>
            <div>
              <p className="text-4xl lg:text-5xl font-bold text-[#e67e22] mb-2">98%</p>
              <p className="text-gray-300">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1a2b4a] mb-6">
            Join Our Mission
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Whether you&apos;re looking for an affordable smartphone or want to partner with us to help your community, we&apos;re here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/shop" 
              className="px-8 py-3 bg-[#e67e22] text-white font-semibold rounded-full hover:bg-[#d46a1a] transition-colors"
            >
              Shop Smartphones
            </Link>
            <Link 
              href="/mfi-sacco-partnership" 
              className="px-8 py-3 bg-[#1a2b4a] text-white font-semibold rounded-full hover:bg-[#2a3b5a] transition-colors"
            >
              Become a Partner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
