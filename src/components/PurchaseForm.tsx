import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Purchase } from '../types';
import { CURRENCY_SYMBOLS } from '../constants';

interface PurchaseFormProps {
  onSave: (p: Purchase) => void;
  onClose: () => void;
}

const inputClass = "w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all";
const labelClass = "block text-sm font-semibold text-slate-700 mb-1";

export default function PurchaseForm({ onSave, onClose }: PurchaseFormProps) {
  const [formData, setFormData] = useState<Partial<Purchase>>({
    service: '',
    amount: 0,
    currency: 'USD',
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.service || !formData.amount) return;
    onSave({ ...formData, id: crypto.randomUUID() } as Purchase);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Log Credit Top-up</h2>
            <p className="text-xs text-slate-500 mt-0.5">One-off token purchase or spending cap extension</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelClass}>Service</label>
            <input
              type="text"
              required
              className={inputClass}
              placeholder="Anthropic, OpenAI, etc."
              value={formData.service}
              onChange={e => setFormData({ ...formData, service: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Currency</label>
              <select
                className={inputClass}
                value={formData.currency}
                onChange={e => setFormData({ ...formData, currency: e.target.value })}
              >
                {Object.entries(CURRENCY_SYMBOLS).map(([code, symbol]) => (
                  <option key={code} value={code}>{code} ({symbol})</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {CURRENCY_SYMBOLS[formData.currency || 'USD']}
                </span>
                <input
                  type="number"
                  required
                  step="0.01"
                  className={`${inputClass} pl-8`}
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Date</label>
            <input
              type="date"
              required
              className={inputClass}
              value={formData.purchaseDate}
              onChange={e => setFormData({ ...formData, purchaseDate: e.target.value })}
            />
          </div>

          <div>
            <label className={labelClass}>Notes <span className="font-normal text-slate-400">(optional)</span></label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. Hit rate limit, extended cap by $10"
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-200/30 transition-all active:scale-95"
            >
              Log Purchase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
