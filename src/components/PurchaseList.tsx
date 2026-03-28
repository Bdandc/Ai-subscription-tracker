import { Trash2, Zap } from 'lucide-react';
import { Purchase } from '../types';
import { format } from 'date-fns';
import { CURRENCY_SYMBOLS } from '../constants';

interface PurchaseListProps {
  purchases: Purchase[];
  onDelete: (id: string) => void;
}

export default function PurchaseList({ purchases, onDelete }: PurchaseListProps) {
  if (purchases.length === 0) {
    return (
      <div className="card p-8 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-[--muted] rounded-full flex items-center justify-center mb-3">
          <Zap className="w-5 h-5 text-[--muted-foreground]" />
        </div>
        <p className="text-sm font-medium text-[--foreground]">No top-ups logged yet</p>
        <p className="text-xs text-[--muted-foreground] mt-1">Add a purchase when you hit a limit or buy extra credits.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {purchases.map(p => (
        <div key={p.id} className="card p-4 flex items-center justify-between group hover:border-blue-400 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="font-semibold text-[--foreground] text-sm">{p.service}</p>
              <p className="text-xs text-[--muted-foreground] mt-0.5">
                {format(new Date(p.purchaseDate), 'dd MMM yyyy')}
                {p.notes && <span className="ml-2 opacity-75">· {p.notes}</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-mono font-bold text-[--foreground]">
              {CURRENCY_SYMBOLS[p.currency] || p.currency}{p.amount.toFixed(2)}
            </p>
            <button
              onClick={() => onDelete(p.id)}
              className="p-1.5 hover:bg-[--muted] rounded-lg text-[--muted-foreground] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
