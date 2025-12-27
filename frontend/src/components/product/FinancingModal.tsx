'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import api from '@/lib/api';
import type { Product, Sacco, PaymentTimeline } from '@/types';

interface FinancingModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  variationId?: number;
}

interface FormData {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  national_id: string;
  town_of_residence: string;
  sacco_id: string;
  payment_timeline_id: string;
  customer_notes: string;
}

const initialFormData: FormData = {
  first_name: '',
  last_name: '',
  phone_number: '',
  email: '',
  national_id: '',
  town_of_residence: '',
  sacco_id: '',
  payment_timeline_id: '',
  customer_notes: '',
};

export default function FinancingModal({ isOpen, onClose, product, variationId }: FinancingModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [saccos, setSaccos] = useState<Sacco[]>([]);
  const [timelines, setTimelines] = useState<PaymentTimeline[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Saccos and Payment Timelines
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      Promise.all([
        api.get('/financing/saccos/'),
        api.get('/financing/payment-timelines/')
      ])
        .then(([saccosRes, timelinesRes]) => {
          setSaccos(saccosRes.data.results || saccosRes.data);
          setTimelines(timelinesRes.data.results || timelinesRes.data);
        })
        .catch(err => {
          console.error('Error fetching data:', err);
          setError('Failed to load financing options');
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormData);
      setIsSuccess(false);
      setError(null);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await api.post('/financing/financing-requests/', {
        product: product.id,
        variation: variationId || null,
        sacco: parseInt(formData.sacco_id),
        payment_timeline: parseInt(formData.payment_timeline_id),
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        email: formData.email,
        national_id: formData.national_id,
        town_of_residence: formData.town_of_residence,
        customer_notes: formData.customer_notes,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {isSuccess ? 'Request Submitted!' : 'Select Financing'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
          ) : isSuccess ? (
            <div className="p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Thank You!
              </h3>
              <p className="text-gray-600 mb-6">
                We have received your information and we&apos;ll get back to you as soon as possible.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Product Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Selected Product</p>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-primary-600 font-semibold">{formatPrice(product.current_price)}</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Personal Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="e.g., 0712345678"
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    National ID Number *
                  </label>
                  <input
                    type="text"
                    name="national_id"
                    value={formData.national_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Town of Residence *
                  </label>
                  <input
                    type="text"
                    name="town_of_residence"
                    value={formData.town_of_residence}
                    onChange={handleChange}
                    placeholder="e.g., Nairobi, Mombasa, Kisumu"
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Financing Options */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Financing Options</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sacco of Your Choice *
                  </label>
                  <select
                    name="sacco_id"
                    value={formData.sacco_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select a Sacco</option>
                    {saccos.map(sacco => (
                      <option key={sacco.id} value={sacco.id}>
                        {sacco.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Payment Timeline *
                  </label>
                  <select
                    name="payment_timeline_id"
                    value={formData.payment_timeline_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select timeline</option>
                    {timelines.map(timeline => (
                      <option key={timeline.id} value={timeline.id}>
                        {timeline.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="customer_notes"
                    value={formData.customer_notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="Any additional information..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'w-full py-3 rounded-lg font-medium text-white transition-all',
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                )}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  'Submit Financing Request'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By submitting, you agree to our Terms of Service and Privacy Policy. 
                Your information will be shared with the selected Sacco for processing.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
