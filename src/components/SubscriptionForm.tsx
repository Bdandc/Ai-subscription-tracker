import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Subscription, SubscriptionCategory } from '../types';
import { cn } from '../lib/utils';
import { CURRENCY_SYMBOLS } from '../constants';

interface SubscriptionFormProps {
  onSave: (sub: Subscription) => void;
  onClose: () => void;
  initialData?: Subscription;
}

const CATEGORIES: SubscriptionCategory[] = [
  'Entertainment', 'Software', 'Health', 'Utilities', 'Finance', 'Education', 'Other'
];

export default function SubscriptionForm({ onSave, onClose, initialData }: SubscriptionFormProps) {
  const [formData, setFormData] = useState<Partial<Subscription>>(
    initialData || {
      name: '',
      amount: 0,
      currency: 'GBP',
      billingCycle: 'monthly',
      category: 'Entertainment',
      nextBillingDate: new Date().toISOString().split('T')[0],
      description: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;

    onSave({
      ...formData,
      id: initialData?.id || crypto.randomUUID(),
    } as Subscription);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-900">
            {initialData ? 'Edit Subscription' : 'Add New Subscription'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Netflix, Spotify, etc."
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
              <select
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                value={formData.currency}
                onChange={e => setFormData({ ...formData, currency: e.target.value })}
              >
                {Object.entries(CURRENCY_SYMBOLS).map(([code, symbol]) => (
                  <option key={code} value={code}>{code} ({symbol})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {CURRENCY_SYMBOLS[formData.currency || 'GBP']}
                </span>
                <input
                  type="number"
                  required
                  step="0.01"
                  className="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Billing Cycle</label>
            <select
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
              value={formData.billingCycle}
              onChange={e => setFormData({ ...formData, billingCycle: e.target.value as 'monthly' | 'yearly' })}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value as SubscriptionCategory })}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Next Billing Date</label>
            <input
              type="date"
              required
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={formData.nextBillingDate}
              onChange={e => setFormData({ ...formData, nextBillingDate: e.target.value })}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              {initialData ? 'Update' : 'Add Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
