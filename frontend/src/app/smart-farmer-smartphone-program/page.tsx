'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Smartphone, Wifi, Cpu, Leaf, Building2, Users, Clock, Shield, Sparkles } from 'lucide-react';

export default function SmartFarmerSmartphoneProgramPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1a2b4a] via-[#2a3b5a] to-[#1a2b4a] py-20 lg:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-block px-4 py-2 bg-[#e67e22] text-white text-sm font-medium rounded-full mb-6">
                Showcasing SFSP
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Smart Farmer Smartphone Program
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Revolutionizing digital agriculture by empowering farmers through accessible technology, AI-powered apps, and connectivity.
              </p>
              
              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#e67e22]/20 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-[#e67e22]" />
                  </div>
                  <span className="text-white font-medium">Quality Devices</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#e67e22]/20 rounded-lg flex items-center justify-center">
                    <Wifi className="w-5 h-5 text-[#e67e22]" />
                  </div>
                  <span className="text-white font-medium">Free 5GB Data</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#e67e22]/20 rounded-lg flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-[#e67e22]" />
                  </div>
                  <span className="text-white font-medium">Agri Apps</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#e67e22]/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#e67e22]" />
                  </div>
                  <span className="text-white font-medium">Full Support</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/shop" 
                  className="px-8 py-4 bg-[#e67e22] text-white font-semibold rounded-full hover:bg-[#d46a1a] transition-colors text-center"
                >
                  Get Started Today
                </Link>
                <Link 
                  href="#learn-more" 
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-semibold rounded-full hover:bg-white/20 transition-colors text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Floating Cards */}
                <div className="absolute top-0 right-0 w-48 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Cpu className="w-8 h-8 text-[#e67e22]" />
                    <span className="text-white font-semibold">AI-Powered</span>
                  </div>
                  <p className="text-gray-300 text-sm">Smart farming insights</p>
                </div>

                <div className="absolute bottom-20 left-0 w-56 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Leaf className="w-8 h-8 text-[#e67e22]" />
                    <span className="text-white font-semibold">Weather Monitoring</span>
                  </div>
                  <p className="text-gray-300 text-sm">Real-time forecasts</p>
                </div>

                {/* Central Phone Mockup */}
                <div className="relative z-10 mx-auto w-64 h-[500px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-3 shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 rounded-[2.5rem] flex items-center justify-center overflow-hidden">
                    <div className="text-center text-white">
                      <Smartphone className="w-20 h-20 mx-auto mb-4" />
                      <p className="font-bold text-lg">SFSP Device</p>
                      <p className="text-sm opacity-80">Preloaded Apps</p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-32 -right-8 w-52 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="w-8 h-8 text-[#e67e22]" />
                    <span className="text-white font-semibold">Market Access</span>
                  </div>
                  <p className="text-gray-300 text-sm">Connect to buyers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="bg-gray-50 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* The Program */}
            <div>
              <p className="text-gray-600 mb-2">• The Program</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1a2b4a] mb-4">
                What&apos;s Included?
              </h2>
              <p className="text-gray-600">
                Smart Farmer Smartphone Programme is designed to revolutionize digital agriculture by empowering farmers through accessible technology.
              </p>
            </div>

            {/* Smartphone */}
            <div>
              <h3 className="text-xl font-bold text-[#e67e22] mb-3">Smartphone</h3>
              <p className="text-gray-600">
                Mobiplan provides affordable smartphones preloaded with AI-based agricultural apps, weather monitoring tools, and market access platforms.
              </p>
            </div>

            {/* 5GB Net For 30 Days */}
            <div>
              <h3 className="text-xl font-bold text-[#e67e22] mb-3">5GB Net For 30 Days</h3>
              <p className="text-gray-600">
                The program comes with free Net ensuring that every individual, can connect, learn, and grow.
              </p>
            </div>

            {/* AI-Enhanced Apps */}
            <div>
              <h3 className="text-xl font-bold text-[#e67e22] mb-3">AI-Enhanced Apps</h3>
              <p className="text-gray-600">
                These apps analyze weather patterns, predict soil and crop health, and guide farmers on the best planting or harvesting times.
              </p>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 mt-12">
            <div></div>
            
            {/* Agricultural Apps */}
            <div>
              <h3 className="text-xl font-bold text-[#e67e22] mb-3">Agricultural Apps</h3>
              <p className="text-gray-600">
                These apps are carefully selected to support day-to-day activities, increase productivity, and strengthen financial resilience.
              </p>
            </div>

            {/* Distributor's Internal App */}
            <div>
              <h3 className="text-xl font-bold text-[#e67e22] mb-3">Distributor&apos;s Internal App</h3>
              <p className="text-gray-600">
                This app serves as a central digital hub – connecting field agents, partner MFIs, and customers through a single, efficient interface.
              </p>
            </div>

            {/* Why This Matters To Distributor Clients */}
            <div>
              <h3 className="text-xl font-bold text-[#e67e22] mb-3">Why This Matters To Distributor Clients</h3>
              <p className="text-gray-600">
                Empowers clients by giving them real-time control, transparency, and convenience – all from their smartphones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Enhanced Apps Section */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1a2b4a] mb-8">
            AI-Enhanced Apps
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gray-600 text-lg leading-relaxed">
                SFSP comes with AI-powered Applications designed to boost productivity, improve decision-making, and connect farmers to real-time insights.
              </p>
              <Link 
                href="/shop" 
                className="inline-block mt-8 px-8 py-3 bg-[#1a2b4a] text-white font-medium rounded-full hover:bg-[#2a3b5a] transition-colors"
              >
                Learn More
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src="/images/farmer-avocado.jpg"
                  alt="Farmer with avocado"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src="/images/farmer-market.jpg"
                  alt="Farmer at market with phone"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agricultural And Livelihood Apps Section */}
      <section className="bg-gray-50 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* App Screenshot */}
            <div className="relative">
              <div className="bg-gray-900 rounded-2xl p-4 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">PlantVillage</h4>
                    <p className="text-gray-400 text-sm">PlantVillage</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                  <span>4.8 ★</span>
                  <span>50 MB</span>
                  <span>Rated E</span>
                </div>
                <button className="w-full py-3 bg-blue-100 text-blue-600 font-medium rounded-lg mb-4">
                  Install
                </button>
                <p className="text-gray-400 text-sm mb-4">Install on phone. More devices available</p>
                
                {/* App Screenshots Grid */}
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-[9/16] bg-gray-800 rounded-lg overflow-hidden">
                      <div className="h-full flex items-center justify-center">
                        <Leaf className="w-8 h-8 text-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <p className="text-[#e67e22] font-medium mb-2">• Pre-Installed</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1a2b4a] mb-6">
                Agricultural And Livelihood Apps
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Farmers will gain access to <strong>crop and livestock management tools</strong>, <strong>digital weather forecasting</strong>, and <strong>market linkage platforms</strong> that connect them directly to buyers, suppliers, and training opportunities.
              </p>
              <Link 
                href="/shop" 
                className="inline-block px-8 py-3 bg-[#1a2b4a] text-white font-medium rounded-full hover:bg-[#2a3b5a] transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Distributor's App Section */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1a2b4a] mb-2">
              Distributor&apos;s App
            </h2>
            <p className="text-[#e67e22] font-medium">Digital Branch</p>
          </div>

          {/* Image */}
          <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-green-300 flex items-center justify-center">
              <div className="text-center">
                <Users className="w-24 h-24 text-green-600 mx-auto mb-4" />
                <p className="text-green-700 text-lg">Connecting Communities</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="max-w-4xl mx-auto space-y-6 text-gray-600">
            <p>
              Also known as the Digital Branch, is a transformative mobile platform designed to simplify operations for distributors and clients alike. This app serves as a central digital hub — connecting field agents, partner MFIs, and customers through a single, efficient interface.
            </p>
            
            <p className="font-semibold text-[#1a2b4a]">Through the Digital Branch, clients can:</p>
            
            <ul className="space-y-3 list-disc list-inside">
              <li>View loan balances and repayment schedules in real time, ensuring full financial transparency.</li>
              <li>Apply for new smartphone loans directly from the app — anytime, anywhere.</li>
              <li>Access instant customer support, enabling quicker resolution of issues and better communication.</li>
              <li>Engage in digitized group services, including savings groups and community updates.</li>
            </ul>
            
            <p>
              For distributors, the app enhances tracking, reporting, and customer relationship management — reducing paperwork and boosting operational efficiency. Each transaction and interaction is securely recorded, improving accountability and data-driven decision-making.
            </p>
            
            <p>
              With the Distributor&apos;s Internal App, Mobiplan bridges the gap between technology and accessibility, enabling seamless digital service delivery to both rural and urban communities.
            </p>
          </div>
        </div>
      </section>

      {/* Why This Matters To Distributor Clients Section */}
      <section className="bg-gray-50 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1a2b4a] mb-8">
                Why This Matters To Distributor Clients
              </h2>

              {/* 01 Real-Time Control */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h3 className="text-xl font-bold text-[#e67e22] mb-3">01 Real-Time Control</h3>
                <p className="text-gray-600">
                  The Distributor&apos;s Internal App empowers clients by giving them real-time control, transparency, and convenience – all from their smartphones.
                </p>
              </div>

              {/* 02 Support 24/7 */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h3 className="text-xl font-bold text-[#e67e22] mb-3">02 Support 24/7</h3>
                <p className="text-gray-600">
                  Clients no longer need to visit physical offices to check loan details or request support. Instead, they can manage their financing, apply for upgrades, and communicate directly with Mobiplan&apos;s support team in seconds.
                </p>
              </div>

              {/* 03 Digital Experience */}
              <div>
                <h3 className="text-xl font-bold text-[#e67e22] mb-3">03 Digital Experience</h3>
                <p className="text-gray-600">
                  The streamlined digital experience will help build trust, efficiency, and stronger business relationships, ensuring that distributors can serve more customers faster while maintaining accountability.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 h-96 bg-gradient-to-b from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <Smartphone className="w-20 h-20 text-orange-500 mx-auto mb-4" />
                    <p className="text-orange-600 font-medium">Digital Empowerment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smartphone + 5GB Net Section */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="flex justify-center">
              <div className="relative w-80 h-96 bg-gradient-to-b from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="relative">
                    <Smartphone className="w-24 h-24 text-blue-600 mx-auto" />
                    <Wifi className="w-8 h-8 text-green-500 absolute -top-2 -right-2" />
                  </div>
                  <p className="text-blue-600 font-medium mt-4">Stay Connected</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1a2b4a] mb-6">
                Smartphone + 5GB Net For 30 Days
              </h2>
              <p className="text-gray-600 text-lg">
                Mobiplan provides affordable smartphones preloaded with AI-based agricultural apps, weather monitoring tools, and market access platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-[#1a2b4a] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white text-center mb-12">
            Program Benefits
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Affordable Technology */}
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-[#e67e22]" />
              </div>
              <h3 className="text-white font-semibold mb-2">Affordable Technology</h3>
              <p className="text-gray-400 text-sm">
                Quality smartphones at accessible prices for every farmer
              </p>
            </div>

            {/* Free Connectivity */}
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="w-8 h-8 text-[#e67e22]" />
              </div>
              <h3 className="text-white font-semibold mb-2">Free Connectivity</h3>
              <p className="text-gray-400 text-sm">
                5GB data for 30 days to get you started
              </p>
            </div>

            {/* AI-Powered Insights */}
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cpu className="w-8 h-8 text-[#e67e22]" />
              </div>
              <h3 className="text-white font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-gray-400 text-sm">
                Smart apps that help you make better farming decisions
              </p>
            </div>

            {/* Market Access */}
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-[#e67e22]" />
              </div>
              <h3 className="text-white font-semibold mb-2">Market Access</h3>
              <p className="text-gray-400 text-sm">
                Connect directly with buyers and suppliers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#e67e22] py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Join the Smart Farmer Smartphone Program today and get access to technology that empowers your agricultural business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/shop" 
              className="px-8 py-3 bg-white text-[#e67e22] font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
            <Link 
              href="/mfi-sacco-partnership" 
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
