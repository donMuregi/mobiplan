'use client';

import Link from 'next/link';
import { Building2, Users, Handshake, TrendingUp, Shield, Phone, Mail, MapPin } from 'lucide-react';

export default function MFISaccoPartnershipPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a2b4a] to-[#2a3b5a] py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            MFI / Sacco Partnership
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Partner with Mobiplan to bring affordable smartphone financing to your members. Together, we can empower communities through accessible technology.
          </p>
          <Link 
            href="#contact" 
            className="inline-block px-8 py-4 bg-[#e67e22] text-white font-semibold rounded-full hover:bg-[#d46a1a] transition-colors"
          >
            Become a Partner
          </Link>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1a2b4a] mb-4">
              Why Partner With Mobiplan?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide the technology, devices, and support. You provide access to your members. It&apos;s a partnership that benefits everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Increased Member Value */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-[#e67e22]/10 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-[#e67e22]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a2b4a] mb-3">Increased Member Value</h3>
              <p className="text-gray-600">
                Offer your members access to quality smartphones through flexible financing plans they can afford.
              </p>
            </div>

            {/* New Revenue Stream */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-[#e67e22]/10 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-[#e67e22]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a2b4a] mb-3">New Revenue Stream</h3>
              <p className="text-gray-600">
                Generate additional income through partnership commissions while helping your members.
              </p>
            </div>

            {/* Full Support */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-[#e67e22]/10 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-[#e67e22]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a2b4a] mb-3">Full Support</h3>
              <p className="text-gray-600">
                We handle device procurement, delivery, and after-sales support. You focus on your members.
              </p>
            </div>

            {/* Digital Integration */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-[#e67e22]/10 rounded-xl flex items-center justify-center mb-6">
                <Building2 className="w-7 h-7 text-[#e67e22]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a2b4a] mb-3">Digital Integration</h3>
              <p className="text-gray-600">
                Our Distributor App integrates seamlessly with your operations for easy tracking and management.
              </p>
            </div>

            {/* Flexible Terms */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-[#e67e22]/10 rounded-xl flex items-center justify-center mb-6">
                <Handshake className="w-7 h-7 text-[#e67e22]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a2b4a] mb-3">Flexible Terms</h3>
              <p className="text-gray-600">
                Customizable payment timelines from 3 to 12 months to suit your members&apos; needs.
              </p>
            </div>

            {/* Training & Resources */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-[#e67e22]/10 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-[#e67e22]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a2b4a] mb-3">Training & Resources</h3>
              <p className="text-gray-600">
                Comprehensive training for your staff and marketing materials to promote the program.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1a2b4a] mb-4">
              How The Partnership Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Partner Agreement', desc: 'Sign a partnership agreement outlining terms and commissions.' },
              { step: '02', title: 'Integration Setup', desc: 'We set up the digital tools and train your team.' },
              { step: '03', title: 'Member Enrollment', desc: 'Your members apply for smartphones through your Sacco/MFI.' },
              { step: '04', title: 'Device Delivery', desc: 'We deliver devices and handle all after-sales support.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-[#e67e22] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-[#1a2b4a] mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1a2b4a] mb-6">
                Ready to Partner?
              </h2>
              <p className="text-gray-600 mb-8">
                Get in touch with our partnerships team to learn more about how we can work together to empower your members with affordable smartphones.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#e67e22]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#e67e22]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1a2b4a]">Phone</h4>
                    <p className="text-gray-600">+254 700 000 000</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#e67e22]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#e67e22]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1a2b4a]">Email</h4>
                    <p className="text-gray-600">partnerships@mobiplan.co.ke</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#e67e22]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#e67e22]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1a2b4a]">Location</h4>
                    <p className="text-gray-600">Nairobi, Kenya</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-[#1a2b4a] mb-6">Send us a message</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#e67e22] focus:border-transparent outline-none"
                    placeholder="Your Sacco/MFI name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#e67e22] focus:border-transparent outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#e67e22] focus:border-transparent outline-none"
                    placeholder="email@organization.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#e67e22] focus:border-transparent outline-none"
                    placeholder="+254 7XX XXX XXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#e67e22] focus:border-transparent outline-none"
                    placeholder="Tell us about your organization and how you'd like to partner..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#e67e22] text-white font-semibold rounded-lg hover:bg-[#d46a1a] transition-colors"
                >
                  Submit Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
