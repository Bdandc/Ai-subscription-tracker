import { useState, useRef, useEffect } from 'react';
import { Edit2, Trash2, Calendar, CreditCard, FolderInput } from 'lucide-react';
import { Subscription, TrackerList } from '../types';
import { format } from 'date-fns';
import { CURRENCY_SYMBOLS } from '../constants';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  lists?: TrackerList[];
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
  onMove?: (sub: Subscription, targetListId: string) => void;
}

function MovePopover({
  sub,
  lists,
  onMove,
  onClose,
}: {
  sub: Subscription;
  lists: TrackerList[];
  onMove: (sub: Subscription, targetListId: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const targets = lists.filter(l => l.id !== sub.listId);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  if (targets.length === 0) {
    return (
      <div ref={ref} className="absolute right-0 top-full mt-1 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-3 text-xs text-[--muted-foreground] whitespace-nowrap">
        No other lists to move to.
      </div>
    );
  }

  return (
    <div ref={ref} className="absolute right-0 top-full mt-1 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden min-w-[160px]">
      <p className="px-3 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-widest text-[--muted-foreground]">Move to</p>
      {targets.map(list => (
        <button
          key={list.id}
          onClick={() => { onMove(sub, list.id); onClose(); }}
          className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[--muted] transition-colors text-sm text-left"
        >
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: list.color }} />
          <span className="font-medium text-[--foreground]">{list.name}</span>
        </button>
      ))}
    </div>
  );
}

export default function SubscriptionList({ subscriptions, lists = [], onEdit, onDelete, onMove }: SubscriptionListProps) {
  const [movingSubId, setMovingSubId] = useState<string | null>(null);

  if (subscriptions.length === 0) {
    return (
      <div className="card p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-[--muted] rounded-full flex items-center justify-center mb-4">
          <CreditCard className="w-8 h-8 text-[--muted-foreground]" />
        </div>
        <h3 className="text-lg font-semibold text-[--foreground]">No subscriptions yet</h3>
        <p className="text-[--muted-foreground] mt-2 max-w-xs">
          Add your first subscription to start tracking your monthly spending.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {subscriptions.map(sub => (
        <div key={sub.id} className="card p-4 flex items-center justify-between group hover:border-blue-400 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[--muted] flex items-center justify-center text-[--foreground] font-bold text-lg border border-[--border]">
              {sub.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-[--foreground]">{sub.name}</h4>
                <span className="px-2 py-0.5 rounded-full bg-[--muted] text-[10px] font-bold text-[--muted-foreground] uppercase tracking-wider">
                  {sub.category}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-[--muted-foreground] font-medium">
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
              <p className="font-mono font-bold text-[--foreground] text-lg">
                {CURRENCY_SYMBOLS[sub.currency] || sub.currency}{sub.amount.toFixed(2)}
              </p>
              <p className="text-[10px] text-[--muted-foreground] uppercase font-bold tracking-widest">
                {sub.billingCycle === 'yearly' ? 'Per Year' : 'Per Month'}
              </p>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onMove && lists.length > 1 && (
                <div className="relative">
                  <button
                    onClick={() => setMovingSubId(movingSubId === sub.id ? null : sub.id)}
                    className="p-2 hover:bg-[--muted] rounded-lg text-[--muted-foreground] hover:text-violet-500 transition-colors"
                    title="Move to another list"
                  >
                    <FolderInput className="w-4 h-4" />
                  </button>
                  {movingSubId === sub.id && (
                    <MovePopover
                      sub={sub}
                      lists={lists}
                      onMove={onMove}
                      onClose={() => setMovingSubId(null)}
                    />
                  )}
                </div>
              )}
              <button
                onClick={() => onEdit(sub)}
                className="p-2 hover:bg-[--muted] rounded-lg text-[--muted-foreground] hover:text-blue-500 transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(sub.id)}
                className="p-2 hover:bg-[--muted] rounded-lg text-[--muted-foreground] hover:text-red-500 transition-colors"
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
