import { Edit2, Trash2, Calendar, CreditCard } from 'lucide-react';
import { Subscription } from '../types';
import { format } from 'date-fns';
import { CURRENCY_SYMBOLS } from '../constants';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
}

export default function SubscriptionList({ subscriptions, onEdit, onDelete }: SubscriptionListProps) {
  if (subscriptions.length === 0) {
    return (
      <div className="card p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <CreditCard className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">No subscriptions yet</h3>
        <p className="text-slate-500 mt-2 max-w-xs">
          Add your first subscription to start tracking your monthly spending and get AI insights.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {subscriptions.map(sub => (
        <div key={sub.id} className="card p-4 flex items-center justify-between group hover:border-blue-200 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 font-bold text-lg border border-slate-100">
              {sub.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-slate-900">{sub.name}</h4>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  {sub.category}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Next: {format(new Date(sub.nextBillingDate), 'MMM dd')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  <span className="capitalize">{sub.billingCycle}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="font-mono font-bold text-slate-900 text-lg">
                {CURRENCY_SYMBOLS[sub.currency] || sub.currency}{sub.amount.toFixed(2)}
              </p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                {sub.billingCycle === 'yearly' ? 'Per Year' : 'Per Month'}
              </p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onEdit(sub)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onDelete(sub.id)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
